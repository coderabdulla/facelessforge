"use strict";
export class ImageEngine {

    async generateImage(prompt) {
        if (this.cache.has(prompt)) {
    return this.cache.get(prompt);
        }
        constructor() {
    this.cache = new Map();
        }

        const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt
            })
            this.cache.set(prompt, data.imageUrl);
        });

        if (!response.ok) {
            throw new Error("Image generation failed.");
        }

        const data = await response.json();

        return data.imageUrl;

    }

    async preloadSceneImages(scenes) {

        const img = new Image();

img.loading = "eager";

img.decoding = "async";

img.src = imageUrl;

await img.decode();

        }

        return result;

    }

}
