import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, UserData } from '../types';
import { STEPS, INITIAL_GREETING } from '../constants';
import { ChatMessage } from './ChatMessage';
import { generateWorkoutRoutine } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1); // -1 is waiting for initial greeting
  const [userData, setUserData] = useState<UserData>({});
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial Load
  useEffect(() => {
    // Small delay for realism
    setIsTyping(true);
    setTimeout(() => {
      addMessage(INITIAL_GREETING, Sender.Bot);
      setCurrentStepIndex(0);
      setIsTyping(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMessage = (text: string, sender: Sender, isMarkdown = false) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      isMarkdown
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add User Message
    addMessage(text, Sender.User);
    setInputValue('');
    setIsTyping(true);

    // Save Data based on current step
    if (currentStepIndex < STEPS.length) {
      const currentStep = STEPS[currentStepIndex];
      setUserData((prev) => ({ ...prev, [currentStep.field]: text }));
    }

    // Determine Next Action
    const nextStepIndex = currentStepIndex + 1;

    if (nextStepIndex < STEPS.length) {
      // Move to next question
      setTimeout(() => {
        setCurrentStepIndex(nextStepIndex);
        addMessage(STEPS[nextStepIndex].question, Sender.Bot);
        setIsTyping(false);
      }, 800);
    } else {
      // Finished collection, Generate Routine
      setCurrentStepIndex(nextStepIndex); // Mark as beyond last step
      setIsLoading(true);
      
      try {
        // We need to pass the updated user data including the latest message
        const finalUserData = { ...userData, [STEPS[STEPS.length - 1].field]: text };
        
        // Wait a bit to simulate "thinking"
        setTimeout(async () => {
            const routine = await generateWorkoutRoutine(finalUserData);
            setIsLoading(false);
            setIsTyping(false);
            addMessage(routine, Sender.Bot, true); // true for Markdown
        }, 1500);

      } catch (error) {
        setIsLoading(false);
        setIsTyping(false);
        addMessage("Lo siento, tuve un problema generando la rutina. ¿Podemos intentar de nuevo?", Sender.Bot);
      }
    }
  };

  const handleQuickReply = (option: string) => {
    handleSendMessage(option);
  };

  const handleWhatsAppShare = () => {
    const lastBotMessage = messages.filter(m => m.sender === Sender.Bot).pop();
    if (lastBotMessage) {
        const text = encodeURIComponent(lastBotMessage.text);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  const currentStep = currentStepIndex >= 0 && currentStepIndex < STEPS.length ? STEPS[currentStepIndex] : null;
  const isFinished = currentStepIndex >= STEPS.length && !isLoading;

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-900 shadow-2xl overflow-hidden sm:rounded-xl sm:border sm:border-slate-800 sm:my-4 sm:h-[calc(100vh-2rem)]">
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <i className="fas fa-dumbbell text-white"></i>
            </div>
            <div>
                <h1 className="text-white font-bold text-lg">CaliCoach AI</h1>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-400 text-xs font-medium">En línea</span>
                </div>
            </div>
        </div>
        {isFinished && (
           <button 
             onClick={() => window.location.reload()}
             className="text-slate-400 hover:text-white transition-colors"
             title="Reiniciar chat"
           >
             <i className="fas fa-redo-alt"></i>
           </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-slate-900">
        {messages.map((msg, index) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isLast={index === messages.length - 1} 
          />
        ))}
        
        {/* Typing Indicator */}
        {(isTyping || isLoading) && (
          <div className="flex justify-start animate-fade-in-up">
             <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-md">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border-t border-slate-800 p-4">
        
        {/* Quick Replies */}
        {currentStep && currentStep.options && !isTyping && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar mask-gradient">
            {currentStep.options.map((option) => (
              <button
                key={option}
                onClick={() => handleQuickReply(option)}
                className="whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-slate-700 hover:border-indigo-500 rounded-full text-sm transition-all duration-200"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Finished State Actions */}
        {isFinished ? (
            <button
                onClick={handleWhatsAppShare}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <i className="fab fa-whatsapp text-xl"></i>
                Abrir en WhatsApp
            </button>
        ) : (
            /* Text Input */
            <div className="flex gap-2 relative">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={currentStep?.placeholder || "Escribe tu respuesta..."}
                disabled={isLoading || isTyping}
                className="flex-1 bg-slate-800 text-white placeholder-slate-500 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading || isTyping}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl w-12 flex items-center justify-center transition-colors shadow-lg"
            >
                <i className="fas fa-paper-plane"></i>
            </button>
            </div>
        )}
      </div>
    </div>
  );
};
