import React from 'react';

import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
const AIChatBox = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyConfirmed, setApiKeyConfirmed] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to simulate calling Gemini API
  const generateResponseFromGemini = async (prompt: any, key: any) => {
    setError('');
    try {
      // For actual implementation using Google Generative AI package
      const { GoogleGenerativeAI } = await import('@google/generative-ai');

      const genAI = new GoogleGenerativeAI(key);
      // Use 'gemini-1.5-flash' model instead of 'gemini-pro'
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate content using the model
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return { text: response.text() };
    } catch (error) {
      console.error("Gemini API Error:", error);
      // Handle specific API errors with more helpful messages
      if (error instanceof Error && error.message?.includes('models/gemini-pro is not found')) {
        throw new Error('Model not found. Using gemini-1.5-flash instead of gemini-pro.');
      } else if (error instanceof Error && error.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your API key and try again.');
      } else {
        throw error;
      }
    }
  };

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmitApiKey = () => {
    if (apiKey.trim() === '') {
      setError('Please enter an API key');
      return;
    }
    setApiKeyConfirmed(true);
    setError('');
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await generateResponseFromGemini(input, apiKey);
      const aiMessage = { role: 'assistant', content: response.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error generating response:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to get response from Gemini');
      } else {
        setError('Failed to get response from Gemini');
      }
      setMessages(prev => [...prev, { role: 'system', content: `Error: ${err instanceof Error ? err.message : 'Failed to get response from Gemini'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleApiKeyKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitApiKey();
    }
  };

  if (!apiKeyConfirmed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 w-full max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Gemini API Setup</h2>
        <p className="mb-4 text-gray-600 text-sm">Enter your Gemini API key to get started.</p>

        <div className="w-full">
          <div className="mb-4">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={handleApiKeyKeyPress}
              placeholder="Enter your Gemini API key"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSubmitApiKey}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Connect to Gemini
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          You can get a Gemini API key from the Google AI Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Gemini AI Chat</h2>
        <button
          onClick={() => setApiKeyConfirmed(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Change API Key
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>Start a conversation with Gemini</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 p-3 rounded-lg ${msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : msg.role === 'system'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 p-3 bg-gray-200 text-gray-800 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t p-4">
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
