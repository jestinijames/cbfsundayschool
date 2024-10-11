import { AttendanceRecord } from '@/actions/googlesheets/attendance/fetch-attendance-records';

export interface TransformedRecord {
  week: string;
  lessonName: string;
  teacher: string;
  date: string;
  weeklyAttendance: string;
  studentsAttendance: { [key: string]: string };
  class: string;
}

export const transformData = (
  attendanceRecords: AttendanceRecord[],
): {
  transformedData: TransformedRecord[];
  studentAttendanceMap: { [key: string]: { total: number; present: number } };
} => {
  const transformedData: TransformedRecord[] = [];
  const studentAttendanceMap: {
    [key: string]: { total: number; present: number };
  } = {};

  const uniqueDates = [
    ...new Set(attendanceRecords.map((record) => record.date)),
  ];

  uniqueDates.forEach((date, index) => {
    const recordsForDate = attendanceRecords.filter(
      (record) => record.date === date,
    );

    const classGroups = recordsForDate.reduce(
      (acc, record) => {
        if (!acc[record.class]) {
          acc[record.class] = [];
        }
        acc[record.class].push(record);
        return acc;
      },
      {} as { [key: string]: AttendanceRecord[] },
    );

    Object.keys(classGroups).forEach((className) => {
      const classRecords = classGroups[className];
      const studentsAttendance: { [key: string]: string } = {};
      classRecords.forEach((record) => {
        studentsAttendance[record.student] =
          record.status === 'Present' ? 'P' : 'A';

        if (!studentAttendanceMap[record.student]) {
          studentAttendanceMap[record.student] = { total: 0, present: 0 };
        }
        studentAttendanceMap[record.student].total += 1;
        if (record.status === 'Present') {
          studentAttendanceMap[record.student].present += 1;
        }
      });

      const weeklyAttendance = `${Math.round(
        (classRecords.filter((record) => record.status === 'Present').length /
          classRecords.length) *
          100,
      )}%`;

      transformedData.push({
        week: `Week ${index + 1}`,
        lessonName: classRecords[0].lesson,
        teacher: classRecords[0].teacher,
        date,
        weeklyAttendance,
        studentsAttendance,
        class: className,
      });
    });
  });

  return { transformedData, studentAttendanceMap };
};

export const calculateOverallAttendance = (
  student: string,
  studentAttendanceMap: { [key: string]: { total: number; present: number } },
): number => {
  const attendance = studentAttendanceMap[student];
  if (attendance) {
    return Math.round((attendance.present / attendance.total) * 100);
  }
  return 0;
};
