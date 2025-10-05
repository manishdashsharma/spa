'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { User, Star, TrendingUp, Clock, Calendar, DollarSign, Award, Users } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function TherapistsAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchTherapistsAnalytics();
  }, [period]);

  const fetchTherapistsAnalytics = async () => {
    try {
      const { analyticsAPI } = await import('../../../../lib/api');
      const response = await analyticsAPI.therapists({ period });

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching therapists analytics:', error);
      // Fallback data
      setAnalyticsData({
        total_therapists: 34,
        active_therapists: 28,
        avg_rating: 4.7,
        total_sessions: 1156,
        total_revenue: 152840.00,
        top_performers: [
          {
            id: 1,
            name: 'Sarah Johnson',
            avatar: 'SJ',
            rating: 4.9,
            sessions: 142,
            revenue: 18760.00,
            specialties: ['Swedish', 'Deep Tissue'],
            availability: 95
          },
          {
            id: 2,
            name: 'Mike Thompson',
            avatar: 'MT',
            rating: 4.8,
            sessions: 138,
            revenue: 18216.00,
            specialties: ['Sports', 'Rehabilitation'],
            availability: 92
          },
          {
            id: 3,
            name: 'Emily Chen',
            avatar: 'EC',
            rating: 4.8,
            sessions: 135,
            revenue: 17820.00,
            specialties: ['Prenatal', 'Aromatherapy'],
            availability: 88
          },
          {
            id: 4,
            name: 'David Wilson',
            avatar: 'DW',
            rating: 4.7,
            sessions: 128,
            revenue: 16896.00,
            specialties: ['Hot Stone', 'Swedish'],
            availability: 90
          }
        ],
        performance_trends: [
          { month: 'Jan', sessions: 892, revenue: 117664 },
          { month: 'Feb', sessions: 934, revenue: 123288 },
          { month: 'Mar', sessions: 1015, revenue: 133980 },
          { month: 'Apr', sessions: 1089, revenue: 143736 },
          { month: 'May', sessions: 1156, revenue: 152840 }
        ],
        specialties_distribution: [
          { specialty: 'Swedish Massage', therapists: 18, percentage: 52.9 },
          { specialty: 'Deep Tissue', therapists: 15, percentage: 44.1 },
          { specialty: 'Hot Stone', therapists: 12, percentage: 35.3 },
          { specialty: 'Sports Massage', therapists: 10, percentage: 29.4 },
          { specialty: 'Aromatherapy', therapists: 8, percentage: 23.5 },
          { specialty: 'Prenatal', therapists: 6, percentage: 17.6 }
        ],
        availability_stats: {
          avg_availability: 88.5,
          fully_booked_days: 156,
          peak_hours: ['14:00-16:00', '18:00-20:00'],
          low_availability_periods: ['Friday Evening', 'Weekend Mornings']
        },
        customer_satisfaction: {
          avg_rating: 4.7,
          five_star_percentage: 68.2,
          four_star_percentage: 24.1,
          three_star_percentage: 6.3,
          two_star_percentage: 1.2,
          one_star_percentage: 0.2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const performanceOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: true }
    },
    colors: ['#9333ea', '#06b6d4'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: analyticsData?.performance_trends?.map(d => d.month) || []
    },
    yaxis: [
      {
        title: { text: 'Sessions' },
        labels: { formatter: (val) => Math.round(val) }
      },
      {
        opposite: true,
        title: { text: 'Revenue ($)' },
        labels: { formatter: (val) => `$${val}` }
      }
    ]
  };

  const performanceData = [
    {
      name: 'Sessions',
      data: analyticsData?.performance_trends?.map(d => d.sessions) || []
    },
    {
      name: 'Revenue',
      data: analyticsData?.performance_trends?.map(d => d.revenue) || [],
      yAxisIndex: 1
    }
  ];

  const ratingsOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'],
    labels: ['5 Star', '4 Star', '3 Star', '2 Star', '1 Star'],
    legend: { position: 'bottom' }
  };

  const ratingsData = analyticsData?.customer_satisfaction ? [
    analyticsData.customer_satisfaction.five_star_percentage,
    analyticsData.customer_satisfaction.four_star_percentage,
    analyticsData.customer_satisfaction.three_star_percentage,
    analyticsData.customer_satisfaction.two_star_percentage,
    analyticsData.customer_satisfaction.one_star_percentage
  ] : [];

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
          <h1 className="text-2xl font-bold text-gray-900">Therapists Analytics</h1>
          <p className="mt-2 text-gray-600">Performance insights and therapist management analytics</p>
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
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Therapists</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.total_therapists}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Therapists</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.active_therapists}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.avg_rating}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData?.total_revenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Therapists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData?.top_performers?.map((therapist, index) => (
            <motion.div
              key={therapist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-lg font-bold">{therapist.avatar}</span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{therapist.name}</h4>
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">{therapist.rating}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Sessions:</span>
                    <span className="font-medium">{therapist.sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">${therapist.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Availability:</span>
                    <span className="font-medium">{therapist.availability}%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.map((specialty, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
          <Chart
            options={performanceOptions}
            series={performanceData}
            type="line"
            height={350}
          />
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction</h3>
          <Chart
            options={ratingsOptions}
            series={ratingsData}
            type="donut"
            height={300}
          />
        </div>
      </div>

      {/* Specialties & Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialties Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Specialties Distribution</h3>
          <div className="space-y-4">
            {analyticsData?.specialties_distribution?.map((specialty, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{specialty.specialty}</span>
                    <span className="text-sm text-gray-500">{specialty.therapists} therapists</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${specialty.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Availability Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Availability</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData?.availability_stats?.avg_availability}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fully Booked Days</span>
              <span className="text-sm font-medium text-gray-900">{analyticsData?.availability_stats?.fully_booked_days}</span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Peak Hours</h4>
              <div className="flex flex-wrap gap-2">
                {analyticsData?.availability_stats?.peak_hours?.map((hour, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {hour}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Low Availability Periods</h4>
              <div className="flex flex-wrap gap-2">
                {analyticsData?.availability_stats?.low_availability_periods?.map((period, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    {period}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}