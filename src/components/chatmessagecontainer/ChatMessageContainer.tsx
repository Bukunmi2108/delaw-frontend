import './ChatMessageContainer.css';
import React, { useState, useEffect, useRef } from 'react';
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import ai from '../..//assets/ai.svg'
import { MdContentCopy } from "react-icons/md";
import ReactMarkdown from 'react-markdown';
import { Tooltip } from 'react-tooltip';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export type ChatMessage = {
    role: 'user' | 'assistant' | 'error';
    content: string;
};

export interface chatHistory {
    id: string;
    title: string | null;
    created_at: string;
    messages: ChatMessage[];
}

export type ChatMessageContainerProps = {
    messages: ChatMessage[];
    isStreaming: boolean;
};

const ChatMessageContainer: React.FC<ChatMessageContainerProps> = ({ messages, isStreaming }) => {
    const [ASSISTANT, USER, ERROR] = ['assistant', 'user', 'error'];
    const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const override: CSSProperties = {
        display: "block",
        margin: "0 auto",
        borderColor: "blue",
    };

    const TooltipStyles = {
        backgroundColor: '#f5f5f5',
        color: '#333',
        borderRadius: '5px',
        padding: '5px',
        fontSize: '12px'
    };

    const handleCopy = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedMessageIndex(index);
        setTimeout(() => setCopiedMessageIndex(null), 2000);
    };

    useEffect(() => {
        // Scroll to the bottom of the chat container when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <main className='chat-container' ref={chatContainerRef}>
            {isStreaming && messages.length === 0 ? (
                <ClipLoader
                    color="#ffffff"
                    loading={isStreaming}
                    cssOverride={override}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            ) : messages.length === 0 && !isStreaming ? (
                <div className='blank-chat-container'>
                    <h1>Chat with Casesimpli AI</h1>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div className='message-chat-container' key={`${message?.role}-${index}`}>
                        {message.role === USER ? (
                            <div className='chat-message-user' key={`${message?.role}-${index}`}>
                                <div className='chat-message-user-content'>
                                    {message.content}
                                </div>
                            </div>
                        ) : message.role === ASSISTANT || message.role === ERROR ? (
                            <div className='chat-message-assistant' key={`${message?.role}-${index}`}>
                                <div className='chat-message-assistant-widget'>
                                    <div>
                                        <img className='avatar' src={ai} alt="Delaw ai" />
                                        {/* {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === ASSISTANT && (
                                            <span className='justasec'>Just a sec...</span>
                                        )} */}
                                    </div>
                                    <MdContentCopy
                                        className='copy'
                                        onClick={() => handleCopy(message.content, index)}
                                        style={{ color: copiedMessageIndex === index ? 'royalblue' : undefined }}
                                        id={`copy-btn-${index}`} // Make the ID unique for each copy button
                                    />
                                </div>
                                <div className='chat-message-assistant-content'>
                                    <ReactMarkdown
                                        children={message?.content}
                                        rehypePlugins={[rehypeRaw]}
                                        remarkPlugins={[remarkGfm]}
                                        remarkRehypeOptions={{ passThrough: ['link'] }}                                     components={{
                                            code({ className, children, ...props }) {
                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        ) : null}
                        {message.role === ASSISTANT || message.role === ERROR ? (
                            <Tooltip
                                anchorSelect={`#copy-btn-${index}`}
                                content={copiedMessageIndex === index ? 'Copied!' : 'Copy'}
                                style={TooltipStyles}
                                delayShow={200}
                                delayHide={200}
                            />
                        ) : null}
                    </div>
                ))
            )}
            {isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === ASSISTANT && (
                <div className='chat-message-assistant'>
                    <ClipLoader color="#ffffff" loading={isStreaming} size={20} />
                </div>
            )}
        </main>
    );
};

export default ChatMessageContainer;