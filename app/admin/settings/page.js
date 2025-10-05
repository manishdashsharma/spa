'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Database,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Download
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { settingsAPI } = await import('../../../lib/api');
      const response = await settingsAPI.get();

      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback data
      setSettings({
        general: {
          business_name: 'RoomSpa',
          business_email: 'admin@roomspa.com',
          business_phone: '+1 (555) 123-4567',
          business_address: '123 Wellness Street, City, State 12345',
          timezone: 'America/New_York',
          currency: 'USD',
          language: 'en'
        },
        notifications: {
          email_notifications: true,
          sms_notifications: true,
          push_notifications: true,
          booking_alerts: true,
          payment_alerts: true,
          system_alerts: true,
          marketing_emails: false
        },
        security: {
          two_factor_auth: false,
          session_timeout: 30,
          password_expiry: 90,
          login_attempts: 5,
          api_access: true
        },
        payments: {
          stripe_publishable_key: 'pk_test_...',
          stripe_secret_key: 'sk_test_...',
          processing_fee: 2.9,
          auto_capture: true,
          refund_policy: 24
        },
        appearance: {
          primary_color: '#9E39BF',
          secondary_color: '#06b6d4',
          logo_url: '/logo.png',
          favicon_url: '/favicon.ico',
          theme: 'light'
        },
        integrations: {
          google_calendar: false,
          mailchimp_api_key: '',
          twilio_sid: '',
          twilio_token: '',
          google_analytics: ''
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { settingsAPI } = await import('../../../lib/api');
      await settingsAPI.update(settings);
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Globe }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your application settings and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors mt-4 sm:mt-0"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={settings.general?.business_name || ''}
                      onChange={(e) => updateSetting('general', 'business_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                    <input
                      type="email"
                      value={settings.general?.business_email || ''}
                      onChange={(e) => updateSetting('general', 'business_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                    <input
                      type="tel"
                      value={settings.general?.business_phone || ''}
                      onChange={(e) => updateSetting('general', 'business_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.general?.timezone || ''}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                    <textarea
                      value={settings.general?.business_address || ''}
                      onChange={(e) => updateSetting('general', 'business_address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'sms_notifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                    { key: 'push_notifications', label: 'Push Notifications', description: 'Receive push notifications' },
                    { key: 'booking_alerts', label: 'Booking Alerts', description: 'Get notified about new bookings' },
                    { key: 'payment_alerts', label: 'Payment Alerts', description: 'Get notified about payments' },
                    { key: 'system_alerts', label: 'System Alerts', description: 'Receive system status alerts' },
                    { key: 'marketing_emails', label: 'Marketing Emails', description: 'Receive marketing communications' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications?.[setting.key] || false}
                          onChange={(e) => updateSetting('notifications', setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security?.two_factor_auth || false}
                        onChange={(e) => updateSetting('security', 'two_factor_auth', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.security?.session_timeout || ''}
                        onChange={(e) => updateSetting('security', 'session_timeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.security?.login_attempts || ''}
                        onChange={(e) => updateSetting('security', 'login_attempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Publishable Key</label>
                    <input
                      type="text"
                      value={settings.payments?.stripe_publishable_key || ''}
                      onChange={(e) => updateSetting('payments', 'stripe_publishable_key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.payments?.stripe_secret_key || ''}
                        onChange={(e) => updateSetting('payments', 'stripe_secret_key', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.payments?.processing_fee || ''}
                        onChange={(e) => updateSetting('payments', 'processing_fee', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Refund Policy (hours)</label>
                      <input
                        type="number"
                        value={settings.payments?.refund_policy || ''}
                        onChange={(e) => updateSetting('payments', 'refund_policy', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance?.primary_color || '#9E39BF'}
                          onChange={(e) => updateSetting('appearance', 'primary_color', e.target.value)}
                          className="h-10 w-20 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.appearance?.primary_color || '#9E39BF'}
                          onChange={(e) => updateSetting('appearance', 'primary_color', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.appearance?.secondary_color || '#06b6d4'}
                          onChange={(e) => updateSetting('appearance', 'secondary_color', e.target.value)}
                          className="h-10 w-20 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.appearance?.secondary_color || '#06b6d4'}
                          onChange={(e) => updateSetting('appearance', 'secondary_color', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload</label>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          Upload Logo
                        </button>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Google Calendar</h4>
                      <p className="text-sm text-gray-500">Sync bookings with Google Calendar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations?.google_calendar || false}
                        onChange={(e) => updateSetting('integrations', 'google_calendar', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mailchimp API Key</label>
                    <input
                      type="password"
                      value={settings.integrations?.mailchimp_api_key || ''}
                      onChange={(e) => updateSetting('integrations', 'mailchimp_api_key', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                    <input
                      type="text"
                      value={settings.integrations?.google_analytics || ''}
                      onChange={(e) => updateSetting('integrations', 'google_analytics', e.target.value)}
                      placeholder="GA-XXXXXXXXXX"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}