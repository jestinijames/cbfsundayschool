export const ITEM_PER_PAGE = 10;

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  '/admin(.*)': ['admin'],
  '/teacher(.*)': ['teacher'],
  '/list/report': ['admin'],
  '/list/tracker': ['admin'],
  // '/list/parents': ['admin', 'teacher'],
  // '/list/subjects': ['admin'],
  // '/list/classes': ['admin', 'teacher'],
  // '/list/exams': ['admin', 'teacher', 'student', 'parent'],
  // '/list/assignments': ['admin', 'teacher', 'student', 'parent'],
  // '/list/results': ['admin', 'teacher', 'student', 'parent'],
  // '/list/attendance': ['admin', 'teacher', 'student', 'parent'],
  // '/list/events': ['admin', 'teacher', 'student', 'parent'],
  // '/list/announcements': ['admin', 'teacher', 'student', 'parent'],
};
