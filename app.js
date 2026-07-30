import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager, Utils } from "./storage.js";

class FacelessForgeApp {

    constructor() {

        this.script = new AIScriptEngine();
        this.images = new ImageEngine();
        this.voice = new VoiceEngine();
        this.video = new VideoCompositor();
        this.storage = new StorageManager();

        this.project = null;

        this.cacheDOM();

        this.bindEvents();

        this.showWelcome();

    }

}

document.addEventListener("DOMContentLoaded", () => {

    window.app = new FacelessForgeApp();

});
cacheDOM() {

    this.generateBtn =
        document.getElementById("btn-generate-pipeline");

    this.playBtn =
        document.getElementById("btn-play-preview");

    this.exportBtn =
        document.getElementById("btn-export-video");

    this.niche =
        document.getElementById("niche-select");

    this.prompt =
        document.getElementById("custom-prompt");

}
bindEvents() {

    this.generateBtn?.addEventListener(

        "click",

        () => this.generate()

    );

    this.playBtn?.addEventListener(

        "click",

        () => this.preview()

    );

    this.exportBtn?.addEventListener(

        "click",

        () => this.export()

    );

}
showWelcome(){

    console.log(

        "FacelessForge Creator Loaded"

    );

}
