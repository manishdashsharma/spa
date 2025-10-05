'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, UserCheck, Star, MapPin, Phone, Mail } from 'lucide-react';

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const { therapistsAPI } = await import('../../../lib/api');
      const response = await therapistsAPI.getAll();

      if (response.data.success) {
        setTherapists(response.data.data?.therapists || []);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
      setTherapists([
        {
          id: 1,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          verified: true,
          available: true,
          rating: 4.8,
          bookings: 25,
          specialties: ['Swedish Massage', 'Deep Tissue']
        }
      ]);
    } finally {
      setLoading(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Therapists</h1>
          <p className="mt-2 text-gray-600">Manage therapist profiles and approvals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <motion.div
            key={therapist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {therapist.name?.charAt(0) || 'T'}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{therapist.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{therapist.rating || 4.5}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                therapist.verified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {therapist.verified ? 'Verified' : 'Pending'}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {therapist.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {therapist.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <UserCheck className="h-4 w-4 mr-2" />
                {therapist.bookings || 0} bookings completed
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {therapist.specialties?.map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                >
                  {specialty}
                </span>
              )) || (
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  General Massage
                </span>
              )}
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                View Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Actions
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}