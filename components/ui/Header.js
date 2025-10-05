'use client';

import { Menu, Search, Bell } from 'lucide-react';
import { getPageTitle } from '../../config/navigation';

export default function Header({ onMenuClick, pathname }) {
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-2 -ml-2"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="ml-2 lg:ml-0 text-2xl font-semibold text-gray-900">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 relative rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>

          {/* Mobile search button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-50 transition-colors">
            <Search className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}