import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  MessageSquare,
  BarChart3,
  FileText,
  Monitor,
  Settings,
  Bell,
  Activity,
  Clock
} from 'lucide-react';

export const navigationConfig = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and key metrics'
  },
  {
    id: 'users',
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage all users',
    badge: 'new'
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/admin/bookings',
    icon: Calendar,
    description: 'Booking management'
  },
  {
    id: 'therapists',
    label: 'Therapists',
    href: '/admin/therapists',
    icon: UserCog,
    description: 'Therapist management'
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    id: 'pending-requests',
    label: 'Pending Requests',
    href: '/admin/pending-requests',
    icon: Clock,
    description: 'Pending booking requests'
  },
  {
    id: 'conversations',
    label: 'Conversations',
    href: '/admin/conversations',
    icon: MessageSquare,
    description: 'Chat management'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
    description: 'Advanced analytics',
    submenu: [
      {
        id: 'booking-analytics',
        label: 'Booking Analytics',
        href: '/admin/analytics/bookings',
        description: 'Booking trends and insights'
      },
      {
        id: 'therapist-analytics',
        label: 'Therapist Analytics',
        href: '/admin/analytics/therapists',
        description: 'Therapist performance'
      },
      {
        id: 'advanced-analytics',
        label: 'Advanced Analytics',
        href: '/admin/analytics/advanced',
        description: 'Geographic and service analytics'
      }
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/admin/reports',
    icon: FileText,
    description: 'Financial and system reports',
    submenu: [
      {
        id: 'financial-reports',
        label: 'Financial Reports',
        href: '/admin/reports/financial',
        description: 'Revenue and financial analytics'
      },
      {
        id: 'export-data',
        label: 'Export Data',
        href: '/admin/reports/export',
        description: 'Export various data types'
      }
    ]
  },
  // {
  //   id: 'monitoring',
  //   label: 'Live Monitoring',
  //   href: '/admin/monitoring',
  //   icon: Monitor,
  //   description: 'Real-time system monitoring'
  // },
  // {
  //   id: 'notifications',
  //   label: 'Notifications',
  //   href: '/admin/notifications',
  //   icon: Bell,
  //   description: 'Manage notifications'
  // },
  {
    id: 'system',
    label: 'System',
    href: '/admin/system',
    icon: Activity,
    description: 'System health and settings'
  },
  // {
  //   id: 'settings',
  //   label: 'Settings',
  //   href: '/admin/settings',
  //   icon: Settings,
  //   description: 'Application settings'
  // }
];

// Helper function to get navigation item by ID
export const getNavigationItem = (id) => {
  return navigationConfig.find(item => item.id === id);
};

// Helper function to get current page title
export const getPageTitle = (pathname) => {
  for (const item of navigationConfig) {
    if (item.href === pathname) {
      return item.label;
    }
    if (item.submenu) {
      const subItem = item.submenu.find(sub => sub.href === pathname);
      if (subItem) {
        return subItem.label;
      }
    }
  }
  return 'Dashboard';
};