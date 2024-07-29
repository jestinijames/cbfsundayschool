import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
  },
  {
    title: 'Tracker',
    href: '/dashboard/tracker',
    icon: 'tracker',
    label: 'Tracker',
  },
];

export const statuses = [
  {
    value: 'Present',
    label: 'Present',
    icon: CircleCheckIcon,
  },
  {
    value: 'Absent',
    label: 'Absent',
    icon: CircleXIcon,
  },
];
