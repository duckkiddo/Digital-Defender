'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-background overflow-hidden">
      <Card className="flex flex-col w-full shadow-lg rounded-none">
          <CardHeader className="flex flex-row items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle>Mentora</CardTitle>
          </CardHeader>
        <CardContent className="flex flex-col flex-grow p-0 overflow-hidden relative">
          <ScrollArea className="flex-grow pt-4 px-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <Avatar>
                      <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg break-words ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}
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
                    <Avatar>
                      <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] p-3 rounded-lg bg-muted text-foreground animate-pulse break-words">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center p-4 bg-background border-t z-10" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}