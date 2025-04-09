//Sidebar.tsx.... add a loader
import React from 'react';
import './Sidebar.css';
import { CiChat1 } from 'react-icons/ci';
import { IoDocumentOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';
import { GoBook } from 'react-icons/go';
import { chatHistory } from '../chatmessagecontainer/ChatMessageContainer';
import { LuAlignLeft } from 'react-icons/lu';
import ClipLoader from 'react-spinners/ClipLoader';
import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    open: boolean;
    size: number;
    chatHistories: chatHistory[];
    selectedConversationId: string;
    toggleSidebar: () => void;
    onSelectConversation: (conversationId: string) => void;
    isLoading: boolean; // Add a prop to indicate loading state
}

interface NavItem {
    icon: React.JSX.Element;
    title: string;
    link: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    open,
    size,
    chatHistories,
    selectedConversationId,
    onSelectConversation,
    toggleSidebar,
    isLoading // Receive the isLoading prop
}) => {
    // const asideRef = useRef<HTMLDivElement>(null);
  

    const NavItems: NavItem[] = [
        { icon: <CiChat1 />, title: 'Chat with DeLaw', link: '/chat' },
        { icon: <IoDocumentOutline />, title: 'Draft a legal document', link: '/document' },
        { icon: <GoBook />, title: 'Legal Dictionary', link: '/' },
        { icon: <VscAccount />, title: 'User Account', link: '/' },
    ];

    const override: CSSProperties = {
        display: "block",
        margin: "10px auto", // Adjust margin as needed
        borderColor: "lightgray",
    };

      // useEffect(() => {
      //   const handleOutsideClick = (event: MouseEvent) => {
      //     if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
      //       onClose();
      //     }
      //   };
    
      //   if (open) {
      //     document.addEventListener('mousedown', handleOutsideClick);
      //   }
    
      //   // return () => {
      //   //   document.removeEventListener('mousedown', handleOutsideClick);
      //   // };
      // }, [onClose]);

    return (
        <aside className={'sidebar' + (open ? ' open' : '') + (size < 768 ? ' small' : ' large')}>
            <nav className="sidebar-nav">
                <div className="recent">
                    <h2>Recent</h2>
                    {isLoading ? ( // Display loader when isLoading is true
                        <ClipLoader color="#36D7B7" loading={isLoading} cssOverride={override} size={30} />
                    ) : chatHistories.length > 0 ? (
                        <ul className="recent-container">
                            {chatHistories.map((conversation) => (
                                <li
                                    key={conversation.id}
                                    className={'recent-item' + (conversation.id === selectedConversationId ? ' selected-conversation' : '')}
                                    onClick={() => onSelectConversation(conversation.id)}
                                >
                                    <span className="recent-item-icon">
                                        <LuAlignLeft />
                                    </span>
                                    <span className="recent-item-title">
                                        {conversation.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-recent-chats">No recent chats</p>
                    )}
                </div>

                <ul className="sidebar-nav-container">
                    {NavItems.map((item, index) => (
                        <Link to={item.link} key={index} onClick={toggleSidebar}>
                            <li key={index} className="sidebar-nav-item">
                                <span className="sidebar-nav-item-icon">{item.icon}</span>
                                <span className="sidebar-nav-item-title">{item.title}</span>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;