export class VoiceEngine {

    constructor() {
        this.rate = 1;
    }

    setRate(rate) {
        this.rate = rate;
    }

    async generateVoice(text) {

        const response = await fetch("/api/generate-voice", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text,
                rate: this.rate
            })

        });

        if (!response.ok) {
            throw new Error("Voice generation failed.");
        }

        return await response.blob();

    }

}
setRate(rate){

this.rate = rate;

}
