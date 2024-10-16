const express = require('express');

require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello world");
});

app.post('/test-api', async (req, res) => {
  try {
    const result = await model.generateContent("Hello world!");
    res.json({
      response: result.response.text()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the API response.'
    });
  }
});

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt input
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required and must be a string.' });
    }

    // Initialize chat session with history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, how are you?" }]
        },
        {
          role: "model",
          parts: [{ text: "I'm doing great! How can I assist you today?" }]
        },
        {
          role: "user",
          parts: [{ text: "What should I cook today for dinner?" }]
        },
        {
          role: "model",
          parts: [{ text: "Pasta with pesto and grilled vegetables" }]
        }
      ]
    });

    // Send the new message
    const result = await chat.sendMessage([{ text: prompt }]);
    res.json({
      response: result.response.text()
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the API response.'
    });
  }
});




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
