'use strict';

import { TextAnalysis } from "./analysis/TextAnalysis";

export class WritingApp {
    private text:TextAnalysis = new TextAnalysis();

    init(): void {
        // We get the textarea where the message is written
        const textToAnalyze = <HTMLTextAreaElement>document.querySelector('#text-to-analyze textarea');

        // As keypress doesn't work with a android keyboard, we use keyup
        textToAnalyze.addEventListener("keyup", () => {
            console.log(`textToAnalyze.textContent`, textToAnalyze.textContent);
            this.text.analyze(textToAnalyze.value);
        })
    }

}

const app = new WritingApp();
app.init();