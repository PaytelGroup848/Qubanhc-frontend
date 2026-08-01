import {
  AlertTriangle,
  Building2,
  Calculator,
  Headphones,
  PackageCheck,
  Truck,
} from 'lucide-react';

export const DEFAULT_SETTINGS = {
  maintenance: {
    isEnabled: false,
    message: 'We are under maintenance. Back soon!',
  },

  support: {
    email: '',
    phone: '',
  },

  billing: {
    companyName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    email: '',
    phone: '',
    gstin: '',
    pan: '',
  },

  order: {
    freeShippingAbove: 999,
    defaultShippingCharge: 79,
    isCODEnabled: true,
    codCharge: 0,
    cancellationWindowHours: 24,
  },

  tax: {
    isGSTEnabled: true,
    defaultGSTRate: 18,
    gstNumber: '',
  },

  delivery: {
    partners: [],
  },
};

export const SETTINGS_SECTIONS = [
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: AlertTriangle,
    description: 'Website maintenance mode',
  },
  {
    id: 'support',
    label: 'Support',
    icon: Headphones,
    description: 'Customer support details',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: Building2,
    description: 'Invoice company details',
  },
  {
    id: 'order',
    label: 'Orders',
    icon: PackageCheck,
    description: 'Shipping and COD rules',
  },
  {
    id: 'tax',
    label: 'Tax / GST',
    icon: Calculator,
    description: 'GST and tax settings',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: Truck,
    description: 'Tracking partners',
  },
];