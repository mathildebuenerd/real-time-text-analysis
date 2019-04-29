'use strict';

import { WritingAnalysisService } from "./analysis/WritingAnalysis";

export class WritingApp {
    private writingAnalysis:WritingAnalysisService = new WritingAnalysisService();


    constructor() {

        console.log("construct Writing page")

    }

    init() {
        // We get the textarea where the message is written
        const textToAnalyze = <HTMLTextAreaElement>document.querySelector('#text-to-analyze textarea');

        // As keypress doesn't work with a android keyboard, we use keyup
        textToAnalyze.addEventListener("keyup", () => {
            console.log(`textToAnalyze.textContent`, textToAnalyze.textContent);
            this.writingAnalysis.analyzeText(textToAnalyze.value);
        })
    }

}

const app = new WritingApp();
app.init();