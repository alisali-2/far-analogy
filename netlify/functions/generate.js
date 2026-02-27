exports.handler = async function (event, context) {
try {
const API_KEY = process.env.GEMINI_API_KEY;

code
Code
download
content_copy
expand_less
const promptText = "Generate a Far Analogy Training Session. " +
  "Part 1: 10 Analogy Completions (A:B :: C:?). " +
  "Part 2: 5 Open-ended far analogy prompts connecting domainA and domainB. " +
  "Return ONLY a JSON object with this structure: " +
  "{\"part1\": [{\"a\": \"\", \"b\": \"\", \"c\": \"\"}], \"part2\": [{\"domainA\": \"\", \"domainB\": \"\"}]}. " +
  "Do not include markdown code blocks or backticks.";

const response = await fetch(
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: promptText
            }
          ]
        }
      ]
    })
  }
);

const data = await response.json();

if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
  throw new Error("Invalid response from Gemini API");
}

let text = data.candidates[0].content.parts[0].text.trim();

if (text.startsWith("```")) {
  text = text.replace(/```json|```/g, "").trim();
}

return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json"
  },
  body: text
};

} catch (error) {
return {
statusCode: 500,
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ error: error.message })
};
}
};