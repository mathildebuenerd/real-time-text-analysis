import * as sentiment from "node-sentiment-jouska";
console.log(`sentiment`, sentiment);
// import * as darktriad from "darktriad";
import * as bigfive from "bigfive";

export class TextAnalysisService {

    constructor() {
        console.log(`sentiment constructeur`, sentiment);
    }

    public extractClauses(sentence) {

        // on sépare les différentes phrases ou propositions (clauses) du SMS reçu
        // ça permet d'avoir de bien meilleurs résultats pour l'analyse de sentiment
        // car dès qu'il y a une négation, la valence de tous les mots est inversée
        // ---------------
        // Par exemple :
        // sentiment(`My husband is not nice, but I still love him`); // -6, because 2 positive words and negation = true
        // sentiment(`My husband is not nice,`); // -3, because 1 positive word and negation = true
        // sentiment(`but I still love him`); // 3, because 1 positive word and negation = false

        let sentenceToSlice = sentence;
        const separators = new RegExp(/[.?!,]\s| et | and /, 'gim'); // les séparateurs sont la ponctuation basique et le mot et/and

        let array; //  c'est le tableau qui récupère les résultats de la fonction exec
        let subSentences = []; // on stocke les "sous-phrases" là dedans
        while ((array = separators.exec(sentenceToSlice)) !== null) {
            const subSentence = sentenceToSlice.slice(0, array.index);
            subSentences.push(subSentence);
            sentenceToSlice = sentenceToSlice.replace(subSentence, '');
        }

        if (subSentences.length > 1) { // si on a trouvé plusieurs propositions, on renvoie le tableau des propositions
            return subSentences;
        } else {
            return sentence; // sinon, on renvoie la phrase originale
        }

    }

    public updateSentimentAnalysis() {
        let smsData = JSON.parse(localStorage.getItem('smsData'));
        for (const contact in smsData) {
            for (const type in smsData[contact]) { // type = inbox | sent | name
                if (type !== 'name') { // on ne boucle que dans inbox et sent
                    for (const singleSMS in smsData[contact][type]) {
                        const originalSMS = smsData[contact][type][singleSMS].text.original;
                        smsData[contact][type][singleSMS].analysis.sentimentFr = {};
                        smsData[contact][type][singleSMS].analysis.sentimentFr = this.sentimentAnalysis(originalSMS, 'fr');
                    }
                }
            }
        }
        console.log("anlayse que je refais:");
        console.log(smsData);
    }

    public sentimentAnalysis(
        textMessage: string,
        language: string = 'en',
        originalMessage: string = textMessage): object {

        const message = this.extractClauses(textMessage);

        if (Array.isArray(message)) { // si c'est un tableau, ça veut dire qu'il y a plusieurs propositions à analyser séparement
            let analysis = []; // on crée un tableau pour stocker les analyses
            for (const clause in message) {  // on analyse les propositions une par une et on les ajoute au tableau
                analysis.push(sentiment.default(message[clause], language, originalMessage));
            }
            return analysis; // on retourne le tableau
        } else { // si ce n'est pas un tableau, c'est que c'est une phrase seule, donc on peut utiliser la fonction directement
            console.log(`sentiment else`, sentiment.default)
            console.log(`type of`, typeof sentiment.default)
            return sentiment.default(message, language, originalMessage);
        }



    }

    public darktriadAnalysis(textMessage: string, opts: object = {"output": "matches"}) {
        // return darktriad(textMessage, opts);
    }

    public personalityAnalysis(textMessage: string, opts: object = {"output": "matches"}) {
        return bigfive(textMessage, opts);
    }



}