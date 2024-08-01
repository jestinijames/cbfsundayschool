/* eslint-disable @typescript-eslint/no-explicit-any */

interface WeeklyReport {
  date: string;
  lesson: string;
  teacher: string;
  classAttendance: string;
  students: { [studentName: string]: string }; // studentName -> status
}

interface Report {
  weekDates: string[];
  reportData: {
    [classId: string]: {
      className: string;
      weeklyReports: WeeklyReport[];
      studentAttendance: { [studentName: string]: string }; // studentName -> overall percentage
    };
  };
}

export interface TransformedData {
  weeks: {
    [key: string]: string; // Dynamic key for each week
  }[];
  studentAttendance: {
    [studentName: string]: {
      weeklyStatus: string[];
      overallAttendance: string;
    };
  };
}

export const transformAttendanceData = (data: Report): TransformedData => {
  const weeks: { [key: string]: string }[] = [];
  const studentAttendance: { [studentName: string]: any } = {};

  // Initialize an array for weeks with dynamic keys
  for (let i = 0; i < data.weekDates.length; i++) {
    weeks.push({
      [`week${i + 1}.date`]: '',
      [`week${i + 1}.lesson`]: '',
      [`week${i + 1}.teacher`]: '',
      [`week${i + 1}.classAttendance`]: '',
    });
  }

  Object.values(data.reportData).forEach((classData) => {
    classData.weeklyReports.forEach((report, index) => {
      const weekIndex = index + 1;

      // Populate the weeks array
      weeks[weekIndex - 1] = {
        [`week${weekIndex}.date`]: report.date,
        [`week${weekIndex}.lesson`]: report.lesson,
        [`week${weekIndex}.teacher`]: report.teacher,
        [`week${weekIndex}.classAttendance`]: report.classAttendance,
      };

      // Update student attendance
      Object.entries(report.students).forEach(([studentName, status]) => {
        if (!studentAttendance[studentName]) {
          studentAttendance[studentName] = {
            studentName,
            overallAttendance: classData.studentAttendance[studentName] || 'NA',
            weeklyStatus: new Array(data.weekDates.length).fill('NA'),
          };
        }
        studentAttendance[studentName].weeklyStatus[weekIndex - 1] = status;
      });
    });
  });

  return {
    weeks,
    studentAttendance,
  };
};
