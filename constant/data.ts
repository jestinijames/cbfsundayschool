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
    visible: ['admin', 'teacher'],
  },
  {
    title: 'Report',
    href: '/list/report',
    icon: 'report',
    label: 'Report',
    visible: ['admin'],
  },
  {
    title: 'Teachers Management',
    href: '/list/teachers',
    icon: 'teacher',
    label: 'Teachers Management',
    visible: ['admin'],
  },
  {
    title: 'Students Management',
    href: '/list/students',
    icon: 'student',
    label: 'Students Management',
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
