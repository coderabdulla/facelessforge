export class VoiceEngine {

    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.rate = 1;
        this.pitch = 1;

        this.loadVoices();
    }

    loadVoices() {

        const load = () => {

            const voices = this.synth.getVoices();

            this.voice =
                voices.find(v => v.lang.startsWith("en"))
                || voices[0]
                || null;

        };

        load();

        speechSynthesis.onvoiceschanged = load;

    }

    setRate(rate) {
        this.rate = rate;
    }

    setPitch(pitch) {
        this.pitch = pitch;
    }

    async speak(text) {

        return new Promise(resolve => {

            const utter =
                new SpeechSynthesisUtterance(text);

            utter.voice = this.voice;
            utter.rate = this.rate;
            utter.pitch = this.pitch;

            utter.onend = resolve;

            this.synth.cancel();
            this.synth.speak(utter);

        });

    }

    async generateNarration(scenes) {

        return scenes.map(scene => ({

            id: scene.id,

            text: scene.text,

            duration:
                Math.max(
                    3,
                    Math.ceil(scene.text.split(" ").length / 2.5)
                ),

            audioUrl: null

        }));

    }

    async generateWithElevenLabs(text) {

        // Backend API call এখানে হবে

        throw new Error(
            "ElevenLabs backend not connected yet."
        );

    }

}
