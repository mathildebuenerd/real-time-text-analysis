'use strict';

import { TextAnalysis } from "./analysis/TextAnalysis";

export class WritingApp {
    private text:TextAnalysis = new TextAnalysis();

    init(): void {
        // We get the textarea where the message is written
        const textToAnalyze = <HTMLTextAreaElement>document.querySelector('#text-to-analyze textarea');

        // As keypress doesn't work with a android keyboard, we use keyup
        textToAnalyze.addEventListener("keyup", () => {
            const analysisResults = this.text.analyze(textToAnalyze.value);
            console.log(`Analysis results`, analysisResults);
        })
    }

}

const app = new WritingApp();
app.init();