'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Filter, Check, X, Eye, AlertCircle, Calendar, User } from 'lucide-react';

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const { pendingRequestsAPI } = await import('../../../lib/api');
      const response = await pendingRequestsAPI.getAll({
        page: 1,
        per_page: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (response.data.success) {
        setRequests(response.data.data?.requests || []);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      // Fallback data
      setRequests([
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          customer_name: 'Emily Johnson',
          service: 'Swedish Massage',
          requested_date: '2024-01-20',
          requested_time: '14:00',
          duration: 60,
          status: 'pending',
          created_at: '2024-01-15 10:30:00',
          therapist_preference: 'Jane Smith',
          location: '123 Oak Street',
          notes: 'Prefer afternoon appointment'
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          customer_name: 'Michael Brown',
          service: 'Deep Tissue Massage',
          requested_date: '2024-01-22',
          requested_time: '10:00',
          duration: 90,
          status: 'pending',
          created_at: '2024-01-16 14:20:00',
          therapist_preference: 'Any available',
          location: '456 Pine Avenue',
          notes: 'First time customer'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const { pendingRequestsAPI } = await import('../../../lib/api');
      await pendingRequestsAPI.action(requestId, action);

      // Update local state
      setRequests(prev => prev.map(req =>
        req.id === requestId
          ? { ...req, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'cancelled' }
          : req
      ));
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Pending Requests</h1>
          <p className="mt-2 text-gray-600">Review and manage booking requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {requests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Request Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{request.customer_name}</h3>
                <p className="text-sm text-gray-600">{request.service}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
            </div>

            {/* Request Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {request.requested_date} at {request.requested_time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                Duration: {request.duration} minutes
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                Therapist: {request.therapist_preference}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Location:</strong> {request.location}
              </div>
              {request.notes && (
                <div className="text-sm text-gray-600">
                  <strong>Notes:</strong> {request.notes}
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-400 mb-4">
              Requested: {new Date(request.created_at).toLocaleString()}
            </div>

            {/* Actions */}
            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAction(request.id, 'approve')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(request.id, 'reject')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            )}

            {request.status !== 'pending' && (
              <div className="flex justify-center">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-yellow-600">12</div>
          <div className="text-sm text-gray-600">Pending Requests</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-green-600">85</div>
          <div className="text-sm text-gray-600">Approved Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-red-600">5</div>
          <div className="text-sm text-gray-600">Rejected Today</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900">92%</div>
          <div className="text-sm text-gray-600">Approval Rate</div>
        </div>
      </div>
    </div>
  );
}