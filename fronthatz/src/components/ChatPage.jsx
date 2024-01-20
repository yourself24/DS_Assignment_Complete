// ChatPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import WebSocketChatService from '../services/WebSocketChatService.jsx';
import './ChatPage.css';
import {useNavigate} from "react-router-dom"; // Import your CSS file

function ChatPage() {
    const sender = sessionStorage.getItem('username');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({ recipient: '', content: '' });
    const navigate = useNavigate();
    const webSocketChatServiceRef = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection
        webSocketChatServiceRef.current = WebSocketChatService();
        webSocketChatServiceRef.current.initializeWebSocketConnection();

        // Subscribe to messages
        webSocketChatServiceRef.current.subscribeToMessages((message) => {
            // Update the state with the new message
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        checkLogin();
    }, []);

    const handleSendMessage = () => {
        const message = {
            sender: sender,
            recipient: newMessage.recipient,
            content: newMessage.content,
            timestamp: new Date().getMinutes(),
        };

        // Send the message
        webSocketChatServiceRef.current.sendMessage(message);

        // Clear the input fields
        setNewMessage({ recipient: '', content: '' });
    };
    const checkLogin = () => {
        if (sessionStorage.getItem('username') === null) {
            alert("You are not logged in!");
            navigate('/login');
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`chat-message ${message.sender === sender ? 'self' : 'other'}`}
                    >
                        <p>{`${message.timestamp} ${message.sender} (To ${message.recipient}): ${message.content}`}</p>
                    </div>
                ))}
            </div>

            {/* Input fields and buttons within the chat box */}
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Recipient"
                    value={newMessage.recipient}
                    onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                />
                <button onClick={handleSendMessage}>Send</button>
                <button onClick={() => webSocketChatServiceRef.current.subscribeToMessages((message) => {
                    console.log('Received message:', message);

                    setMessages((prevMessages) => [...prevMessages, message]);
                })}>Sync</button>
            </div>
        </div>
    );
}

export default ChatPage;
