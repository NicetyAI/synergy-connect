import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Bot, User as UserIcon } from "lucide-react";

const QUESTIONS = [
  {
    id: "location",
    bot: "Great choices! 🎉 Now, where are you based?",
    placeholder: "e.g., Toronto, Canada",
    field: "location",
    type: "input"
  },
  {
    id: "bio",
    bot: "Awesome! Tell us a bit about yourself and what you're looking for. This helps others connect with you! 💬",
    placeholder: "e.g., Serial entrepreneur looking for strategic partnerships in tech...",
    field: "bio",
    type: "textarea"
  }
];

export default function ProfileChat({ onNext, userData }) {
  const [messages, setMessages] = useState([
    { type: "bot", text: "You're doing amazing! Let's add a few more details to help you stand out. 🌟" }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [answers, setAnswers] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Show first question after a delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "bot",
        text: QUESTIONS[0].bot
      }]);
    }, 800);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const question = QUESTIONS[currentQuestion];
    
    // Add user message
    setMessages(prev => [...prev, {
      type: "user",
      text: userInput
    }]);

    // Save answer
    const newAnswers = { ...answers, [question.field]: userInput };
    setAnswers(newAnswers);
    setUserInput("");

    // Check if there are more questions
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          text: QUESTIONS[currentQuestion + 1].bot
        }]);
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // All done!
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "bot",
          text: "Perfect! 🎊 You're all set. Let's find some opportunities for you..."
        }]);
        setTimeout(() => {
          onNext(newAnswers);
        }, 1500);
      }, 500);
    }
  };

  const question = QUESTIONS[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-3xl"
    >
      <div className="p-8 rounded-3xl flex flex-col" style={{ background: '#fff', border: '2px solid #000', height: '600px' }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: '2px solid #000' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#D8A11F' }}>
            <Bot className="w-6 h-6" style={{ color: '#fff' }} />
          </div>
          <div>
            <h3 className="font-bold" style={{ color: '#000' }}>BuyersAlike Assistant</h3>
            <p className="text-sm" style={{ color: '#666' }}>Here to help you get started</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'rounded-tr-none'
                      : 'rounded-tl-none'
                  }`}
                  style={{
                    background: message.type === 'user' ? '#D8A11F' : '#f5f5f5',
                    color: message.type === 'user' ? '#fff' : '#000',
                    border: message.type === 'user' ? 'none' : '1px solid #000'
                  }}
                >
                  {message.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        {currentQuestion < QUESTIONS.length && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {question.type === 'input' ? (
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={question.placeholder}
                className="text-lg"
                style={{ background: '#fff', border: '2px solid #000', color: '#000' }}
                autoFocus
              />
            ) : (
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={question.placeholder}
                className="text-lg resize-none"
                style={{ background: '#fff', border: '2px solid #000', color: '#000' }}
                rows={3}
                autoFocus
              />
            )}
            <Button
              type="submit"
              disabled={!userInput.trim()}
              className="w-full py-6 rounded-xl gap-2 hover:scale-105 transition-transform"
              style={{ background: '#D8A11F', color: '#fff' }}
            >
              Send
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
}