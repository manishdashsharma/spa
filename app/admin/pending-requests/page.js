'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, Filter, Check, X, Eye, Calendar, User, MapPin } from 'lucide-react';

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, [statusFilter]);

  const fetchPendingRequests = async () => {
    try {
      const { pendingRequestsAPI } = await import('../../../lib/api');
      const response = await pendingRequestsAPI.getAll({
        page: 1,
        page_size: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (response.data.success) {
        setRequests(response.data.data?.requests || []);
      } else {
        console.error('Pending requests API Error:', response.data.message);
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'accepted':
        return <Check className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const parseServices = (servicesString) => {
    try {
      const services = JSON.parse(servicesString.replace(/'/g, '"'));
      return Object.keys(services).map(service => service.charAt(0).toUpperCase() + service.slice(1)).join(', ');
    } catch (error) {
      return servicesString;
    }
  };

  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
          <p className="mt-2 text-gray-600">Manage customer booking requests and view details</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-6">
        {filteredRequests.map((request) => (
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
                <p className="text-sm text-gray-600">{parseServices(request.services)}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
            </div>

            {/* Request Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <div>{new Date(request.timeslot_from).toLocaleDateString()}</div>
                  <div className="text-xs">{new Date(request.timeslot_from).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(request.timeslot_to).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <div>Therapist ID: {request.therapist_id}</div>
                  <div className="text-xs">Customer ID: {request.customer_id}</div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <div>
                  <div>Distance: {request.distance} km</div>
                  <div className="text-xs">Lat: {request.latitude}, Lng: {request.longitude}</div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-400 mb-4">
              Requested: {request.time_ago} ago ({new Date(request.created_at).toLocaleString()})
            </div>

            {/* View Details Button */}
            <button
              onClick={() => handleViewDetails(request)}
              className="w-full bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </button>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-gray-500">
            {statusFilter === 'all'
              ? 'No booking requests available at the moment.'
              : `No ${statusFilter} requests found.`}
          </p>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Request Details</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Request ID</label>
                    <p className="text-sm text-gray-900 font-mono">{selectedRequest.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1 capitalize">{selectedRequest.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="text-sm text-gray-900">{selectedRequest.customer_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <p className="text-sm text-gray-900">{selectedRequest.customer_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Therapist ID</label>
                    <p className="text-sm text-gray-900">{selectedRequest.therapist_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Services</label>
                    <p className="text-sm text-gray-900">{parseServices(selectedRequest.services)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <p className="text-sm text-gray-900">{new Date(selectedRequest.timeslot_from).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <p className="text-sm text-gray-900">{new Date(selectedRequest.timeslot_to).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Distance</label>
                    <p className="text-sm text-gray-900">{selectedRequest.distance} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="text-sm text-gray-900">
                      {Math.round((new Date(selectedRequest.timeslot_to) - new Date(selectedRequest.timeslot_from)) / 60000)} minutes
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">
                    Latitude: {selectedRequest.latitude}, Longitude: {selectedRequest.longitude}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Ago</label>
                    <p className="text-sm text-gray-900">{selectedRequest.time_ago}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}