import React, { useState } from "react";
import "./Home.css";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import CalendarPanel from "../components/CalendarPanel";
import DynamicIsland from "../components/DynamicIsland";
import RightPanel from "../components/RightPanel";

import { ChatProvider } from "../context/ChatContext";
import { NotificationProvider } from "../context/NotificationContext";

const Layout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const role = localStorage.getItem("role");

  return (
    <div className="layout-container">
      <ChatProvider>
        <NotificationProvider >

          {/* 🔔 Notifications */}
          <DynamicIsland />

          {/* 👨‍🏫 TEACHER VIEW */}
          {role === "teacher" && (
            <CalendarPanel />
          )}

          {/* 👨‍🎓 STUDENT VIEW */}
          {role === "student" && (
            <>
              <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
              <MainContent />
              <RightPanel />
            </>
          )}

        </NotificationProvider>
      </ChatProvider>
    </div>
  );
};

export default Layout;