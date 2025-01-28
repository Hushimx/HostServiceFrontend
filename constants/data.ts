import { Permission } from '@/lib/rbac';
import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
interface CountriesCodes {
  code: string;
  dial_code: string;
  flag: string;
  startDigit: number;
  minLength?: number;
  maxLength?: number;

}
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const AdminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // No child items
  },
  {
    title: 'Admins',
    url: '/admin/admin',
    icon: 'user',
    isActive: false,
    shortcut: ['a', 'a'],
    items: [],
    permission: Permission.VIEW_ADMINS, // Optional for role-based visibility
  },
  {
    title: 'Hotels',
    url: '/admin/hotel',
    icon: 'hotel',
    isActive: false,
    shortcut: ['h', 'h'],
    items: [],
  },
  {
    title: 'Vendors',
    url: '/admin/vendor',
    icon: 'store',
    isActive: false,
    shortcut: ['v', 'v'],
    items: [],
  },
  {
    title: 'Drivers',
    url: '/admin/driver',
    icon: 'car',
    isActive: false,
    shortcut: ['d', 'r'],
    items: [],
  },
  {
    title: 'Orders',
    url: '#', // Placeholder for parent menu item
    icon: 'list',
    isActive: false,
    items: [
      {
        title: 'serviceOrders',
        url: '/admin/orders/service',
        icon: 'package',
        shortcut: ['s', 'o'],
      },
      {
        title: 'deliveryOrders',
        url: '/admin/orders/delivery',
        icon: 'truck',
        shortcut: ['d', 'o'],
      },
    ],
  },

  {
    title: 'Stores',
    url: '/admin/store',
    icon: 'shoppingCart',
    isActive: false,
    shortcut: ['s', 't'],
    items: [],
  },
  {
    title: 'Services',
    url: '/admin/service/list',
    icon: 'wrench',
    isActive: false,
    shortcut: ['s', 'v'],
    items: [],
  },
  {
    title: 'Events',
    url: '/admin/event',
    icon: '',
    isActive: false,
    shortcut: ['e', 'v'],
    items: [],
  },
  // {
  //   title: 'Account',
  //   url: '#',
  //   icon: 'settings',
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/admin/profile',
  //       icon: 'userPen',
  //       shortcut: ['p', 'r'],
  //     },

  //   ],
  // },

];

export const VendorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/vendor/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // No child items
  },

  {
    title: 'Orders',
    url: '#', // Placeholder for parent menu item
    icon: 'list',
    isActive: false,
    items: [
      {
        title: 'serviceOrders',
        url: '/vendor/orders/service',
        icon: 'package',
        shortcut: ['s', 'o'],
      },
      {
        title: 'deliveryOrders',
        url: '/vendor/orders/delivery',
        icon: 'truck',
        shortcut: ['d', 'o'],
      },
    ],
  },

  {
    title: 'Stores',
    url: '/vendor/store',
    icon: 'shoppingCart',
    isActive: false,
    shortcut: ['s', 't'],
    items: [],
  },
  {
    title: 'Services',
    url: '/vendor/service',
    icon: 'wrench',
    isActive: false,
    shortcut: ['s', 'v'],
    items: [],
  },

];


export const CountriesCodes: CountriesCodes[] = [
  {
    code: 'SA',
    dial_code: '966',
    flag: '🇸🇦',
    startDigit: 5,
    minLength: 9,
    maxLength: 9,
  
  },
  {
    code: 'EG',
    dial_code: '20',
    flag: '🇪🇬',
    startDigit: 1,
  },
];