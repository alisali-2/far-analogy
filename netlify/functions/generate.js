exports.handler = async (event, context) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API Key not configured in environment variables." }),
    };
  }

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
    Return ONLY the JSON. Do not include markdown formatting or backticks.
  `;

  try {
    // Using native global fetch (available in Node.js 18+)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          temperature: 0.9 // Higher temperature for more creative far analogies
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from Gemini');
    }

    const data = await response.json();
    
    // Gemini's standard response path: candidates -> content -> parts -> text
    let contentText = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Helps with local testing
      },
      body: contentText
    };
  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to generate content', 
        details: error.message 
      })
    };
  }
};