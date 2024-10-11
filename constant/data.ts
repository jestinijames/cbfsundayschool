import { CircleCheckIcon, CircleXIcon } from 'lucide-react';

import { NavItem } from '@/types';

export const navItems: NavItem[] = [
  {
    title: 'Mark Attendance',
    href: '/',
    icon: 'dashboard',
    label: 'Mark Attendance',
    visible: ['admin', 'teacher'],
  },
  {
    title: 'Tracker',
    href: '/list/tracker',
    icon: 'tracker',
    label: 'Tracker',
    visible: ['admin'],
  },
  {
    title: 'Report',
    href: '/list/report',
    icon: 'report',
    label: 'Report',
    visible: ['admin'],
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
