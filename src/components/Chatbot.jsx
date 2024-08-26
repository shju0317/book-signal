import React, { useState } from 'react';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 사용자 메시지 추가
    setMessages([...messages, { text: input, type: 'user' }]);
    setInput('');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    };

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    };

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      // 챗봇 응답 추가
      setMessages([...messages, { text: input, type: 'user' }, { text: data.choices[0].message.content, type: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      // 오류 응답 추가
      setMessages([...messages, { text: input, type: 'user' }, { text: 'Something went wrong. Please try again.', type: 'bot' }]);
    }
  };

  // 인라인 스타일
  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    messagesContainer: {
      maxHeight: '400px',
      overflowY: 'auto',
      marginBottom: '10px',
    },
    message: {
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '5px',
      width: 'fit-content',
      maxWidth: '70%',
    },
    userMessage: {
      backgroundColor: '#d1e7dd',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
    },
    botMessage: {
      backgroundColor: '#e2e3e5',
      alignSelf: 'flex-start',
    },
    inputForm: {
      display: 'flex',
      alignItems: 'center',
    },
    inputField: {
      flex: 1,
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginRight: '10px',
    },
    sendButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
    },
    sendButtonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <div style={styles.container}>
      <h1>ChatGPT React Chatbot</h1>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              ...(msg.type === 'user' ? styles.userMessage : styles.botMessage),
            }}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.inputField}
        />
        <button
          type="submit"
          style={styles.sendButton}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.sendButtonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.sendButton.backgroundColor}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
