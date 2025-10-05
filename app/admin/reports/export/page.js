'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Calendar, FileText, Users, DollarSign, Filter } from 'lucide-react';

export default function ExportPage() {
  const [exportType, setExportType] = useState('bookings');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { exportAPI } = await import('../../../../lib/api');
      const params = {
        type: exportType,
        date_from: dateRange.from,
        date_to: dateRange.to
      };

      const response = await exportAPI.data(params);
      // Handle file download here
      console.log('Export completed:', response);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { id: 'bookings', label: 'Bookings Data', icon: Calendar, description: 'Export booking records with customer and therapist details' },
    { id: 'users', label: 'Users Data', icon: Users, description: 'Export user profiles and account information' },
    { id: 'revenue', label: 'Revenue Data', icon: DollarSign, description: 'Export financial data and payment records' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Export</h1>
        <p className="mt-2 text-gray-600">Export data for external analysis and reporting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Options */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Data Type</h3>
            <div className="space-y-4">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportType === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setExportType(option.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 ${exportType === option.id ? 'text-purple-600' : 'text-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{option.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Data Type:</span>
                <span className="text-sm font-medium text-gray-900">
                  {exportOptions.find(opt => opt.id === exportType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Format:</span>
                <span className="text-sm font-medium text-gray-900">CSV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Size:</span>
                <span className="text-sm font-medium text-gray-900">~2.5 MB</span>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full mt-6 bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Export Data
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Export Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Data is exported in CSV format</li>
              <li>• Sensitive information is excluded</li>
              <li>• Large exports may take a few minutes</li>
              <li>• Files are available for 24 hours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}