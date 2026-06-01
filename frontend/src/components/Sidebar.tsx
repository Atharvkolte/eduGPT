import React from "react";
import { useNavigate } from "react-router-dom";
import { PanelRightClose, PanelRightOpen, Settings, LogOut, Pencil, Trash } from "lucide-react";
import { useChat } from "../context/ChatContext";

/* TYPES */

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* COMPONENT */

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    createNewChat,
    deleteThread,
    renameThread,
  } = useChat();

  const [editingId, setEditingId] =
    React.useState<string | null>(null);

  const [editTitle, setEditTitle] =
    React.useState("");

  /* HANDLERS */

  const handleLogout = () => {
    localStorage.removeItem(
      "isAuthenticated"
    );

    localStorage.removeItem("role");

    navigate("/login");
  };

  const handleRenameSubmit = (
    id: string
  ) => {
    if (editTitle.trim()) {
      renameThread(
        id,
        editTitle.trim()
      );
    }

    setEditingId(null);
  };

  /* UI */

  return (
    <div
      className={`sidebar ${
        isOpen ? "open" : "closed"
      }`}
    >
      {/* HEADER */}

      <div className="sidebar-header">
        {isOpen && (
          <h2 className="logo">
            StudyAntra
          </h2>
        )}

        <button
          className="toggle-btn"
          onClick={() =>
            setIsOpen(!isOpen)
          }
        >
          {isOpen ? (
            <PanelRightClose
              size={22}
            />
          ) : (
            <PanelRightOpen
              size={22}
            />
          )}
        </button>
      </div>

      {/* STUDENT CHAT FEATURES */}

      {role !== "teacher" && (
        <>
          <button
            className={`new-chat-btn ${
              isOpen
                ? "open"
                : "collapsed"
            }`}
            onClick={createNewChat}
          >
            <span className="new-chat-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="20"
                height="20"
              >
                <path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM11 10H8V12H11V15H13V12H16V10H13V7H11V10Z" />
              </svg>
            </span>

            {isOpen && (
              <span className="new-chat-text">
                New Chat
              </span>
            )}
          </button>

          {isOpen && (
            <div className="history">
              {threads.map(
                (thread) => (
                  <div
                    key={thread.id}
                    className={`history-item ${
                      activeThreadId ===
                      thread.id
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveThreadId(
                        thread.id
                      )
                    }
                  >
                    {editingId ===
                    thread.id ? (
                      <input
                        type="text"
                        className="edit-input"
                        value={editTitle}
                        autoFocus
                        onChange={(e) =>
                          setEditTitle(
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          handleRenameSubmit(
                            thread.id
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key ===
                            "Enter"
                          ) {
                            handleRenameSubmit(
                              thread.id
                            );
                          }

                          if (
                            e.key ===
                            "Escape"
                          ) {
                            setEditingId(
                              null
                            );
                          }
                        }}
                        onClick={(e) =>
                          e.stopPropagation()
                        }
                      />
                    ) : (
                      <p
                        className="history-item-text"
                        title={
                          thread.title
                        }
                      >
                        {thread.title}
                      </p>
                    )}

                    <div className="history-actions">
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          setEditingId(
                            thread.id
                          );

                          setEditTitle(
                            thread.title
                          );
                        }}
                      >
                        <Pencil
                          size={14}
                        />
                      </button>

                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteThread(
                            thread.id
                          );
                        }}
                      >
                        <Trash
                          size={14}
                        />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}

      {/* SETTINGS & LOGOUT */}

      <div
        className={`sidebar-bottom ${
          isOpen
            ? "open"
            : "collapsed"
        }`}
      >
        <div className="settings-btn">
          <Settings
            size={20}
            className="icon"
          />

          {isOpen && (
            <span className="settings-text">
              Settings
            </span>
          )}
        </div>

        <div
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut
            size={20}
            className="icon"
          />

          {isOpen && (
            <span className="logout-text">
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;