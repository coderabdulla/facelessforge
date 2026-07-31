"use strict";
export class ImageEngine {

    async generateImage(prompt) {

        const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt
            })
        });

        if (!response.ok) {
            throw new Error("Image generation failed.");
        }

        const data = await response.json();

        return data.imageUrl;

    }

    async preloadSceneImages(scenes) {

        const result = [];

        for (const scene of scenes) {

            const imageUrl =
                await this.generateImage(
                    scene.imagePrompt
                );

            const img = new Image();

            img.src = imageUrl;

            await new Promise(resolve => {

                img.onload = resolve;

            });

            result.push({

                ...scene,

                imageElement: img

            });

        }

        return result;

    }

}
