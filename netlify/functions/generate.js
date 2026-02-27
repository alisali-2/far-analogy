if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
}

const data = await response.json();

if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
  throw new Error("Invalid response structure from Gemini API");
}

let contentText = data.candidates[0].content.parts[0].text.trim();

// Safety check: Remove markdown code blocks if the model includes them despite instructions
if (contentText.startsWith("```")) {
  contentText = contentText.replace(/^```json|```$/g, "").trim();
}

return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: contentText
};