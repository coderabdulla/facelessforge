export class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;

    this.loadVoices();
  }

  loadVoices() {
    const setVoice = () => {
      const voices = this.synth.getVoices();

      this.voice =
        voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")) ||
        voices.find(v => v.lang.startsWith("en")) ||
        voices[0] ||
        null;
    };

    setVoice();

    window.speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };
  }

  setRate(rate) {
    this.rate = Number(rate) || 1;
  }

  setPitch(pitch) {
    this.pitch = Number(pitch) || 1;
  }

  setVolume(volume) {
    this.volume = Number(volume) || 1;
  }

  stop() {
    this.synth.cancel();
  }

  speak(text) {
    return new Promise(resolve => {

      this.stop();

      const utter = new SpeechSynthesisUtterance(text);

      utter.voice = this.voice;
      utter.rate = this.rate;
      utter.pitch = this.pitch;
      utter.volume = this.volume;

      utter.onend = () => resolve();
      utter.onerror = () => resolve();

      this.synth.speak(utter);

    });
  }

  async speakScenes(scenes, onSceneStart = null) {

    if (!Array.isArray(scenes)) return;

    for (let i = 0; i < scenes.length; i++) {

      const scene = scenes[i];

      if (typeof onSceneStart === "function") {
        onSceneStart(scene, i);
      }

      await this.speak(scene.narration);

    }

  }

  estimateDuration(text) {

    const words = text.trim().split(/\s+/).length;

    return Math.max(
      2,
      Math.round((words / 150) * 60)
    );

  }

  generateSubtitleTimeline(scenes) {

    let current = 0;

    return scenes.map(scene => {

      const duration =
        scene.duration ||
        this.estimateDuration(scene.narration);

      const item = {

        text: scene.narration,

        start: current,

        end: current + duration

      };

      current += duration;

      return item;

    });

  }

  isSupported() {
    return (
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
    );
  }
}