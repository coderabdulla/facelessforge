export class AIScriptEngine {
  constructor() {
    this.wordsPerMinute = 150;

    this.niches = {
      motivation: {
        title: "Motivation",
        hooks: [
          "Most people fail because they quit too early.",
          "Success starts with one decision.",
          "Nobody is coming to save you."
        ]
      },

      business: {
        title: "Business",
        hooks: [
          "The richest people solve expensive problems.",
          "Money follows value.",
          "Business is a game of trust."
        ]
      },

      finance: {
        title: "Finance",
        hooks: [
          "Poor people buy liabilities.",
          "Wealth grows quietly.",
          "Invest before you spend."
        ]
      },

      horror: {
        title: "Horror",
        hooks: [
          "Nobody entered that house twice.",
          "The camera captured something impossible.",
          "The forest hides a terrifying secret."
        ]
      },

      history: {
        title: "History",
        hooks: [
          "History changed forever in one night.",
          "An empire disappeared mysteriously.",
          "Nobody expected what happened next."
        ]
      },

      islamic: {
        title: "Islamic",
        hooks: [
          "Allah always sees your efforts.",
          "Every hardship has wisdom.",
          "Patience is stronger than power."
        ]
      },

      quotes: {
        title: "Stoic Quotes",
        hooks: [
          "Control your mind.",
          "Silence is power.",
          "Discipline beats talent."
        ]
      },

      facts: {
        title: "Facts",
        hooks: [
          "Your brain uses electricity.",
          "Space is completely silent.",
          "Octopuses have three hearts."
        ]
      },

      health: {
        title: "Health",
        hooks: [
          "Sleep is your superpower.",
          "Water changes everything.",
          "Walking is underrated."
        ]
      },

      education: {
        title: "Education",
        hooks: [
          "Learning never stops.",
          "Knowledge compounds daily.",
          "Curiosity creates intelligence."
        ]
      },

      storytelling: {
        title: "Story",
        hooks: [
          "A stranger changed everything.",
          "One letter changed his life.",
          "The ending shocked everyone."
        ]
      }
    };
  }

  async generateScript({
    niche = "motivation",
    durationSec = 30,
    customPrompt = ""
  }) {

    const config = this.niches[niche] || this.niches.motivation;

    const totalWords = Math.floor(
      this.wordsPerMinute * durationSec / 60
    );

    const sceneCount = Math.max(
      4,
      Math.round(durationSec / 6)
    );

    let narration = [];

    if (customPrompt.trim()) {
      narration.push(customPrompt.trim());
    } else {
      narration.push(
        config.hooks[
          Math.floor(Math.random() * config.hooks.length)
        ]
      );
    }

    while (
      narration.join(" ").split(" ").length < totalWords
    ) {

      narration.push(
        `This is scene ${narration.length + 1}. Stay focused, keep watching, and remember this lesson because it can completely change your perspective.`
      );

    }

    const fullScript = narration.join(" ");

    const words = fullScript.split(" ");

    const wordsPerScene = Math.ceil(
      words.length / sceneCount
    );

    const scenes = [];

    for (let i = 0; i < sceneCount; i++) {

      const start = i * wordsPerScene;

      const end = start + wordsPerScene;

      const text = words
        .slice(start, end)
        .join(" ");

      scenes.push({

        id: i + 1,

        narration: text,

        duration: durationSec / sceneCount,

        seed: Math.floor(Math.random() * 999999),

        imagePrompt:
          `${config.title}, cinematic, realistic, ultra detailed, dramatic lighting, 9:16 vertical, photorealistic`

      });

    }

    return {

      niche,

      nicheTitle: config.title,

      durationSec,

      totalWords,

      sceneCount,

      fullScript,

      scenes

    };
  }
}