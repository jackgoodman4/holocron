import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';
import { coursesData } from '../data/coursesData';
import './ChatBot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  // Add this to debug the environment variable
  console.log('API Key available:', !!OPENAI_API_KEY);

  // Create a detailed course summary for the system prompt
  const coursesSummary = coursesData.map(course => {
    const completedAssignments = course.assignments.filter(a => a.progress === 100).length;
    const inProgressAssignments = course.assignments.filter(a => a.progress > 0 && a.progress < 100).length;
    const upcomingAssignments = course.assignments.filter(a => a.progress === 0).length;
    
    return `
    ${course.title}:
    - Current Progress: ${course.progress}%
    - Week ${course.currentWeek}
    - Completed Assignments: ${completedAssignments}
    - In Progress Assignments: ${inProgressAssignments}
    - Upcoming Assignments: ${upcomingAssignments}
    - Next Due Assignment: ${course.assignments.find(a => a.progress < 100)?.title || 'None'}`
  }).join('\n\n');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const newMessage = {
      text: inputMessage,
      sender: 'user',
      id: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `You are a helpful AI assistant focused on helping students with their coursework. 
            You have access to the following information about the student's courses:
            
            ${coursesSummary}
            
            Use this information to provide specific, contextual help about their courses, assignments, 
            and progress. You can suggest study strategies, help prioritize assignments, and provide 
            course-specific advice. Keep your responses concise, friendly, and focused on helping 
            the student succeed in their courses. If asked about specific assignments, reference 
            their current progress and due dates.`
          },
          { role: "user", content: inputMessage }
        ],
        model: "gpt-3.5-turbo",
      });

      const botResponse = {
        text: completion.choices[0].message.content,
        sender: 'bot',
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I'm sorry, I encountered an error. Please make sure your API key is set up correctly.",
        sender: 'bot',
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="courses-overview">
      <header>
        <div className="nav-left">
          <Link to="/" className="nav-button">Home</Link>
        </div>
        <div className="nav-right">
          <Link to="/chatbot" className="nav-button">ChatBot</Link>
        </div>
      </header>

      <main className="chatbot-main">
        <div className="chat-container">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="message-input"
              disabled={isLoading}
            />
            <button type="submit" className="send-button" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatBot; 