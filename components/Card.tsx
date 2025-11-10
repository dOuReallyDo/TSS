
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}>
      {title && <h2 className={`text-xl font-bold text-indigo-400 mb-4 ${titleClassName}`}>{title}</h2>}
      {children}
    </div>
  );
};
