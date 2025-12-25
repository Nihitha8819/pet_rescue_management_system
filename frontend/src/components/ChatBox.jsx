import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const ChatBox = ({ currentUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch contacts (admins or people who messaged)
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (currentUser && isOpen && token) {
            fetchContacts();
        }
    }, [currentUser, isOpen]);

    // Fetch messages when contact is selected
    useEffect(() => {
        if (selectedContact) {
            fetchMessages(selectedContact.id);
            const interval = setInterval(() => fetchMessages(selectedContact.id), 5000); // Poll every 5s
            return () => clearInterval(interval);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/chat/contacts/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(res.data);
            // If user is not admin and only 1 admin, select them auto
            if (res.data.length === 1 && !selectedContact) {
                setSelectedContact(res.data[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await axios.get(`${API_URL}/chat/history/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                `${API_URL}/chat/send/`,
                {
                    receiver_id: selectedContact.id,
                    content: newMessage,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewMessage('');
            fetchMessages(selectedContact.id);
        } catch (err) {
            console.error(err);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 flex flex-col h-[500px] border border-gray-200">
                    {/* Header */}
                    <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <h3 className="font-semibold">
                            {selectedContact ? selectedContact.name || selectedContact.email : 'Support Chat'}
                        </h3>
                        <div className="flex gap-2">
                            {selectedContact && (
                                <button onClick={() => setSelectedContact(null)} className="hover:text-gray-200 text-sm">
                                    Back
                                </button>
                            )}
                            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {!selectedContact ? (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 mb-2">Select a person to chat with:</p>
                                {contacts.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => setSelectedContact(c)}
                                        className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow hover:bg-gray-50 transition"
                                    >
                                        <div className="font-medium text-gray-800">{c.name || 'User'}</div>
                                        <div className="text-xs text-gray-500">{c.email}</div>
                                    </button>
                                ))}
                                {contacts.length === 0 && (
                                    <div className="text-center text-gray-500 mt-10">No contacts found.</div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <p className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello!</p>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender.id === currentUser.id;
                                        return (
                                            <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] rounded-lg p-3 text-sm ${isMe
                                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                                    }`}>
                                                    <p>{msg.content}</p>
                                                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {selectedContact && (
                        <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-emerald-600 text-white rounded-full p-2 hover:bg-emerald-700 disabled:opacity-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBox;
