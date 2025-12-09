import React from 'react';
import { Message, Sender } from '../types';
import { TypewriterEffect } from './TypewriterEffect';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLast }) => {
  const isBot = message.sender === Sender.Bot;

  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in-up`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3 shadow-md relative ${
          isBot
            ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}
      >
        {isBot && (
          <div className="absolute -top-6 left-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-slate-900 shadow-sm">
              <i className="fas fa-dumbbell text-white text-xs"></i>
            </div>
            <span className="text-xs text-slate-400 font-semibold">CaliCoach</span>
          </div>
        )}

        <div className="text-sm sm:text-base leading-relaxed">
           {isBot && isLast && !message.isMarkdown ? (
             <TypewriterEffect text={message.text} speed={15} />
           ) : (
             <div className="markdown-body">
               {message.isMarkdown ? (
                 <ReactMarkdown 
                    components={{
                        strong: ({node, ...props}) => <span className="font-bold text-indigo-300" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2 text-indigo-400" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2 text-indigo-400" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 whitespace-pre-wrap" {...props} />,
                    }}
                 >
                    {message.text}
                 </ReactMarkdown>
               ) : (
                 <span className="whitespace-pre-wrap">{message.text}</span>
               )}
             </div>
           )}
        </div>
        
        <div className={`text-[10px] mt-1 opacity-60 ${isBot ? 'text-left' : 'text-right'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
