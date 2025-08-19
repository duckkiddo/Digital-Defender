'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, X, Minimize2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatWidgetProps {
  className?: string;
  autoOpen?: boolean;
  autoOpenDelayMs?: number;
  greeting?: string;
  showLauncherGreeting?: boolean;
  launcherGreeting?: string;
  launcherGreetingDelayMs?: number;
}

export default function ChatWidget({ className, autoOpen = false, autoOpenDelayMs = 800, greeting, showLauncherGreeting = false, launcherGreeting, launcherGreetingDelayMs = 900 }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showGreetingBubble, setShowGreetingBubble] = useState<boolean>(false);
  const [bubblePulse, setBubblePulse] = useState<boolean>(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-open with greeting (used on homepage)
  useEffect(() => {
    if (!autoOpen) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
      setIsMinimized(false);
      if (greeting) {
        setMessages((prev) => (prev.length === 0 ? [{ sender: 'bot', text: greeting }] : prev));
      }
    }, autoOpenDelayMs);
    return () => clearTimeout(timer);
  }, [autoOpen, autoOpenDelayMs, greeting]);

  // Launcher greeting bubble above the icon (outside chat)
  useEffect(() => {
    if (!showLauncherGreeting || isOpen) {
      setShowGreetingBubble(false)
      return
    }
    const t = setTimeout(() => setShowGreetingBubble(true), launcherGreetingDelayMs)
    return () => clearTimeout(t)
  }, [showLauncherGreeting, launcherGreetingDelayMs, isOpen])

  // Trigger a subtle attention pulse once when the bubble first shows
  useEffect(() => {
    if (showGreetingBubble) {
      setBubblePulse(true)
      const t = setTimeout(() => setBubblePulse(false), 900)
      return () => clearTimeout(t)
    }
  }, [showGreetingBubble])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input.trim() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { sender: 'bot', text: data.text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { sender: 'bot', text: 'Sorry, I could not process your request.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    if (!isOpen) {
      setShowGreetingBubble(false)
    }
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Greeting bubble above launcher */}
      <AnimatePresence>
        {!isOpen && showGreetingBubble && launcherGreeting && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: bubblePulse ? [1, 1.035, 1] : 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.8, duration: bubblePulse ? 0.6 : undefined }}
            className="absolute -top-3 right-0 translate-y-[-100%] w-72 bg-background border shadow-xl rounded-xl p-3"
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                <Bot className="w-4 h-4" />
              </span>
              <div className="text-sm leading-snug">
                {launcherGreeting}
              </div>
              <button
                aria-label="Dismiss greeting"
                className="ml-auto text-muted-foreground hover:text-foreground"
                onClick={() => setShowGreetingBubble(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -bottom-1 right-6 w-3 h-3 bg-background border-r border-b rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          aria-label="Open chat"
          size="lg"
          className="group relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-600 text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-200"
        >
          {/* subtle glow */}
          <span className="pointer-events-none absolute inset-0 rounded-full bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></span>
          {/* tiny notification ping */}
          <span className="absolute top-3 right-3 inline-flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400"></span>
          </span>
          {/* icon stack */}
          <div className="relative z-10 flex items-center justify-center">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary shadow-sm">
              <Bot className="w-6 h-6" />
            </span>
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 opacity-90" />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] shadow-2xl border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary/5">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Mentora</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="flex flex-col flex-grow p-0 overflow-hidden relative h-[400px]">
                <ScrollArea className="flex-grow pt-4 px-4">
                  <div className="space-y-4 pb-4">
                    {messages.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                        <p className="text-sm">Hi! I'm Mentora, your AI assistant for digital wellbeing.</p>
                        <p className="text-xs mt-2">Ask me about cybersecurity, screen time, or misinformation detection!</p>
                      </div>
                    )}
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                      >
                        {msg.sender === 'bot' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <Bot className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] p-3 rounded-lg break-words ${
                            msg.sender === 'user' 
                              ? 'bg-primary text-primary-foreground rounded-br-none' 
                              : 'bg-muted text-foreground rounded-bl-none'
                          }`}
                        >
                          {msg.sender === 'bot' ? (
                            <ReactMarkdown components={{
                              p: ({ node, ...props }) => <p className="text-sm" {...props} />,
                            }}>
                              {msg.text}
                            </ReactMarkdown>
                          ) : (
                            <p className="text-sm">{msg.text}</p>
                          )}
                        </div>
                        {msg.sender === 'user' && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="max-w-[70%] p-3 rounded-lg bg-muted text-foreground animate-pulse">
                          <p className="text-sm">Typing...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="flex gap-2 items-center p-4 bg-background border-t">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow text-sm"
                    disabled={loading}
                  />
                  <Button type="submit" size="sm" disabled={loading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
