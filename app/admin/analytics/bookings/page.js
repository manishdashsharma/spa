'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { Calendar, TrendingUp, Clock, Users, Star, MapPin, Filter, Download } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BookingsAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchBookingsAnalytics();
  }, [period]);

  const fetchBookingsAnalytics = async () => {
    try {
      const { analyticsAPI } = await import('../../../../lib/api');
      const response = await analyticsAPI.bookings({ period });

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings analytics:', error);
      console.log('Analytics API endpoint may not be available yet');
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  const bookingTrendOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: true }
    },
    colors: ['#9333ea', '#06b6d4'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: analyticsData?.booking_trends?.map(d => d.date.split('-')[2]) || []
    },
    yaxis: [
      {
        title: { text: 'Bookings' },
        labels: { formatter: (val) => Math.round(val) }
      },
      {
        opposite: true,
        title: { text: 'Revenue ($)' },
        labels: { formatter: (val) => `$${val}` }
      }
    ]
  };

  const bookingTrendData = [
    {
      name: 'Bookings',
      data: analyticsData?.booking_trends?.map(d => d.bookings) || []
    },
    {
      name: 'Revenue',
      data: analyticsData?.booking_trends?.map(d => d.revenue) || [],
      yAxisIndex: 1
    }
  ];

  const timeSlotOptions = {
    chart: {
      type: 'bar',
      height: 350
    },
    colors: ['#9333ea'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    xaxis: {
      categories: analyticsData?.popular_time_slots?.map(t => t.hour) || []
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}`
      }
    }
  };

  const timeSlotData = [{
    name: 'Bookings',
    data: analyticsData?.popular_time_slots?.map(t => t.bookings) || []
  }];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Analytics</h1>
          <p className="mt-2 text-gray-600">Detailed analysis of booking patterns and trends</p>
        </div>
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-gray-400 mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Data Not Available</h3>
            <p className="text-gray-500">The analytics API endpoint is not accessible at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Analytics</h1>
          <p className="mt-2 text-gray-600">Detailed analysis of booking patterns and trends</p>
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
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.total_bookings?.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.booking_completion_rate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Booking Value</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData?.avg_booking_value}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.cancelled_bookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          <Chart
            options={bookingTrendOptions}
            series={bookingTrendData}
            type="area"
            height={350}
          />
        </div>

        {/* Popular Time Slots */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Time Slots</h3>
          <Chart
            options={timeSlotOptions}
            series={timeSlotData}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Service Popularity & Location Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Service Popularity</h3>
          <div className="space-y-4">
            {analyticsData?.service_popularity?.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{service.service}</span>
                    <span className="text-sm text-gray-500">{service.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographical Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographical Distribution</h3>
          <div className="space-y-4">
            {analyticsData?.geographical_distribution?.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{location.location}</span>
                      <span className="text-sm text-gray-500">{location.bookings} bookings</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData?.customer_segments?.map((segment, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-medium text-gray-900 mb-2">{segment.segment}</h4>
                <p className="text-2xl font-bold text-purple-600 mb-1">{segment.bookings}</p>
                <p className="text-sm text-gray-500">{segment.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}