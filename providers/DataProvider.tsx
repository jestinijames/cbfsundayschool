'use client';

import {
  StudentAttendancePercentage,
  WeeklyClassAttendancePercentage,
} from '@/types';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ClassData } from '@/actions/googlesheets/attendance/fetch-class-by-teacher-name';
import { StudentData } from '@/actions/googlesheets/attendance/fetch-students-by-class-name';
import { AttendanceRecord } from '@/components/tables/attendance-table/columns';
import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';
import { fetchAttendanceRecords } from '@/actions/googlesheets/attendance/fetch-attendance-records';
import { readAllStudents } from '@/actions/googlesheets/students/read-students';
import { readAllClasses } from '@/actions/googlesheets/classes/read-classes';
import { toast } from '@/components/ui/use-toast';
import {
  getDashboardTotals,
  Totals,
} from '@/actions/googlesheets/dashboard/get-dashboard-totals';
import {
  readStudentsWithClass,
  StudentDetails,
} from '@/actions/googlesheets/students/read-student-details';

interface DataContextValue {
  isLoading: boolean;
  error: string;
  attendanceRecords: AttendanceRecord[];
  classes: ClassData[];
  teachers: TeacherData[];
  students: StudentData[];
  studentRecords: StudentDetails[];
  attendancePercentage: WeeklyClassAttendancePercentage[];
  studentAttendancePercentage: StudentAttendancePercentage[];
  totals: Totals;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [attendancePercentage, setAttendancePercentage] = useState<
    WeeklyClassAttendancePercentage[]
  >([]);

  const [studentAttendancePercentage, setStudentAttendancePercentage] =
    useState<StudentAttendancePercentage[]>([]);

  const [studentRecords, setStudentRecords] = useState<StudentDetails[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [totals, setTotals] = useState<Totals>({
    teachers: 0,
    students: 0,
    classes: 0,
  });

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        const response = await getDashboardTotals();
        if (response.success && response.totals) {
          setTotals(response.totals);
        } else {
          setError('Something went wrong');
        }
      } catch (error) {
        setTotals({ teachers: 0, students: 0, classes: 0 }); // Default fallback
        setError('Something went wrong');
      }
    };

    const fetchClasses = async () => {
      const response = await readAllClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        setError('Something went wrong');
      }
    };
    const fetchTeachers = async () => {
      const response = await readAllTeachers();
      if (response.success) {
        setTeachers(response.data);
      } else {
        setError('Something went wrong');
      }
    };

    const fetchStudents = async () => {
      const response = await readAllStudents();
      if (response.success) {
        setStudents(response.data);
      } else {
        setError('Something went wrong');
      }
    };

    const fetchStudentRecords = async () => {
      const response = await readStudentsWithClass(); // Fetch student details with class name
      if (response.success && response.data) {
        setStudentRecords(response.data); // Set the student records
      } else {
        setError('Something went wrong while fetching student records');
      }
    };

    const fetchRecords = async () => {
      setIsLoading(true);
      const response = await fetchAttendanceRecords();
      if (response.success && response.data) {
        setAttendanceRecords(response.data);

        const classAttendance = new Map<
          string,
          { present: number; total: number }
        >();
        response.data.forEach((record) => {
          if (!classAttendance.has(record.class)) {
            classAttendance.set(record.class, { present: 0, total: 0 });
          }
          const attendance = classAttendance.get(record.class)!;
          attendance.total++;
          if (record.status === 'Present') {
            attendance.present++;
          }
        });

        // Calculate Weekly Attendance Percentage
        const classAttendanceByDate = new Map<
          string,
          Map<string, { present: number; total: number }>
        >();

        response.data.forEach((record) => {
          if (!classAttendanceByDate.has(record.date)) {
            classAttendanceByDate.set(record.date, new Map());
          }
          const classAttendance = classAttendanceByDate.get(record.date)!;
          if (!classAttendance.has(record.class)) {
            classAttendance.set(record.class, { present: 0, total: 0 });
          }
          const attendance = classAttendance.get(record.class)!;
          attendance.total++;
          if (record.status === 'Present') {
            attendance.present++;
          }
        });

        const weeklyAttendancePercentages: WeeklyClassAttendancePercentage[] =
          [];
        classAttendanceByDate.forEach((classAttendance, date) => {
          classAttendance.forEach((attendance, className) => {
            weeklyAttendancePercentages.push({
              date,
              class: className,
              weeklyPercentage: (attendance.present / attendance.total) * 100,
            });
          });
        });

        setAttendancePercentage(weeklyAttendancePercentages);

        // Calculate Overall Student Attendance Percentage
        const studentAttendance = new Map<
          string,
          { present: number; total: number }
        >();

        response.data.forEach((record) => {
          if (!studentAttendance.has(record.student)) {
            studentAttendance.set(record.student, { present: 0, total: 0 });
          }
          const attendance = studentAttendance.get(record.student)!;
          attendance.total++;
          if (record.status === 'Present') {
            attendance.present++;
          }
        });

        const studentAttendancePercentages: StudentAttendancePercentage[] =
          Array.from(studentAttendance.entries()).map(
            ([student, attendance]) => ({
              student,
              class:
                response.data?.find((record) => record.student === student)
                  ?.class || 'Unknown',
              overallPercentage: (attendance.present / attendance.total) * 100,
            })
          );

        setStudentAttendancePercentage(studentAttendancePercentages);

        setIsLoading(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error || 'Failed to fetch attendance records',
          duration: 99999999999,
        });
      }
    };
    fetchTeacherCount();
    fetchClasses();
    fetchTeachers();
    fetchStudents();
    fetchStudentRecords();
    fetchRecords();
  }, []);

  const contextValue = useMemo(
    () => ({
      isLoading,
      error,
      attendanceRecords,
      classes,
      teachers,
      students,
      studentRecords,
      attendancePercentage,
      studentAttendancePercentage,
      totals,
    }),
    [
      isLoading,
      error,
      attendanceRecords,
      classes,
      teachers,
      students,
      studentRecords,
      attendancePercentage,
      studentAttendancePercentage,
      totals,
    ]
  );

  return (
    // Provide state and functions via context to consuming components
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
