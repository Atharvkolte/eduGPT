import React, { useState, useEffect } from "react";
import {BookOpen,Cog,Monitor,Puzzle} from "lucide-react";
const subjects = [
  {
    short: "DSA",
    label: "DSA",
    icon: <BookOpen size={20} />,
  },
  {
    short: "OOPS",
    label: "OOP",
    icon: <Cog size={20} />,
  },
  {
    short: "OS",
    label: "OS",
    icon: <Monitor size={20} />,
  },
  {
    short: "SE",
    label: "SE",
    icon: <Puzzle size={20} />,
  },
];

/* COMPONENT */

const RightPanel: React.FC = () => {
  const [active, setActive] = useState("DSA");

  /* EFFECTS */

  useEffect(() => {
    const saved = localStorage.getItem(
      "active_subject"
    );

    if (saved) {
      setActive(saved);
    }
  }, []);

  /* HANDLERS */

  const handleClick = (sub: string) => {
    setActive(sub);

    localStorage.setItem(
      "active_subject",
      sub
    );

    window.dispatchEvent(
      new Event("subjectChanged")
    );
  };

  /* UI */

  return (
    <div className="right-panel">
      <div className="subject-rail">
        {subjects.map((subject) => (
          <button
            key={subject.short}
            onClick={() =>
              handleClick(subject.short)
            }
            className={`rail-btn ${
              active === subject.short
                ? "active"
                : ""
            }`}
          >
            <span className="rail-icon">
              {subject.icon}
            </span>

            <span className="rail-label">
              {subject.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RightPanel;