import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Mark Attendance',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Mark Attendance',
  },
  {
    title: 'Tracker',
    href: '/dashboard/tracker',
    icon: 'tracker',
    label: 'Tracker',
  },
  {
    title: 'Report',
    href: '/dashboard/attendance-report',
    icon: 'report',
    label: 'Report',
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
