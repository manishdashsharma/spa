'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck
} from 'lucide-react';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const StatCard = ({ title, value, change, icon: Icon, color = 'purple' }) => {
  const colorClasses = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    orange: 'from-orange-600 to-orange-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% from last week
            </p>
          )}
        </div>
        <div className={`h-12 w-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { dashboardAPI } = await import('../../lib/api');
      const response = await dashboardAPI.getOverview();

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        console.error('API returned error:', response.data.error);
        // Fallback to mock data if API fails
        setDashboardData({
          users: { total: 150, customers: 120, therapists: 25, new_today: 3, verified: 140 },
          bookings: { total: 450, active: 12, completed: 380, pending: 35, today: 8 },
          revenue: { today: 1250.50, this_week: 8900.75, this_month: 35400.25, avg_booking_value: 78.50 },
          therapists: { total: 25, available: 18, verified: 22 }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data for development
      setDashboardData({
        users: { total: 150, customers: 120, therapists: 25, new_today: 3, verified: 140 },
        bookings: { total: 450, active: 12, completed: 380, pending: 35, today: 8 },
        revenue: { today: 1250.50, this_week: 8900.75, this_month: 35400.25, avg_booking_value: 78.50 },
        therapists: { total: 25, available: 18, verified: 22 }
      });
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const bookingTrendsOptions = {
    chart: {
      type: 'area',
      height: 350,
      zoom: { enabled: false },
      toolbar: { show: false },
    },
    colors: ['#9333ea'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    grid: { borderColor: '#f1f5f9' },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: '#64748b' } },
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
  };

  const bookingTrendsData = [{
    name: 'Bookings',
    data: [30, 40, 35, 50, 49, 60, 70]
  }];

  const revenueChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    colors: ['#9333ea'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: { position: 'top' },
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${val}`,
      offsetY: -20,
      style: { fontSize: '12px', colors: ["#304758"] }
    },
    grid: { borderColor: '#f1f5f9' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#64748b' } },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}k`,
        style: { colors: '#64748b' }
      }
    },
  };

  const revenueData = [{
    name: 'Revenue',
    data: [20, 25, 30, 28, 35, 40]
  }];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={dashboardData?.users?.total || 0}
          change={12}
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Active Bookings"
          value={dashboardData?.bookings?.active || 0}
          change={8}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Revenue Today"
          value={`$${dashboardData?.revenue?.today?.toFixed(2) || '0.00'}`}
          change={15}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Available Therapists"
          value={dashboardData?.therapists?.available || 0}
          change={-3}
          icon={UserCheck}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Booking Trends</h3>
          <Chart
            options={bookingTrendsOptions}
            series={bookingTrendsData}
            type="area"
            height={350}
          />
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          <Chart
            options={revenueChartOptions}
            series={revenueData}
            type="bar"
            height={350}
          />
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Bookings</span>
              <span className="font-semibold text-gray-900">{dashboardData?.bookings?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Today</span>
              <span className="font-semibold text-gray-900">{dashboardData?.bookings?.today || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Users</span>
              <span className="font-semibold text-gray-900">{dashboardData?.users?.new_today || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Verified Therapists</span>
              <span className="font-semibold text-gray-900">{dashboardData?.therapists?.verified || 0}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New booking created', user: 'John Doe', time: '2 minutes ago', icon: Calendar },
              { action: 'User registered', user: 'Jane Smith', time: '5 minutes ago', icon: Users },
              { action: 'Booking completed', user: 'Mike Johnson', time: '12 minutes ago', icon: TrendingUp },
              { action: 'Therapist verified', user: 'Sarah Wilson', time: '1 hour ago', icon: UserCheck },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}