import React, { useState, useEffect } from "react";
import '../../App.css'
import 'react-tooltip/dist/react-tooltip.css'
import { Sidebar, Header, SizeWidget, DocumentContainer } from "../../components";
import { ChatMessage, chatHistory } from "../../components/chatmessagecontainer/ChatMessageContainer";
import apiService from "../../api/api";
import { useNavigate, useParams } from 'react-router-dom';

interface ChatProps {
    windowSize: number;
}

const Chat: React.FC<ChatProps> = ({windowSize}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sidebarIsLoading, setSidebarIsLoading] = useState<boolean>(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string>('');
    const [chatHistories, setChatHistories] = useState<chatHistory[]>([])
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const { id: routeId } = useParams<{ id?: string }>(); // Get the 'id' parameter from the URL
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setOpen(!open);
    };


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
            } else {
                // If no ID in the URL, clear the selected conversation and messages
                setSelectedConversationId('');
                setCurrentChatId(null);
                setMessages([]);
            }
        }
        setChat();
    }, [routeId, chatHistories]); // Re-run when routeId or chatHistories change


    const onSelectConversation = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        const selectedChat = chatHistories.find((chat) => chat.id === conversationId);
        setMessages(selectedChat?.messages || []);
        setCurrentChatId(conversationId);
        navigate(`/chat/${conversationId}`);
        setUserPrompt("");
        setOpen(false);
    }

    const startNewChat = () => {
        // Clear the URL ID parameter when starting a new chat
        window.history.pushState({}, '', '/chat'); // Or whatever your base chat URL is
        setMessages([]);
        setCurrentChatId(null);
        setSelectedConversationId('');
        setUserPrompt('');
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

                    <DocumentContainer />

                    <SizeWidget size={windowSize} />
                </main>
            </section>

        </>
    );
};

export default Chat;