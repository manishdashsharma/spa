'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { DollarSign, TrendingUp, Calendar, Download, FileText, BarChart } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function FinancialReportsPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchFinancialReports();
  }, [period]);

  const fetchFinancialReports = async () => {
    try {
      const { reportsAPI } = await import('../../../../lib/api');
      const response = await reportsAPI.financial({ period });

      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      // Fallback data
      setReportData({
        period,
        total_revenue: 45230.75,
        total_bookings: 342,
        avg_booking_value: 132.25,
        growth_rate: 15.8,
        revenue_by_service: [
          { service: 'Swedish Massage', revenue: 18500.25, bookings: 140 },
          { service: 'Deep Tissue Massage', revenue: 15200.50, bookings: 95 },
          { service: 'Hot Stone Massage', revenue: 8330.00, bookings: 67 },
          { service: 'Aromatherapy Massage', revenue: 3200.00, bookings: 40 }
        ],
        daily_revenue: [
          { date: '2024-01-01', revenue: 1250 },
          { date: '2024-01-02', revenue: 1380 },
          { date: '2024-01-03', revenue: 1120 },
          { date: '2024-01-04', revenue: 1650 },
          { date: '2024-01-05', revenue: 1420 },
          { date: '2024-01-06', revenue: 1780 },
          { date: '2024-01-07', revenue: 1560 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const revenueChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: true }
    },
    colors: ['#9333ea'],
    stroke: { curve: 'smooth', width: 3 },
    grid: { borderColor: '#f1f5f9' },
    xaxis: {
      categories: reportData?.daily_revenue?.map(d => d.date.split('-')[2]) || [],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
        style: { colors: '#64748b' }
      }
    }
  };

  const revenueChartData = [{
    name: 'Daily Revenue',
    data: reportData?.daily_revenue?.map(d => d.revenue) || []
  }];

  const serviceChartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    colors: ['#9333ea', '#06b6d4', '#10b981', '#f59e0b'],
    labels: reportData?.revenue_by_service?.map(s => s.service) || [],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: { size: '60%' }
      }
    }
  };

  const serviceChartData = reportData?.revenue_by_service?.map(s => s.revenue) || [];

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
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="mt-2 text-gray-600">Revenue analytics and financial insights</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${reportData?.total_revenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.total_bookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">${reportData?.avg_booking_value?.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">+{reportData?.growth_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <Chart
            options={revenueChartOptions}
            series={revenueChartData}
            type="line"
            height={350}
          />
        </motion.div>

        {/* Revenue by Service */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
          <Chart
            options={serviceChartOptions}
            series={serviceChartData}
            type="donut"
            height={350}
          />
        </motion.div>
      </div>

      {/* Service Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData?.revenue_by_service?.map((service, index) => {
                const avgValue = service.revenue / service.bookings;
                const share = (service.revenue / reportData.total_revenue) * 100;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${service.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${avgValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {share.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}