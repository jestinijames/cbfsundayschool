/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client';
import { useEffect, useState } from 'react';

import { DataTableSkeleton } from '@/components/tables/attendance-table/data-table-skeleton';
import { overallreportcolumns } from '@/components/tables/attendance-table/overall-reports-table/overall-report-columns';
import { OverallReportDataTable } from '@/components/tables/attendance-table/overall-reports-table/overall-report-data-table';
import { WeeklyReportDataTable } from '@/components/tables/weekly-reports-table/weekly-report-data-table';
import { weeklyreportcolumns } from '@/components/tables/weekly-reports-table/weely-report-columns';
// import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';

import { fetchAttendanceRecords } from '@/actions/googlesheets/attendance/fetch-attendance-records';
import { ClassData } from '@/actions/googlesheets/attendance/fetch-class-by-teacher-name';
import { StudentData } from '@/actions/googlesheets/attendance/fetch-students-by-class-name';
import { readAllClasses } from '@/actions/googlesheets/classes/read-classes';
import { readAllStudents } from '@/actions/googlesheets/students/read-students';
import {
  readAllTeachers,
  TeacherData,
} from '@/actions/googlesheets/teachers/read-teachers';

import { type AttendanceRecord, columns } from './columns';
import { DataTable } from './data-table';

interface WeeklyClassAttendancePercentage {
  date: string;
  class: string;
  weeklyPercentage: number;
}

interface StudentAttendancePercentage {
  student: string;
  class: string;
  overallPercentage: number;
}

export const AttendanceClient = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [attendancePercentage, setAttendancePercentage] = useState<
    WeeklyClassAttendancePercentage[]
  >([]);

  const [studentAttendancePercentage, setStudentAttendancePercentage] =
    useState<StudentAttendancePercentage[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await readAllClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };
    const fetchTeachers = async () => {
      const response = await readAllTeachers();
      if (response.success) {
        setTeachers(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
      }
    };

    const fetchStudents = async () => {
      const response = await readAllStudents();
      if (response.success) {
        setStudents(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: response.error,
        });
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
            }),
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
    fetchClasses();
    fetchTeachers();
    fetchStudents();
    fetchRecords();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className='flex items-start justify-between'>
          <Heading
            title='CBF Sunday School Attendance Tracker'
            description='View Student Attendance'
          />
        </div>
        <Separator />
        <DataTableSkeleton
          columnCount={6}
          filterableColumnCount={6}
          cellWidths={['12rem', '12rem', '12rem', '12rem', '12rem', '12rem']}
          shrinkZero
        />

        <div className='flex items-start justify-between mt-5'>
          <Heading
            title='Weekly Attendance'
            description='Weekly attendance percentage per class'
          />
        </div>
        <Separator />
        <DataTableSkeleton
          columnCount={3}
          filterableColumnCount={2}
          cellWidths={['6rem', '6rem', '6rem']}
          shrinkZero
        />

        <div className='flex items-start justify-between mt-5'>
          <Heading
            title='Overall Student Attendance'
            description='Overall student attendance percentage per class'
          />
        </div>
        <Separator />
        <DataTableSkeleton
          columnCount={3}
          filterableColumnCount={2}
          cellWidths={['6rem', '6rem', '6rem']}
          shrinkZero
        />
      </>
    );
  }

  return (
    <>
      <div className='flex items-start justify-between'>
        <Heading
          title='CBF Sunday School Attendance Tracker'
          description='View Student Attendance'
        />
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={attendanceRecords}
        classes={classes}
        teachers={teachers}
        students={students}
      />

      <div className='flex items-start justify-between mt-5'>
        <Heading
          title='Weekly Attendance'
          description='Weekly attendance percentage per class'
        />
      </div>
      <Separator />
      <WeeklyReportDataTable
        columns={weeklyreportcolumns}
        data={attendancePercentage}
        classes={classes}
      />

      <div className='flex items-start justify-between mt-5'>
        <Heading
          title='Overall Student Attendance'
          description='Overall student attendance percentage per class'
        />
      </div>
      <Separator />
      <OverallReportDataTable
        columns={overallreportcolumns}
        data={studentAttendancePercentage}
        classes={classes}
        students={students}
      />
    </>
  );
};
