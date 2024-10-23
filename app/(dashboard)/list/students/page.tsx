import { Breadcrumbs } from '@/components/common/breadcrumbs';
import StudentForm from '@/components/forms/student-form';
import ManageStudents from '@/components/students/manage-students';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataProvider } from '@/providers/DataProvider';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Students Management', link: '/list/students' },
];

const StudentsPage = () => {
  return (
    <>
      <DataProvider>
        <ScrollArea className='h-full'>
          <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
            <Breadcrumbs items={breadcrumbItems} />

            <Tabs defaultValue='manage' className='space-y-4'>
              <TabsList>
                <TabsTrigger value='manage'>Manage Students</TabsTrigger>
                <TabsTrigger value='add'>Add Student</TabsTrigger>
              </TabsList>
              <TabsContent value='manage' className='space-y-4'>
                <ManageStudents />
              </TabsContent>
              <TabsContent value='add' className='space-y-4'>
                <StudentForm />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DataProvider>
    </>
  );
};

export default StudentsPage;
