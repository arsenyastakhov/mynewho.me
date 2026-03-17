import React, { useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Smartphone, KeyRound, DoorOpen, ArrowUp } from 'lucide-react';
import './SelfTourSection.css';

const steps = [
  {
    icon: <Smartphone size={32} />,
    title: "1. Request a Tour below:",
    desc: <a href="sms:9412734666?body=RENT" style={{ color: 'inherit', textDecoration: 'underline' }}>Text “RENT” to (941) 273-4666</a>
  },
  {
    icon: <KeyRound size={32} />,
    title: "2. Get Your Code",
    desc: "Receive a secure, temporary smart-lock code directly to your phone."
  },
  {
    icon: <DoorOpen size={32} />,
    title: "3. Tour on Your Time",
    desc: "Visit the property whenever it fits your schedule. No hidden fees or coordination needed."
  }
];

const SelfTourSection = () => {
  const [chatPhase, setChatPhase] = useState(0);

  useEffect(() => {
    let timeoutId;

    const runCycle = () => {
      setChatPhase(0);
      timeoutId = setTimeout(() => {
        setChatPhase(1); // Keyboard up
        timeoutId = setTimeout(() => {
          setChatPhase(2); // "R"
          timeoutId = setTimeout(() => {
            setChatPhase(3); // "RE"
            timeoutId = setTimeout(() => {
              setChatPhase(4); // "REN"
              timeoutId = setTimeout(() => {
                setChatPhase(5); // "RENT"
                timeoutId = setTimeout(() => {
                  setChatPhase(6); // Sent "RENT", keyboard down
                  timeoutId = setTimeout(() => {
                    setChatPhase(7); // System typing
                    timeoutId = setTimeout(() => {
                      setChatPhase(8); // System replies
                      timeoutId = setTimeout(() => {
                        runCycle();
                      }, 5000); // Wait 5s before restarting
                    }, 1500); // Typing for 1.5s
                  }, 500); // 0.5s after sent
                }, 800); // 0.8s pause after typing
              }, 200); // 0.2s between letters
            }, 200); // 0.2s between letters
          }, 200); // 0.2s between letters
        }, 600); // 0.6s after keyboard up
      }, 1000); // 1s after cycle starts
    };

    runCycle();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const renderInputArea = () => {
    let inputText = "";
    if (chatPhase === 2) inputText = "R";
    if (chatPhase === 3) inputText = "RE";
    if (chatPhase === 4) inputText = "REN";
    if (chatPhase >= 5 && chatPhase < 6) inputText = "RENT";

    const isTyping = chatPhase >= 2 && chatPhase < 6;
    const isKeyboardVisible = chatPhase >= 1;
    
    return (
      <div className="chat-bottom-section">
        <div className="chat-input-area">
          <div className="chat-input-bubble">
            {isTyping ? inputText : <span className="chat-input-placeholder">Text Message</span>}
          </div>
          <div className={`send-button ${inputText.length > 0 ? 'active' : 'inactive'}`}>
            <ArrowUp size={16} strokeWidth={3} />
          </div>
        </div>
        
        <AnimatePresence>
          {isKeyboardVisible && (
            <motion.div 
              className="keyboard-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="keyboard-row">
                {['Q','W','E','R','T','Y','U','I','O','P'].map(k => (
                  <div key={k} className={`key ${(chatPhase === 2 && k === 'R') || (chatPhase === 3 && k === 'E') || (chatPhase === 5 && k === 'T') ? 'active' : ''}`}>{k}</div>
                ))}
              </div>
              <div className="keyboard-row">
                {['A','S','D','F','G','H','J','K','L'].map(k => (
                  <div key={k} className="key">{k}</div>
                ))}
              </div>
              <div className="keyboard-row">
                <div className="key special-key">shift</div>
                {['Z','X','C','V','B','N','M'].map(k => (
                  <div key={k} className={`key ${(chatPhase === 4 && k === 'N') ? 'active' : ''}`}>{k}</div>
                ))}
                <div className="key special-key">delete</div>
              </div>
              <div className="keyboard-row">
                <div className="key special-key">123</div>
                <div className="key space-key">space</div>
                <div className="key special-key">return</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section className="section self-tour-section" id="how-it-works">
      <div className="container">
        <div className="tour-layout">
          
          <motion.div 
            className="tour-text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>Tour homes instantly.<br/>No agent required.</h2>
            <p className="tour-subtitle">
              We've redesigned the rental experience to be as seamless as ordering a ride. View homes on your own schedule using our secure smart-lock technology.
            </p>
            
            <div className="steps-list">
              {steps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <div className="step-icon-wrapper">
                    {step.icon}
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="tour-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="visual-card placeholder-phone">
              <div className="chat-interface">
                <div className="chat-header">
                  <div className="chat-contact">
                    <div className="contact-avatar">MNH</div>
                    <span>MyNewHome</span>
                  </div>
                </div>
                <div className="chat-body">
                  <AnimatePresence>
                    {chatPhase >= 6 && (
                      <motion.div 
                        className="chat-bubble user-bubble"
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                      >
                        RENT
                      </motion.div>
                    )}
                    
                    {chatPhase === 7 && (
                      <motion.div 
                        className="chat-bubble system-bubble typing-bubble"
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom left' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      >
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </motion.div>
                    )}

                    {chatPhase >= 8 && (
                      <motion.div 
                        className="chat-bubble system-bubble"
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom left' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                      >
                        Welcome! Here's your access code:
                        <div className="chat-code">8 4 2 1</div>
                        Valid until 5:00 PM today.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {renderInputArea()}
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default SelfTourSection;
