'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { navigationConfig } from '../../config/navigation';

export default function Sidebar({ isOpen, onClose, user }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
      >
        <SidebarContent user={user} onClose={onClose} pathname={pathname} router={router} />
      </motion.div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-gray-200">
          <SidebarContent user={user} onClose={onClose} pathname={pathname} router={router} />
        </div>
      </div>
    </>
  );
}

function SidebarContent({ user, onClose, pathname, router }) {
  const [expandedItems, setExpandedItems] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900">RoomSpa</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 px-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigationConfig.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedItems[item.id];

            return (
              <li key={item.id}>
                <div className="space-y-1">
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-500'}`} />
                      {item.label}
                      {item.badge && (
                        <span className="ml-auto px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Submenu */}
                  <AnimatePresence>
                    {hasSubmenu && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-6 space-y-1"
                      >
                        {item.submenu.map((subItem) => {
                          const subActive = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              onClick={onClose}
                              className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                subActive
                                  ? 'bg-purple-100 text-purple-800 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <span className="w-2 h-2 bg-current rounded-full mr-3 opacity-50"></span>
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}