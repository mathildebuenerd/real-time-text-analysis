import * as sentiment from "node-sentiment-jouska";

export class TextAnalysis {

    public analyze(sentence: string, language: string = "en"): void {

        if (sentence !== undefined) {

            // Ignore the last word because it's not a full word
            const ignoreLastWord = new RegExp(/.+[ !?,.:"]/, 'gim');
            const allWordsExceptLast = sentence.match(ignoreLastWord); // with that regex, match is supposed to return a single sentence in an array
            const wordsToAnalyze = String(allWordsExceptLast);

            if (wordsToAnalyze !== 'null') {
                const polarity = this.getSentiment(wordsToAnalyze, language);
                console.log(`polarity`, polarity);
            }

        }

    }

    public sliceSentence(sentence): Array<string> {

        const separators = new RegExp(/[.?!,]\s| et | and /, 'gim');

        let subSentences = []; // on stocke les "sous-phrases"
        let searchFrom = 0;
        for (let i = 0; i< sentence.match(separators).length; i++) {
            const separator = sentence.indexOf(sentence.match(separators)[i], searchFrom);
            const subSentence = sentence.slice(searchFrom, separator);
            subSentences.push(subSentence);
            searchFrom = separator + 1;
        }

        const unfinishedSentence = sentence.slice(searchFrom);
        subSentences.push(unfinishedSentence);

        return subSentences;
    }

    public checkSentenceLength(text: string): boolean {
        // les séparateurs sont généralement :
        // - la ponctuation basique
        // - le mot et/and
        const separators = new RegExp(/[.?!,]\s| et | and /, 'gim');

        return separators.exec(text) !== null;
    }

    public getSentiment(
        text: string,
        language: string = 'en'): object {

        const isSentenceLong = this.checkSentenceLength(text);

        if (isSentenceLong === true) {
            const allSentences: Array<string> = this.sliceSentence(text);
            let analysis = []; // on crée un tableau pour stocker les analyses
            for (const sentence of allSentences) {
                analysis.push(sentiment.default(sentence, language, text));
            }
            return analysis;
        } else {
            return sentiment.default(text, language, text);
        }

    }

    public showScore(results) {

    }

}