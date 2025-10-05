import api from './axios';

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/', {})
};

// Dashboard API
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/')
};

// Users APIs
export const usersAPI = {
  getAll: (params = {}) => api.get('/users/', { params }),
  getById: (userId) => api.get(`/users/${userId}/`),
  action: (userId, action, reason = null) => api.post(`/users/${userId}/action/`, { action, reason })
};

// Bookings APIs
export const bookingsAPI = {
  getAll: (params = {}) => api.get('/bookings/', { params }),
  getById: (bookingId) => api.get(`/bookings/${bookingId}/`),
  action: (bookingId, action, reason = null) => api.post(`/bookings/${bookingId}/action/`, { action, reason })
};

// Therapists APIs
export const therapistsAPI = {
  getAll: (params = {}) => api.get('/therapists/', { params }),
  action: (therapistId, action) => api.post(`/therapists/${therapistId}/action/`, { action })
};

// Customers APIs
export const customersAPI = {
  getAll: (params = {}) => api.get('/customers/', { params })
};

// Pending Requests APIs
export const pendingRequestsAPI = {
  getAll: (params = {}) => api.get('/pending-requests/', { params }),
  action: (requestId, action) => api.post(`/pending-requests/${requestId}/action/`, { action })
};

// Conversations APIs
export const conversationsAPI = {
  getAll: (params = {}) => api.get('/conversations/', { params }),
  getMessages: (conversationId, params = {}) => api.get(`/conversations/${conversationId}/messages/`, { params })
};

// Analytics APIs
export const analyticsAPI = {
  bookings: (params = {}) => api.get('/analytics/bookings/', { params }),
  therapists: () => api.get('/analytics/therapists/'),
  advanced: (params = {}) => api.get('/analytics/advanced/', { params })
};

// Reports APIs
export const reportsAPI = {
  financial: (params = {}) => api.get('/reports/financial/', { params })
};

// Export APIs
export const exportAPI = {
  data: (params = {}) => api.get('/export/', { params })
};

// Monitoring APIs
export const monitoringAPI = {
  live: () => api.get('/monitoring/'),
  systemHealth: () => api.get('/system/health/')
};

// Notifications APIs
export const notificationsAPI = {
  getTokens: () => api.get('/notifications/tokens/'),
  send: (title, message, userType) => api.post('/notifications/send/', { title, message, user_type: userType })
};