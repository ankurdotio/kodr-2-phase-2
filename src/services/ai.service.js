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


async function generateStream(prompt, onData) {
    const stream = await ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        contents: prompt
    })

    let result = ""

    for await (const chunk of stream) {
        result += chunk.text
        onData(chunk.text)
    }

    return result

}


module.exports = {
    generateResult,
    generateStream
}