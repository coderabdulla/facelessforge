export class VoiceEngine {

    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.rate = 1.0;
        this.pitch = 1.0;

        this.loadVoices();
    }

    loadVoices() {

        const setVoice = () => {

            const voices = this.synth.getVoices();

            this.voice =
                voices.find(v => v.lang.startsWith("en"))
                || voices[0]
                || null;

        };

        setVoice();

        speechSynthesis.onvoiceschanged = setVoice;

    }

    setRate(rate = 1) {
        this.rate = rate;
    }

    setPitch(pitch = 1) {
        this.pitch = pitch;
    }

    async speak(text) {

        return new Promise(resolve => {

            if (!text) return resolve();

            const utter =
                new SpeechSynthesisUtterance(text);

            utter.voice = this.voice;

            utter.rate = this.rate;

            utter.pitch = this.pitch;

            utter.onend = () => resolve();

            this.synth.cancel();

            this.synth.speak(utter);

        });

    }

    stop() {

        this.synth.cancel();

    }

    async generateNarration(scenes) {

        const narration = [];

        for (const scene of scenes) {

            narration.push({

                id: scene.id,

                text: scene.text,

                duration: Math.max(
                    3,
                    Math.ceil(scene.text.split(" ").length / 2.5)
                )

            });

        }

        return narration;

    }

}
