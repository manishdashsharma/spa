'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Clock,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Zap
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AdvancedAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    fetchAdvancedAnalytics();
  }, [selectedMetric, dateRange]);

  const fetchAdvancedAnalytics = async () => {
    try {
      const { analyticsAPI } = await import('../../../../lib/api');
      const response = await analyticsAPI.advanced({
        metric: selectedMetric,
        period: dateRange
      });

      if (response.data.success) {
        setAnalyticsData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching advanced analytics:', error);
      console.log('Advanced Analytics API endpoint may not be available yet');
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const cohortOptions = {
    chart: {
      type: 'heatmap',
      height: 350
    },
    colors: ['#9333ea'],
    xaxis: {
      categories: ['Month 1', 'Month 3', 'Month 6']
    },
    yaxis: {
      categories: analyticsData?.cohort_analysis?.map(c => c.month) || []
    }
  };

  const weeklyPatternOptions = {
    chart: {
      type: 'line',
      height: 350
    },
    colors: ['#9333ea', '#06b6d4'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: analyticsData?.seasonal_patterns?.weekly_patterns?.map(w => w.day.slice(0, 3)) || []
    },
    yaxis: [
      {
        title: { text: 'Bookings' }
      },
      {
        opposite: true,
        title: { text: 'Avg Value ($)' }
      }
    ]
  };

  const weeklyPatternData = [
    {
      name: 'Bookings',
      data: analyticsData?.seasonal_patterns?.weekly_patterns?.map(w => w.bookings) || []
    },
    {
      name: 'Avg Value',
      data: analyticsData?.seasonal_patterns?.weekly_patterns?.map(w => w.avg_value) || [],
      yAxisIndex: 1
    }
  ];

  const geoOptions = {
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
      categories: analyticsData?.geographic_heatmap?.map(g => g.region) || []
    }
  };

  const geoData = [{
    name: 'Revenue',
    data: analyticsData?.geographic_heatmap?.map(g => g.revenue) || []
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
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights and predictive analytics for strategic decisions</p>
        </div>
        <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center">
            <div className="text-gray-400 mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Data Not Available</h3>
            <p className="text-gray-500">The advanced analytics API endpoint is not accessible at the moment.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="mt-2 text-gray-600">Deep insights and predictive analytics for strategic decisions</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="revenue">Revenue Analysis</option>
            <option value="customer">Customer Analysis</option>
            <option value="operational">Operational Analysis</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Customer LTV</p>
              <p className="text-2xl font-bold text-purple-900">${analyticsData?.kpis?.customer_lifetime_value}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">CAC</p>
              <p className="text-2xl font-bold text-blue-900">${analyticsData?.kpis?.customer_acquisition_cost}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-900">{analyticsData?.kpis?.booking_conversion_rate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Churn Rate</p>
              <p className="text-2xl font-bold text-orange-900">{analyticsData?.kpis?.churn_rate}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-pink-700">Revenue/Customer</p>
              <p className="text-2xl font-bold text-pink-900">${analyticsData?.kpis?.revenue_per_customer}</p>
            </div>
            <Zap className="h-8 w-8 text-pink-600" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700">Repeat Rate</p>
              <p className="text-2xl font-bold text-indigo-900">{analyticsData?.kpis?.repeat_customer_rate}%</p>
            </div>
            <RefreshCw className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Patterns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Booking Patterns</h3>
          <Chart
            options={weeklyPatternOptions}
            series={weeklyPatternData}
            type="line"
            height={350}
          />
        </div>

        {/* Geographic Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Region</h3>
          <Chart
            options={geoOptions}
            series={geoData}
            type="bar"
            height={350}
          />
        </div>
      </div>

      {/* Customer Segments & Predictive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced Customer Segments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segments</h3>
          <div className="space-y-6">
            {analyticsData?.advanced_segments?.map((segment, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-gray-900">{segment.name}</h4>
                  <span className="text-sm text-gray-500">{segment.size} customers</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Avg Value:</span>
                  <span className="font-medium text-purple-600">${segment.avg_value}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Retention:</span>
                  <span className="font-medium text-green-600">{segment.retention_rate}%</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {segment.characteristics.map((char, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Predictive Insights</h3>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Revenue Forecast</h4>
              <p className="text-2xl font-bold text-purple-600">${analyticsData?.predictive_insights?.next_month_revenue_forecast?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Projected for next month</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Customer Growth</h4>
              <p className="text-2xl font-bold text-green-600">+{analyticsData?.predictive_insights?.customer_growth_projection}%</p>
              <p className="text-sm text-gray-600">Expected growth rate</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Service Demand Forecast</h4>
              <div className="space-y-2">
                {analyticsData?.predictive_insights?.demand_forecast?.map((forecast, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{forecast.service}</span>
                    <span className="text-sm font-medium text-green-600">{forecast.projected_demand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Correlation Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Rating vs Bookings</h4>
            <div className="text-3xl font-bold text-purple-600 mb-1">{analyticsData?.correlation_matrix?.rating_vs_bookings}</div>
            <p className="text-xs text-gray-500">Strong positive correlation</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Price vs Demand</h4>
            <div className="text-3xl font-bold text-red-600 mb-1">{analyticsData?.correlation_matrix?.price_vs_demand}</div>
            <p className="text-xs text-gray-500">Moderate negative correlation</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Weather vs Bookings</h4>
            <div className="text-3xl font-bold text-blue-600 mb-1">{analyticsData?.correlation_matrix?.weather_vs_bookings}</div>
            <p className="text-xs text-gray-500">Weak positive correlation</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Marketing vs Acquisition</h4>
            <div className="text-3xl font-bold text-green-600 mb-1">{analyticsData?.correlation_matrix?.marketing_spend_vs_acquisition}</div>
            <p className="text-xs text-gray-500">Moderate positive correlation</p>
          </div>
        </div>
      </div>
    </div>
  );
}