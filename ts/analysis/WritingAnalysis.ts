import { TextAnalysisService } from "./TextAnalysis";

export class WritingAnalysisService {

    colors: object;
    tempSentences: Array<string>;
    private messageInput: string;
    private textAnalysis:TextAnalysisService = new TextAnalysisService();

    constructor() {
        this.colors = {
            "a5f31b": 8,
            "a4ed2b": 7,
            "a2e739": 6,
            "a1dc52": 5,
            "a1d16b": 4,
            "a1c087": 3,
            "a1b595": 2,
            "a1a69f": 1,
            "a39ba1": 0,
            "ae849b": -1,
            "b57794": -2,
            "c26185": -3,
            "cf4c74": -4,
            "db3863": -5,
            "e82551": -6,
            "f21542": -7,
            "fb0736": -8
        };
        this.tempSentences = ["", ""]; // on utilise cette variable pour optimiser l'usage de le fonction de traduction. On stocke la dernière phrase traduite dedans, et on checke ensuite chaque fois qu'une touche est pressée pour comparer et voir s'il y a un mot supplémentaire
        console.log("constructor WritingAnalysisService")

    }

    public getColor= (object: object, value: number): string => {
        if (value > 8) {
            value = 8;
        } else if (value < -8) {
            value = -8;
        }
        return Object.keys(object).find(key => object[key] === value);
    };


    showFeedback= (analysis: any, type: string) => {
        console.log(`showFeedback`, `analysis`, analysis, `type`, type);

        let score = 0;
        const otherAnalysis = ["psychopathy", "conscientiousness", "openness"];

        if (type === "polarity" || type === "selfishness") {
            if (analysis['score'] !== undefined) {
                score += analysis['score'];
            } else {
                for (const object in analysis) {
                    // console.log(`score ${type}: ${analysis[object]['score']}`);
                    score += analysis[object]['score'];
                }
            }
            // les analyses de la liste triad donnent directement le score
        } else if (otherAnalysis.indexOf(type) !== -1) {
            score = analysis;
        }

        // let color = this.getColor(this.colors, score);
        // let scoreBar = this.getSidebarNumber(score);
        // this.changeSidebar(type, scoreBar);

        // if (analysis["negative"].length > 0) {
        //     // this.animateNegativeWords(analysis["negative"]);
        // }
    };

    public analyzeText=(sentence: string, language: string = "en") => {

        console.log("analyzeText function");

        if (sentence !== undefined) {

            // Ignore the last word because it's not a full word
            const ignoreLastWord = new RegExp(/.+[ !?,.:"]/, 'gim');
            const allWordsExceptLast = sentence.match(ignoreLastWord); // with that regex, match is supposed to return a single sentence in an array
            const wordsToAnalyze = String(allWordsExceptLast);

            if (wordsToAnalyze !== 'null') {
                const polarity = this.textAnalysis.sentimentAnalysis(wordsToAnalyze, language);
                // this.showFeedback(polarity, "polarity");
                // const selfish = this.textAnalysis.selfishnessAnalysis(wordsToAnalyze, language);
                // this.showFeedback(selfish, "selfishness");
                console.log(`polarity`, polarity);
            }

        }

    };

    interpretAnalysis = (type: string, analysis: object): object => {

        let analyses = {};
        let analysesDark = {
            "triad": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "narcissism": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "machiavellianism": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "psychopathy": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
        };
        let analysesBigfive = {
            "openness": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "conscientiousness": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "extraversion": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "agreeableness": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
            "neuroticism": {
                "score": 0,
                "negativeWords": [],
                "positiveWords": []
            },
        };

        if (type === "darktriad") {
            analyses = analysesDark;
            for (const trait in analysis) {
                // on vérifie que le tableau contient bien quelque chose
                if (analysis[trait] !== []) {
                    for (const word in analysis[trait]) {
                        const _word = analysis[trait][word][0]; // correspond au mot (chaine de caractère)
                        // console.log(`_word`, _word, `analysis`, analysis, `trait`, trait);
                        const wordScore = analysis[trait][word][3]; // le quatrième élément correspond à la valeur relative du mot
                        // si le score du mot est positif, ça veut dire que la darktriad est haute, donc c'est plutôt négatif. dans tous les cas on arrondi à 1 pour simplifier
                        if (wordScore > 0) {
                            analyses[trait].score--;
                            analyses[trait].negativeWords.push(_word);
                        } else {
                            analyses[trait].score++;
                            analyses[trait].positiveWords.push(_word);
                        }
                    }
                }
            }
        } else if (type === "bigfive") {
            analyses = analysesBigfive;
            for (const trait in analysis) {
                // on regarde si le tableau n'est pas vide
                if (analysis[trait].matches !== []) {
                    for (let i = 0; i < analysis[trait].matches.length; i++) {
                        const _word = analysis[trait].matches[i][0]; // correspond au mot (chaine de caractère)
                        const wordScore = analysis[trait].matches[i][3]; // le quatrième élément correspond à la valeur relative du mot
                        // si le score du mot est positif, ça veut dire que la darktriad est haute, donc c'est plutôt négatif. dans tous les cas on arrondi à 1 pour simplifier
                        if (wordScore > 0) {
                            analyses[trait].score--;
                            analyses[trait].negativeWords.push(_word);
                        } else {
                            analyses[trait].score++;
                            analyses[trait].positiveWords.push(_word);
                        }
                    }
                }
            }
        }



        // console.log(`analyses`, analyses);

        // on renvoie la score moyen, ainsi que les mots qui ont influencé globalement le score
        return analyses;
    };

    sliceWord(word: string, elmtClass: string): string {

        let tag = `<span class="${elmtClass}">`;
        for (let letter = 0; letter<word.length; letter++) {
            tag += `<span>${word[letter]}</span>`; // on ajoute chaque lettre entourée d'un span, comme ça on pourra les animer séparement
        }
        tag += `</span>`;
        return tag;
    }

    animateNegativeWords= (words: string[]) => {
        // console.log(`words:`);
        // console.log(words);
        const textArea = <HTMLElement>document.querySelector('#smsContent');
        for (const word in words) {
            let slicedWord = this.sliceWord(words[word], "negative");
            // console.log(`slicedWord:`);
            // console.log(slicedWord);
            // console.log(`textarea.value: ${textArea.textContent}`);
            const toReplace = new RegExp(`${words[word]}`, 'gi');
            textArea.innerHTML = (textArea.textContent).replace(toReplace, slicedWord);
        }

        const wordsToAnimate = document.querySelectorAll(`.negative`);
        if (wordsToAnimate !== undefined) {
            for (const singleWord in wordsToAnimate) {
                let lettersToAnimate = wordsToAnimate[singleWord].querySelectorAll(`span`);
                for (const letter in lettersToAnimate) {
                    const aLetter = <HTMLElement>lettersToAnimate[letter];
                    const randomValue = Math.floor(Math.random()*3);// on a trois animations différentes
                    aLetter.style.animationName = `marionettes${randomValue}`;
                }
            }
        }

        // pour gérer les balises html dans contenteditable
        // https://stackoverflow.com/questions/41433796/html-elements-inside-contenteditable
        // const map = {amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'"}
        // let html = textArea.innerHTML.replace(/&([^;]+);/g, (m, c) => map[c]);
        // textArea.innerHTML = html;

        // this.setEndOfContenteditable(textArea); // est sensé ramener le curseur à la fin de la ligne

    };

    setEndOfContenteditable= (contentEditableElement) => {
        let range,selection;
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    };

}