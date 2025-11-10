
import React from 'react';
import { Page } from '../types';
import { Github } from 'lucide-react';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  pages: { name: Page; icon: React.ElementType }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, pages }) => {
  return (
    <aside className="w-16 sm:w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <Github size={32} className="text-indigo-400" />
        <h1 className="hidden sm:block text-xl font-bold ml-2">TSS</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {pages.map(({ name, icon: Icon }) => (
          <a
            key={name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActivePage(name);
            }}
            className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150 ${
              activePage === name
                ? 'bg-indigo-500 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon size={24} />
            <span className="hidden sm:block ml-3">{name}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="hidden sm:block text-xs text-center text-gray-500">
            TSS ML System v1.0
            <br />
            © 2024
        </p>
      </div>
    </aside>
  );
};
