import React from "react";

interface ButtonProps {
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button className={`${className} button`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
