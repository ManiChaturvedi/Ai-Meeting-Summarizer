import axios from 'axios';

const YOUR_API_KEY = process.env.GEMINI_KEY; 

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${YOUR_API_KEY}`;

export async function getAIResponse(transcript) {
    try {
        const prompt = `You are an assistant that formats outputs in clean, scannable GitHub-Flavored Markdown.

From the meeting transcript below, produce:

- A short executive summary (4-6 sentences)
- Key points as bullet points
- Key decisions as bullet points
- Action items with owners and due dates if mentioned

Formatting rules:

- Use Markdown headings exactly as:
  ## Executive Summary
  ## Key Points
  ## Key Decisions
  ## Action Items
- Use concise bullets (no more than 8 per section)
- Do not add any intro/outro text outside these headings
- Use bold for names, owners, or dates when present

Transcript:
${transcript}`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ]
        };

        const response = await axios.post(API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            return response.data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("AI response was empty or malformed.");
        }

    } catch (error) {
        console.error("Error occurred while getting AI response:", error.response ? error.response.data : error.message);
        throw new Error('Failed to get AI response');
    }
}