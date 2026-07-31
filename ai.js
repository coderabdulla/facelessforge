export class AIScriptEngine {

    constructor() {
        this.sentencesPerMinute = 22;
    }

    async generateScript({
        niche,
        durationSec,
        customPrompt = ""
    }) {

        const sceneCount = Math.max(
            4,
            Math.ceil(durationSec / 8)
        );

        const topic =
            customPrompt.trim() || this.getTopic(niche);

        const scenes = [];

        for (let i = 0; i < sceneCount; i++) {

            scenes.push({

                id: i + 1,

                text: this.buildSentence(
                    topic,
                    i,
                    sceneCount
                ),

                imagePrompt: this.buildPrompt(
                    topic,
                    i
                )

            });

        }

        return {

            nicheTitle: niche,

            title: topic,

            duration: durationSec,

            scenes

        };

    }

    getTopic(niche) {

        const topics = {

            motivation: "Never Give Up",

            business: "Build Your Business",

            finance: "Wealth Mindset",

            history: "Ancient Mystery",

            horror: "Dark Forest Story",

            islamic: "Islamic Wisdom",

            quotes: "Stoic Philosophy",

            facts: "Amazing Science Facts",

            health: "Healthy Lifestyle",

            education: "Learning Faster",

            storytelling: "Short Story"

        };

        return topics[niche] || "Faceless Video";

    }

    buildSentence(topic, index, total) {

        if (index === 0)
            return `Have you ever wondered about ${topic}?`;

        if (index === total - 1)
            return `Follow for more amazing content about ${topic}.`;

        return `${topic} can completely change the way you think.`;

    }

    buildPrompt(topic, index) {

        return `
cinematic,
ultra realistic,
8k,
vertical composition,
${topic},
scene ${index + 1},
dramatic lighting,
high detail
`;

    }

}
const response = await fetch("/api/generate-script", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        prompt: customPrompt

    })

});

const result = await response.json();
