import React, { useState, useEffect } from "react";
import '../../App.css'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { Sidebar, ChatMessageContainer, Header, InputBox, SizeWidget, Login } from "../../components";
import { ChatMessage, chatHistory } from "../../components/chatmessagecontainer/ChatMessageContainer";
import apiService from "../../api/api";
import { throttle } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

interface ChatProps {
    windowSize: number;
}

const Chat: React.FC<ChatProps> = ({windowSize}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTextAreaDisabled, setIsTextAreaDisabled] = useState<boolean>(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [sidebarIsLoading, setSidebarIsLoading] = useState<boolean>(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string>('');
    const [chatHistories, setChatHistories] = useState<chatHistory[]>([])
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const { id: routeId } = useParams<{ id?: string }>(); // Get the 'id' parameter from the URL
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setOpen(!open);
    };


    const TooltipStyles = {
        backgroundColor: '#f5f5f5',
        color: '#333',
        borderRadius: '5px',
        padding: '5px',
        fontSize: '12px'
    };

    useEffect(() => {
        if (userPrompt === '') {
            setIsTextAreaDisabled(true);
        } else if (isStreaming) { 
            setIsTextAreaDisabled(true);
        }
    }, [userPrompt, isStreaming]);

    useEffect(() => {
        if (open) {
            const fetchChatHistory = async () => {
                setSidebarIsLoading(true);
                try {
                    const response: chatHistory[] = await apiService.getAllChatHistory();
                    setChatHistories(response);
                } catch (error) {
                    console.error('Error fetching chat history:', error);
                } finally {
                    setSidebarIsLoading(false);
                }
            };
            fetchChatHistory();
        }
    }, [open]);

    useEffect(() => {
        const setChat = async () => {
            if (routeId) {
                setSelectedConversationId(routeId);
                setCurrentChatId(routeId); // Also set currentChatId for API requests
                const selectedChat = await apiService.getChatHistory(routeId);
                console.log('Selected chat:', selectedChat);
                setMessages(selectedChat?.messages || []);
                // setOpen(false); // Close sidebar if it was open
                setIsTextAreaDisabled(false);
            } else {
                // If no ID in the URL, clear the selected conversation and messages
                setSelectedConversationId('');
                setCurrentChatId(null);
                setMessages([]);
            }
        }
        setChat();
    }, [routeId, chatHistories]); // Re-run when routeId or chatHistories change

    const onSendPrompt = async () => {
        if (userPrompt.trim() === "") {
            return;
        }
    
        const userMessage: ChatMessage = { role: 'user', content: userPrompt };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setUserPrompt("");
        setIsStreaming(true);
        setIsTextAreaDisabled(true);
    
        // Add an empty assistant message for streaming display
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: '' }]);
        let currentAssistantContent = '';
    
        try {
            const requestBody = {
                message: userPrompt,
                chat_id: currentChatId,
            };
    
            const response = await apiService.chatStream(requestBody);
    
            if (!response.body) {
                console.error('Could not get reader from response body.');
                setIsStreaming(false);
                setIsTextAreaDisabled(false);
                return;
            }
    
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    setIsStreaming(false);
                    setIsTextAreaDisabled(false);
                    break;
                }
                const chunk = decoder.decode(value);
                try {
                    // Attempt to parse each chunk as a JSON object
                    const parsed = JSON.parse(chunk);
                    if (parsed.chat_id && !currentChatId) {
                        setCurrentChatId(parsed.chat_id);
                    } else if (parsed.data) {
                        currentAssistantContent += parsed.data;
                        updateAssistantMessage(currentAssistantContent);
                    } else if (parsed.end) {
                        setIsStreaming(false);
                        setIsTextAreaDisabled(false);
                    }
                } catch (error) {
                    // If parsing fails, assume it's plain text and append
                    currentAssistantContent += chunk;
                    updateAssistantMessage(currentAssistantContent);
                }
            }
        } catch (error) {
            console.error('Error during chat stream:', error);
            setIsStreaming(false);
            setIsTextAreaDisabled(false);
            setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'error', content: 'Failed to get response.' }]);
        }
    };
    
    // Helper function to throttle message updates
    const updateAssistantMessage = throttle((content: string) => {
        setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, content }];
            }
            return prev;
        });
    }, 100);


    const onSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        const selectedChat = chatHistories.find((chat) => chat.id === conversationId);
        setMessages(selectedChat?.messages || []);
        setCurrentChatId(conversationId);
        navigate(`/chat/${conversationId}`);
        setUserPrompt("");
        setOpen(false);
        setIsTextAreaDisabled(false)
    }

    const startNewChat = () => {
        // Clear the URL ID parameter when starting a new chat
        window.history.pushState({}, '', '/chat'); // Or whatever your base chat URL is
        setMessages([]);
        setCurrentChatId(null);
        setSelectedConversationId('');
        setUserPrompt('');
        setIsTextAreaDisabled(false);
        setOpen(false); // Close sidebar if open
    };


    return (
        <>
            <section className='app'>
                <main className='main'>
                    <Sidebar
                        open={open}
                        size={windowSize}
                        chatHistories={chatHistories}
                        selectedConversationId={selectedConversationId}
                        onSelectConversation={onSelectConversation}
                        isLoading={sidebarIsLoading}
                        toggleSidebar={toggleSidebar}
                    />

                    <Header
                        toggleSidebar={toggleSidebar}
                        onNewChat={startNewChat}
                    />

                    <Login
                        isOpen={isLoginOpen}
                        onClose={() => setIsLoginOpen(false)}
                    />

                    <ChatMessageContainer
                        messages={messages}
                        isStreaming={isStreaming}
                    />

                    <InputBox
                        userPrompt={userPrompt}
                        setUserPrompt={setUserPrompt}
                        isTextAreaDisabled={isTextAreaDisabled}
                        onSendPrompt={onSendPrompt}
                        setIsTextAreaDisabled={setIsTextAreaDisabled}
                        isStreaming={isStreaming}
                    />

                    <SizeWidget size={windowSize} />
                </main>
            </section>

            {/* Tooltips */}
            <Tooltip anchorSelect='#new-chat' content='New Chat' style={TooltipStyles} />
            <Tooltip anchorSelect='#send-btn' content='Send' style={TooltipStyles} />
        </>
    );
};

export default Chat;