"use client";

import { useState } from 'react';
import styles from '@/styles/Support.module.css';
import { Upload, MessageSquare, Video, Send, User, Headset } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LearningSupport() {
  const [activeTab, setActiveTab] = useState<'doubt' | 'backup'>('doubt');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you with your doubt today?", sender: 'support', time: '10:00 AM' },
    { id: 2, text: "I'm having trouble with Redux Toolkit middleware.", sender: 'student', time: '10:05 AM' },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      text: newMessage, 
      sender: 'student', 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setNewMessage("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Learning <span>Support & Chat</span></h1>
      </header>

      <div className={styles.mainLayout}>
        {/* LEFT: Request Form */}
        <div className={styles.formSection}>
          <div className={styles.tabContainer}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'doubt' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('doubt')}
            >
              <MessageSquare size={18} /> Doubt
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'backup' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('backup')}
            >
              <Video size={18} /> Backup
            </button>
          </div>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Topic</label>
              <input type="text" placeholder="Enter topic..." className={styles.input} />
            </div>
            <textarea placeholder="Describe here..." className={styles.textarea} rows={4} />
            <button type="button" className={styles.submitBtn}>Send Request</button>
          </form>
        </div>

        {/* RIGHT: Chat Window */}
        <div className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <Headset size={20} />
            <div>
              <h4>Support Mentor</h4>
              <span>Online</span>
            </div>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'student' ? styles.studentMsg : styles.supportMsg}`}>
                <div className={styles.msgBubble}>
                  <p>{msg.text}</p>
                  <span className={styles.msgTime}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className={styles.chatFooter}>
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
            />
            <button type="submit"><Send size={18} /></button>
          </form>
        </div>
      </div>
    </div>
  );
}