import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'hero' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onClick,
  type = 'button',
  disabled = false,
  className = ''
}) => {
  const baseClass = 'primary-button';
  const variantClass = variant !== 'primary' ? `${baseClass} ${variant}` : baseClass;
  
  return (
    <button 
      className={`${variantClass} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;