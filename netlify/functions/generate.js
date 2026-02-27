exports.handler = async function (event, context) {
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY};

const prompt = `
Generate a Far Analogy Training Session.

code
Code
download
content_copy
expand_less
Structure:
1. 10 Analogy Completions (A:B :: C:?). Use conceptually distant relationships (e.g., Bird:Nest :: Programmer:Git).
2. 5 Open-ended prompts. Provide two very different domains that share a deep structural similarity (e.g., The circulatory system and a city's logistics network).

Return the result strictly as a raw JSON object with this exact structure:
{
  "part1": [
    { "a": "string", "b": "string", "c": "string" }
  ],
  "part2": [
    { "domainA": "string", "domainB": "string" }
  ]
}

Important: Return ONLY the JSON object. Do not include markdown formatting, backticks, or any conversational text.

`;

try {
const response = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
contents: [{
parts: [{ text: prompt }]
}]
})
});

code
Code
download
content_copy
expand_less
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
}

const data = await response.json();

if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
  throw new Error("Invalid response structure from Gemini API");
}

let contentText = data.candidates[0].content.parts[0].text.trim();

// Remove markdown code blocks (```json ... ```) if the model includes them
if (contentText.includes("```")) {
  contentText = contentText.replace(/```json|```/g, "").trim();
}

return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: contentText
};

} catch (error) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json",
"Access-Control-Allow-Origin": "*"
},
body: JSON.stringify({
error: error.message
})
};
}
};