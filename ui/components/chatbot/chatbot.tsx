"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! I'm here to help you with anything you need.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setInputText("");
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isExpanded &&
        chatContainerRef.current &&
        inputRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setInputText("");
        inputRef.current.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className="h-fit w-fit">
      <div className="fixed top-3 left-1/2 z-[999] h-fit w-full max-w-lg -translate-x-1/2">
        <div className="border-primary/50 flex w-full gap-2 rounded-md border-2 bg-white/50 p-4 shadow-lg backdrop-blur-md">
          <Input
            ref={inputRef}
            type={"text"}
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={handleInputFocus}
            onKeyPress={handleKeyPress}
            className="h-[40px] border-none bg-transparent text-base font-semibold text-black shadow-none outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <span
            onClick={handleSendMessage}
            className={`border-border text-primary flex w-[50px] transform cursor-pointer items-center justify-center rounded-md border border-solid bg-white px-2 transition-all duration-200 ease-linear`}
          >
            <Send />
          </span>
        </div>
      </div>

      <div
        className={`border-primary/50 fixed top-28 right-4 bottom-4 left-4 z-[999] mx-auto w-full max-w-2xl rounded-2xl border-2 transition-all duration-500 ease-out ${
          isExpanded
            ? "translate-y-0 transform opacity-100"
            : "pointer-events-none -translate-y-8 transform opacity-0"
        }`}
      >
        <div
          ref={chatContainerRef}
          className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex w-full justify-end">
            <Button size={"icon"} onClick={handleClose} className="px-5">
              <X />
            </Button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-4 py-12 text-center">
                <div className="bg-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <MessageCircle size={32} className="text-white" />
                </div>
                <h4 className="text-lg font-semibold">Welcome to Chat!</h4>
                <p>
                  Start typing your message above to begin the conversation.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm lg:max-w-md ${
                        message.isUser
                          ? "rounded-br-none bg-blue-500 text-white"
                          : "rounded-bl-none border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`mt-1 text-xs ${
                          message.isUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
