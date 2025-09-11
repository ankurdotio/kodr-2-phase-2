const { GoogleGenAI } = require("@google/genai")


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})


async function generateResult(prompt) {

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    })

    return response.text

}

const memory = [
    {
        role: "user",

        parts: [ {
            text: "who are you ?"
        } ]

    },
    {
        role: "model",

        parts: [ {
            text: "I am an AI created by Google"
        } ]

    },
    {
        role: "user",

        parts: [ {
            text: "what was my first question ?"
        } ]

    },
    {
        role: "model",

        parts: [ {
            text: "As  an AI, I don't have memory of past conversations. Therefore, I don't know what your first question to me was."
        } ]

    }
]

async function generateStream(prompt, onData) {

    memory.push({
        role: "user",
        parts: [ {
            text: prompt
        } ]
    })

    const stream = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: memory
    })

    let responseText = ""

    for await (const chunk of stream) {
        responseText += chunk.text
        onData(chunk.text)
    }

    memory.push({
        role: "model",
        parts: [ {
            text: responseText
        } ]
    })

}


module.exports = {
    generateResult,
    generateStream
}