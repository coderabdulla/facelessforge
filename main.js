import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager, Utils } from "./storage.js";

class FacelessForge {

  constructor() {

    this.ai = new AIScriptEngine();
    this.images = new ImageEngine();
    this.voice = new VoiceEngine();
    this.video = new VideoCompositor();
    this.storage = new StorageManager();

    this.project = null;

    this.init();

  }

  init() {

    this.generateBtn =
      document.getElementById("btn-generate-pipeline");

    this.previewBtn =
      document.getElementById("btn-play-preview");

    this.exportBtn =
      document.getElementById("btn-export-video");

    this.progress =
      document.getElementById("render-progress-bar");

    this.percent =
      document.getElementById("render-progress-percent");

    this.status =
      document.getElementById("render-status-title");

    this.overlay =
      document.getElementById("render-overlay");

    this.generateBtn.onclick = () => this.generate();

    this.previewBtn.onclick = () =>
      this.preview();

    this.exportBtn.onclick = () =>
      this.export();

    document
      .getElementById("voice-speed")
      ?.addEventListener("input", e => {

        this.voice.setRate(e.target.value);

        document.getElementById("speed-val").textContent =
          e.target.value;

      });

    document
      .getElementById("voice-pitch")
      ?.addEventListener("input", e => {

        this.voice.setPitch(e.target.value);

        document.getElementById("pitch-val").textContent =
          e.target.value;

      });

  }

  showProgress(title, value) {

    this.overlay.classList.remove("hidden");

    this.status.textContent = title;

    this.progress.style.width = value + "%";

    this.percent.textContent = value + "%";

  }

  hideProgress() {

    this.overlay.classList.add("hidden");

  }

  async generate() {

    this.previewBtn.disabled = true;
    this.exportBtn.disabled = true;

    this.showProgress(
      "Generating Script...",
      10
    );

    const niche =
      document.getElementById("niche-select").value;

    const duration =
      Number(
        document.querySelector(
          ".btn-option.active"
        ).dataset.duration
      );

    const custom =
      document.getElementById("custom-prompt").value;

    const script =
      await this.ai.generateScript({

        niche,

        durationSec: duration,

        customPrompt: custom

      });

    this.showProgress(
      "Generating Images...",
      40
    );

    const scenes =
      await this.images.preloadSceneImages(

        script.scenes,

        {},

        (done, total, percent) => {

          this.showProgress(

            `Generating Images (${done}/${total})`,

            40 + percent * 0.5

          );

        }

      );

    this.project = {

      title: script.nicheTitle,

      scenes,

      created: Date.now()

    };

    this.storage.saveProject(this.project);

    this.video.renderFrame(
      scenes[0].imageElement,
      0
    );

    document.getElementById(
      "subtitle-text"
    ).textContent =
      scenes[0].narration;

    this.showProgress(
      "Completed",
      100
    );

    setTimeout(() => {

      this.hideProgress();

    }, 800);

    this.previewBtn.disabled = false;
    this.exportBtn.disabled = false;

  }

  async preview() {

    if (!this.project) return;

    await this.video.playPreview(
      this.project.scenes
    );

  }

  async export() {

    if (!this.project) return;

    const blob =
      await this.video.exportVideo(
        this.project.scenes
      );

    const filename =
      `FacelessForge_${Date.now()}.webm`;

    Utils.downloadFile(
      blob,
      filename
    );

    this.storage.saveExport(
      filename
    );

  }

}

window.addEventListener(

  "DOMContentLoaded",

  () => {

    new FacelessForge();

  }

);