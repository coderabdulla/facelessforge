"use strict";
import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager, Utils } from "./storage.js";

import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager } from "./storage.js";
import { FFmpegEngine } from "./ffmpeg.js";
import { AIScriptEngine } from "./ai.js";
import { ImageEngine } from "./image.js";
import { VoiceEngine } from "./voice.js";
import { VideoCompositor } from "./video.js";
import { StorageManager, Utils } from "./storage.js";
import { FFmpegEngine } from "./ffmpeg.js";
class FacelessForgeApp {

    constructor(){

    this.scriptEngine=new AIScriptEngine();

    this.imageEngine=new ImageEngine();

    this.voiceEngine=new VoiceEngine();

    this.compositor=new VideoCompositor();

    this.storage=new StorageManager();
        this.ffmpeg =
new FFmpegEngine();

    this.currentProject=null;
        showLoading(title="Loading",message="Please wait..."){

const overlay=document.getElementById("loading-overlay");

overlay?.classList.remove("hidden");

document.getElementById("loading-title").textContent=title;

document.getElementById("loading-message").textContent=message;

}

hideLoading(){

document.getElementById("loading-overlay")
?.classList.add("hidden");

}

showToast(message,type="success"){

const container=
document.getElementById("toast-container");

if(!container) return;

const toast=
document.createElement("div");

toast.className=`toast ${type}`;

toast.textContent=message;

container.appendChild(toast);

setTimeout(()=>{

toast.remove();

},3000);

}

    }

    cacheDOM() {

        this.generateBtn =
            document.getElementById("btn-generate-pipeline");

        this.playBtn =
            document.getElementById("btn-play-preview");

        this.exportBtn =
            document.getElementById("btn-export-video");

        this.prompt =
            document.getElementById("custom-prompt");

        this.niche =
            document.getElementById("niche-select");

        this.canvas =
            document.getElementById("video-canvas");

        this.sceneList =
            document.getElementById("scenes-list");

        this.projectGrid =
            document.getElementById("projects-grid");

        this.downloadList =
            document.getElementById("downloads-list");

        this.progressBar =
            document.getElementById("render-progress-bar");

        this.progressText =
            document.getElementById("render-progress-percent");

        this.overlay =
            document.getElementById("render-overlay");

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
            () => this.exportVideo()
        );

        document
            .querySelectorAll(".btn-option")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    document
                        .querySelectorAll(".btn-option")
                        .forEach(b => b.classList.remove("active"));

                    btn.classList.add("active");

                    this.duration =
                        Number(btn.dataset.duration);

                });

            });

        this.initNavigation();
        initNavigation() {

    this.sidebar =
        document.getElementById("sidebar");

    this.mobileBtn =
        document.getElementById("mobile-menu-btn");

    this.navButtons =
        document.querySelectorAll(".nav-btn");

    this.pages =
        document.querySelectorAll(".page-view");

    // Sidebar Toggle
    this.mobileBtn?.addEventListener("click", () => {

        this.sidebar.classList.toggle("open");

    });

    // Navigation
    this.navButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            const page = btn.dataset.page;

            this.switchPage(page);

        });

    });

        }
        switchPage(page) {

    this.pages.forEach(view => {

        view.classList.add("hidden");

    });

    const target =
        document.getElementById(
            `page-${page}`
        );

    if (target)
        target.classList.remove("hidden");

    this.navButtons.forEach(btn => {

        btn.classList.remove("active");

        if (btn.dataset.page === page)
            btn.classList.add("active");

    });

    if (window.innerWidth < 900)
        this.sidebar.classList.remove("open");

        }
    }

    renderWelcome() {

        if (!this.canvas) return;

        const ctx = this.canvas.getContext("2d");

        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0,0,1080,1920);

        ctx.fillStyle = "#8B5CF6";

        ctx.font = "bold 70px Inter";

        ctx.textAlign = "center";

        ctx.fillText(
            "FacelessForge",
            540,
            900
        );

        ctx.fillStyle = "#CBD5E1";

        ctx.font = "40px Inter";

        ctx.fillText(
            "AI Creator Studio",
            540,
            1000
        );

    }

    loadProjects(){

        console.log("Loading Projects...");

    }

}

document.addEventListener("DOMContentLoaded",()=>{

    window.facelessForge =
        new FacelessForgeApp();
async generate() {

    try {

        this.showLoading("Generating AI Script...", 10);

        const prompt =
            this.prompt?.value.trim() || "";

        const niche =
            this.niche?.value || "motivation";

        /* STEP 1 : Generate Script */

        const script =
            await this.ai.generateScript({

                niche,
                durationSec: this.duration,
                customPrompt: prompt

            });

        this.showLoading("Generating Images...", 35);

        /* STEP 2 : Generate Images */

        const scenes =
            await this.image.preloadSceneImages(
                script.scenes
            );

        this.showLoading("Generating Voice...", 65);

        /* STEP 3 : Voice */

        const narration =
            await this.voice.generateVoice(script);

        this.showLoading("Preparing Project...", 85);

        /* STEP 4 : Save Project */

        this.project = {

            id: Date.now(),

            title: script.title || "Untitled",

            niche,

            duration: this.duration,

            createdAt: new Date().toISOString(),

            narration,

            scenes

        };

        this.storage.saveProject(this.project);

        this.renderSceneList();

        this.renderFirstScene();

        this.playBtn.disabled = false;

        this.exportBtn.disabled = false;

        this.showLoading("Completed", 100);

        setTimeout(() => {

            this.hideLoading();

        }, 700);

    }

    catch (err) {

        console.error(err);

        this.hideLoading();

        alert("Failed to generate video.");

    }

}

/* ---------------------------- */

showLoading(title, percent) {

    if (this.overlay)
        this.overlay.classList.remove("hidden");

    if (this.progressBar)
        this.progressBar.style.width =
            percent + "%";

    if (this.progressText)
        this.progressText.textContent =
            percent + "%";

    const status =
        document.getElementById(
            "render-status-title"
        );

    if (status)
        status.textContent = title;

}

/* ---------------------------- */

hideLoading() {

    if (this.overlay)
        this.overlay.classList.add("hidden");

}

/* ---------------------------- */

renderSceneList() {

    if (!this.sceneList) return;

    this.sceneList.innerHTML = "";

    this.project.scenes.forEach((scene, index) => {

        const div =
            document.createElement("div");

        div.className = "scene-item";

        div.innerHTML = `

            <strong>Scene ${index + 1}</strong>

            <p>${scene.text || ""}</p>

        `;

        this.sceneList.appendChild(div);

    });

}

/* ---------------------------- */

renderFirstScene() {

    if (
        !this.project ||
        !this.project.scenes.length
    )
        return;

    const first =
        this.project.scenes[0];

    this.video.renderFrame(

        first.imageElement,

        0,

        "fade"

    );

}
});
/* ========================= */
/* Preview */
/* ========================= */

preview() {

    if (!this.project) return;

    this.video.playPreview(this.project.scenes);

}

/* ========================= */
/* Export */
/* ========================= */

async exportVideo() {

    if (!this.currentProject) {
        return;
    }

    this.showLoading?.(
        "Rendering Video...",
        "Please wait."
    );

    try {

        const blob =
            await this.compositor.renderProject(
                this.currentProject
            );

        Utils.downloadFile(
            blob,
            `FacelessForge-${Date.now()}.webm`
        );

        this.showToast?.("Export Complete");

    } catch (error) {

        console.error(error);

        this.showToast?.("Export Failed");

    } finally {

        this.hideLoading?.();

    }

}

/* ========================= */
/* Downloads */
/* ========================= */

addDownload(file){

    if(!this.downloadList) return;

    const item=document.createElement("div");

    item.className="download-item";

    item.innerHTML=`

        <strong>${file.name}</strong>

        <small>${file.date}</small>

    `;

    this.downloadList.prepend(item);

}

/* ========================= */
/* Toast */
/* ========================= */

toast(message){

    let toast=document.createElement("div");

    toast.className="toast";

    toast.textContent=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* ========================= */
/* Refresh Projects */
/* ========================= */

refreshProjects(){

    if(!this.projectGrid) return;

    this.projectGrid.innerHTML="";

    const projects=this.storage.getProjects();

    projects.forEach(project=>{

        const card=document.createElement("div");

        card.className="project-card";

        card.innerHTML=`

            <h3>${project.title}</h3>

            <p>${project.niche}</p>

            <small>${project.duration}s</small>

        `;

        this.projectGrid.appendChild(card);

    });

}

/* ========================= */
/* Reset */
/* ========================= */

newProject(){

    this.project=null;

    this.playBtn.disabled=true;

    this.exportBtn.disabled=true;

    this.sceneList.innerHTML="";

    this.renderWelcome();

}

/* ========================= */
/* Storage */
/* ========================= */

saveCurrent(){

    if(!this.project) return;

    this.storage.saveProject(this.project);

    this.refreshProjects();

}
showLoading(title, text){
this.showLoading(
"Generating Project",
"Preparing AI pipeline..."
);

setTimeout(()=>{

this.hideLoading();

this.showToast(
"Pipeline Started Successfully"
);

},2000);
const overlay =
document.getElementById("loading-overlay");

document.getElementById("loading-title").textContent=title;

document.getElementById("loading-text").textContent=text;

overlay.classList.remove("hidden");

}

hideLoading(){

document
.getElementById("loading-overlay")
.classList.add("hidden");

}

showToast(message){

const toast=document.getElementById("toast");

toast.textContent=message;

toast.classList.remove("hidden");

setTimeout(()=>{

toast.classList.add("hidden");

},3000);

}
autoSave(){

if(!this.currentProject) return;

this.storage.saveProject(
this.currentProject
);

this.showToast("Project Saved");
this.autoSave();
}
renderProjects(){

const container =
document.getElementById("projects-grid");

if(!container) return;

container.innerHTML="";

const projects =
this.storage.getProjects();

projects.forEach(project=>{

container.innerHTML+=`

<div class="project-card">

<h3>${project.title}</h3>

<p>${project.createdAt}</p>

<button class="load-btn"
data-id="${project.id}">
Open
</button>

<button class="delete-btn"
data-id="${project.id}">
Delete
</button>

</div>

`;

});

}
document.addEventListener("click",e=>{

if(e.target.classList.contains("load-btn")){

const id=Number(
e.target.dataset.id
);

this.currentProject=
this.storage.loadProject(id);

this.showToast("Project Loaded");

}

if(e.target.classList.contains("delete-btn")){

const id=Number(
e.target.dataset.id
);

this.storage.deleteProject(id);

this.renderProjects();

this.showToast("Project Deleted");

}

});
async startPipeline(){

this.showLoading(
"Generating AI Video",
"Preparing pipeline..."
);

const steps=[
"Writing Script",
"Generating Images",
"Creating Voice",
"Rendering Preview"
];

const ui=document.querySelectorAll(".pipeline-step");

for(let i=0;i<steps.length;i++){

document.getElementById(
"loading-text"
).textContent=steps[i];

ui.forEach(s=>s.classList.remove("active"));

ui[i].classList.add("active");

await new Promise(resolve=>
setTimeout(resolve,1500)
);

}

this.hideLoading();

this.showToast(
"Pipeline Complete"
);

}
document
.getElementById("btn-generate-pipeline")
?.addEventListener("click",()=>{

this.startPipeline();

});
document
.getElementById("btn-play-preview")
.disabled=false;

document
.getElementById("btn-export-video")
.disabled=false;

const narration =
await this.voiceEngine.generateNarration(
this.currentProject.scenes
);

this.currentProject.narration =
narration;

document
.getElementById("btn-play-preview")
?.addEventListener("click", async () => {

if(!this.currentProject) return;

for(const scene of this.currentProject.scenes){

await this.voiceEngine.speak(scene.text);

}

});

document
.getElementById("btn-play-preview")
?.addEventListener("click", () => {

    if (!this.currentProject) return;

    this.compositor.playPreview(
        this.currentProject.scenes
    );

});

document
.getElementById("btn-stop-preview")
?.addEventListener("click", () => {

    this.compositor.stopPreview();

});
async executePipeline(){

try{

this.showLoading(
"Generating AI Video",
"Creating Script..."
);

const niche=
document.getElementById("niche-select").value;

const customPrompt=
document.getElementById("custom-prompt").value;

const script=
await this.scriptEngine.generateScript({

niche,

durationSec:this.selectedDuration,

customPrompt

});

document.getElementById("loading-text").textContent=
"Generating Images...";

const scenes=
await this.imageEngine.preloadSceneImages(
script.scenes
);

document.getElementById("loading-text").textContent=
"Generating Voice...";

const narration=
await this.voiceEngine.generateNarration(
scenes
);

this.currentProject={

title:script.title,

createdAt:new Date().toLocaleString(),

scenes,

narration

};

this.storage.saveProject(
this.currentProject
);

document.getElementById("loading-text").textContent=
"Preparing Preview...";

if(scenes.length){

this.compositor.renderFrame(

scenes[0].imageElement,

0,

scenes[0].text

);

}

document.getElementById(
"btn-play-preview"
).disabled=false;

document
.getElementById("btn-export-video")
?.addEventListener("click", async () => {

    if (!this.currentProject) return;

    const blob =
        await this.compositor.exportVideo(
            this.currentProject.scenes
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;

    a.download =
        `FacelessForge-${Date.now()}.webm`;

    a.click();

    URL.revokeObjectURL(url);

    this.showToast(
        "Video Export Complete"
    );

});
this.hideLoading();

this.showToast(
"AI Video Generated Successfully"
);

}
catch(err){

console.error(err);

this.hideLoading();

this.showToast(
"Pipeline Failed"
);

}

}

document
.getElementById("btn-generate-pipeline")
?.addEventListener("click",()=>{

this.executePipeline();

});

document
.getElementById("btn-play-preview")
?.addEventListener("click",async()=>{

if(!this.currentProject) return;

await this.compositor.playPreview(
this.currentProject.scenes
);

});

document
.getElementById("btn-export-video")
?.addEventListener("click",async()=>{

await this.compositor.exportVideo();

});

document
.getElementById("voice-speed")
?.addEventListener("input", e => {

    this.voiceEngine.setRate(
        Number(e.target.value)
    );

});

document
.getElementById("voice-pitch")
?.addEventListener("input", e => {

    this.voiceEngine.setPitch(
        Number(e.target.value)
    );

});
renderProjects(){

const list=
document.getElementById("project-list");

if(!list) return;

list.innerHTML="";

const projects=
this.storage.getProjects();

projects.forEach((project,index)=>{

const item=
document.createElement("div");

item.className="project-item";

item.innerHTML=`

<h4>${project.title}</h4>

<p>${project.createdAt}</p>

<button data-index="${index}">
Open
</button>

`;

list.appendChild(item);

});

}
document
.getElementById("btn-save-project")
?.addEventListener("click",()=>{

if(!this.currentProject) return;

this.storage.saveProject(
this.currentProject
);

this.renderProjects();

});
this.renderProjects();

bindTemplates(){

const templates={

motivation:{
prompt:"Create a powerful motivational short video.",
duration:30
},

finance:{
prompt:"Explain one personal finance tip.",
duration:45
},

history:{
prompt:"Tell an interesting historical story.",
duration:60
},

horror:{
prompt:"Create a creepy horror story.",
duration:60
},

facts:{
prompt:"Share five amazing science facts.",
duration:45
},

business:{
prompt:"Business growth strategy.",
duration:60
},

quotes:{
prompt:"Generate inspirational quotes.",
duration:30
},

islamic:{
prompt:"Share an authentic Islamic reminder.",
duration:45
}

};

document.querySelectorAll(".template-card")
.forEach(card=>{

card.addEventListener("click",()=>{

const data=
templates[
card.dataset.template
];

document.getElementById(
"custom-prompt"
).value=data.prompt;

this.selectedDuration=
data.duration;

const niche=
document.getElementById(
"niche-select"
);

if(niche){

niche.value=
card.dataset.template;

}

});

});

}
this.bindTemplates();
const musicSelect =
document.getElementById("music-select");

const volume =
document.getElementById("music-volume");

if (musicSelect && volume) {

    musicSelect.addEventListener("change", () => {

        this.compositor.setMusic(

            musicSelect.value,

            Number(volume.value)

        );

    });

    volume.addEventListener("input", () => {

        this.compositor.music.volume =

            Number(volume.value);

    });

}
const effect =
document.getElementById(
"camera-effect"
);

if(effect){

effect.addEventListener("change",()=>{

this.compositor.setCameraEffect(

effect.value

);

});

    }
const resolution =
document.getElementById("export-resolution");

const fps =
document.getElementById("export-fps");

const speed =
document.getElementById("voice-speed");

const theme =
document.getElementById("theme-select");

resolution?.addEventListener("change",()=>{

const size =
resolution.value==="720"

?720

:1080;

this.compositor.setExportSettings(

size,

size===720?1280:1920,

Number(fps.value)

);

});

fps?.addEventListener("change",()=>{

this.compositor.fps=
Number(fps.value);

});

speed?.addEventListener("input",()=>{

this.voiceEngine.setRate(

Number(speed.value)

);

});

theme?.addEventListener("change",()=>{

document.documentElement.dataset.theme=

theme.value;

});
const settings =
this.storage.getSettings();

if(settings.theme){

document.documentElement.dataset.theme =
settings.theme;

}

const voiceBlob =
await this.voiceEngine.generateVoice(

script.scenes
      .map(scene => scene.text)
      .join(" ")

);

this.currentProject.voice = voiceBlob;
window.addEventListener("error",(event)=>{

console.error(event.error);

window.facelessForgeApp
?.showToast(
"Unexpected Error",
"error"
);

});

window.addEventListener("unhandledrejection",(event)=>{

console.error(event.reason);

window.facelessForgeApp
?.showToast(
"Request Failed",
"error"
);

});

this.storage.clearOldProjects();

export function debounce(fn, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            fn(...args);

        }, delay);

    };

}
const promptInput =
document.getElementById(
"custom-prompt"
);

promptInput?.addEventListener(

"input",

debounce(() => {

console.log("Typing...");

},300)

);
this.currentProject?.scenes.forEach(scene => {

    scene.imageElement = null;

});
requestIdleCallback(() => {

    this.imageEngine
        .preloadSceneImages(
            scenes
        );

});
const preload = () => {
    this.imageEngine.preloadSceneImages(scenes);
};

if ("requestIdleCallback" in window) {
    requestIdleCallback(preload);
} else {
    setTimeout(preload, 0);
}
import { Security } from "./storage.js";

const prompt =
Security.validatePrompt(

document.getElementById(
"custom-prompt"
).value

);
customPrompt: prompt
    element.textContent = userText;
if(this.currentProject){

document
.getElementById("empty-state")
.style.display="none";

}

    const generateBtn=
document.getElementById(
"btn-generate-pipeline"
);

generateBtn.disabled=true;

try{

// pipeline

}finally{

generateBtn.disabled=false;

}

@media(max-width:768px){

.hero{

flex-direction:column;

}

.sidebar{

width:100%;

}

canvas{

width:100%;

height:auto;

}

}

::-webkit-scrollbar{

width:8px;

}

::-webkit-scrollbar-thumb{

background:#6c63ff;

border-radius:20px;

}

::-webkit-scrollbar-track{

background:#181818;

}
.fade-in{

animation:fade .4s;

}

@keyframes fade{

from{

opacity:0;

transform:translateY(15px);

}

to{

opacity:1;

transform:none;

}

}
document.body.classList.add("fade-in");
if(!scene.imageElement){

ctx.fillStyle="#111";

ctx.fillRect(

0,

0,

this.width,

this.height

);

ctx.fillStyle="#fff";

ctx.font="48px Inter";

ctx.fillText(

"Loading...",

this.width/2,

this.height/2

);

return;

}
    document
.getElementById("export-modal")
.classList.remove("hidden");

document
.getElementById("close-modal")
.onclick=()=>{

document
.getElementById("export-modal")
.classList.add("hidden");

};
/* ========================= */
/* End Class */
/* ========================= */
