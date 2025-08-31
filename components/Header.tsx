
import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="flex items-center justify-between h-20 px-8 bg-base-100 border-b border-base-300">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div>
        {/* Placeholder for user profile, notifications, etc. */}
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
};
