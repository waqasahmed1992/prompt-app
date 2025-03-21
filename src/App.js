import React, { useState } from 'react';
import './App.css';
import OpenAI from 'openai';

function App() {
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSubmittedPrompt(prompt);
    
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      
      const responseText = completion.choices[0].message.content;
      setResponse(responseText);
    } catch (err) {
      setError(err.message || 'Failed to get response from OpenAI');
    } finally {
      setIsLoading(false);
      setPrompt('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        <div className="header">
          <div className="header-left">
            <h1>Chat with OpenAI</h1>
          </div>
          <button 
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your prompt and press Enter..."
          className="prompt-input"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Getting response from OpenAI...</p>
          </div>
        )}
        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
        {submittedPrompt && (
          <div className="submitted-prompt">
            <h2>Your Question:</h2>
            <p>{submittedPrompt}</p>
            {response && (
              <>
                <h2>OpenAI Response:</h2>
                <p>{response}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;