const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
    Generate a set of far analogy exercises for training cognitive flexibility.
    
    Structure:
    1. 10 Analogy Completions (A:B :: C:?). These should be "Far Analogies", meaning the relationship is conceptual rather than literal (e.g., Bird:Nest :: File:Folder is near, but Bird:Nest :: Programmer:Git is farther).
    2. 5 Open-ended prompts. Provide two very different domains that share a deep structural similarity (e.g., The circulatory system and a city's logistics network).

    Format the output strictly as valid JSON with this structure:
    {
      "part1": [
        { "a": "string", "b": "string", "c": "string" }
      ],
      "part2": [
        { "domainA": "string", "domainB": "string" }
      ]
    }
    Return ONLY the JSON. No markdown formatting.
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: content
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate content', details: error.message })
    };
  }
};