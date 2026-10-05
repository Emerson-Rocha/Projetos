"use client";

import "./Button.css";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export default function Button({
  children,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      className="primary-button"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}