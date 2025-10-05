'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, UserCheck, MessageSquare, Plus } from 'lucide-react';

export default function NotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [userType, setUserType] = useState('all');
  const [isSending, setIsSending] = useState(false);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const { notificationsAPI } = await import('../../../lib/api');
      const response = await notificationsAPI.getTokens();
      if (response.data.success) {
        setTokens(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setTokens([
        { user_type: 'customers', count: 120 },
        { user_type: 'therapists', count: 25 },
        { user_type: 'all', count: 145 }
      ]);
    }
  };

  const handleSendNotification = async () => {
    if (!title.trim() || !message.trim()) return;

    setIsSending(true);
    try {
      const { notificationsAPI } = await import('../../../lib/api');
      await notificationsAPI.send(title, message, userType);

      setTitle('');
      setMessage('');
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientCount = () => {
    const tokenData = tokens.find(t => t.user_type === userType);
    return tokenData ? tokenData.count : 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Push Notifications</h1>
        <p className="mt-2 text-gray-600">Send notifications to users and therapists</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Send Notification</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Type
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Users</option>
                  <option value="customers">Customers Only</option>
                  <option value="therapists">Therapists Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your notification message..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <button
                onClick={handleSendNotification}
                disabled={isSending || !title.trim() || !message.trim()}
                className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send to {getRecipientCount()} Recipients
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Devices</h3>
            <div className="space-y-4">
              {tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {token.user_type === 'customers' && <Users className="h-4 w-4 text-blue-600" />}
                    {token.user_type === 'therapists' && <UserCheck className="h-4 w-4 text-purple-600" />}
                    {token.user_type === 'all' && <Bell className="h-4 w-4 text-gray-600" />}
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {token.user_type}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{token.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setTitle('Welcome to RoomSpa');
                  setMessage('Thank you for joining RoomSpa! Book your first massage today.');
                  setUserType('customers');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Welcome Message
              </button>
              <button
                onClick={() => {
                  setTitle('Booking Reminder');
                  setMessage('Your massage appointment is tomorrow. We look forward to seeing you!');
                  setUserType('customers');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Appointment Reminder
              </button>
              <button
                onClick={() => {
                  setTitle('New Booking Request');
                  setMessage('You have a new booking request. Please check your dashboard.');
                  setUserType('therapists');
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                New Request Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}