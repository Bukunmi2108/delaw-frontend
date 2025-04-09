import { LuMenu, LuPlus } from "react-icons/lu";
import React from "react";
import { IoMdLogIn } from "react-icons/io";
import apiService from "../../api/api";
import { useNavigate } from "react-router-dom";

type ClickHandler = (event?: React.MouseEvent<HTMLElement>) => void;

interface HeaderProps {
  toggleSidebar: ClickHandler;
  onNewChat: ClickHandler; 
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onNewChat }) => {
  const handleMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    toggleSidebar();
  };

  const navigate = useNavigate()

  const Logout = () => {
    apiService.logout()
    navigate('/login')
  }
  return (
    <header className="header">
      <span onClick={handleMenuClick} id="menu-btn" className="menu-btn">
        <LuMenu className="menu-btn-icon" />
      </span>
      <h1>CaseSimpli AI</h1>
      <span className="header-icons">
        <span id="new-chat" className="icon" onClick={onNewChat}> 
          <LuPlus />
        </span>
        <span className="icon" onClick={Logout}> 
          <IoMdLogIn />
        </span>
      </span>
    </header>
  );
};

export default Header;