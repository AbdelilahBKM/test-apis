const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8000;

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello world");
});

// Simple route to test the API
app.post('/test-api', async (req, res) => {
  try {
    const userMessage = req.body.message || 'Hello!'; // Default message if none provided
    const geminiApiKey = 'your_gemini_api_key'; // Replace with your Gemini API key
    
    // Replace with the actual Gemini API endpoint
    const apiUrl = 'https://api.gemini.com/v1/chat'; 

    // Make a request to the Gemini API
    const response = await axios.post(apiUrl, {
      input: userMessage,
      api_key: geminiApiKey
    });

    // Send the API response back to the client
    res.json({
      response: response.data.output
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: 'An error occurred while fetching the API response.'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
