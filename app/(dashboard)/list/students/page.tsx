import { Breadcrumbs } from '@/components/common/breadcrumbs';
import StudentForm from '@/components/forms/student-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/' },
  { title: 'Students Management', link: '/list/students' },
];

const StudentsPage = () => {
  return (
    <>
      <ScrollArea className='h-full'>
        <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
          <Breadcrumbs items={breadcrumbItems} />

          <Tabs defaultValue='manage' className='space-y-4'>
            <TabsList>
              <TabsTrigger value='manage'>Manage Students</TabsTrigger>
              <TabsTrigger value='add'>Add Student</TabsTrigger>
            </TabsList>
            <TabsContent value='manage' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1  lg:grid-cols-4'>
                <div className='flex-1 space-y-4  p-4 pt-6 md:p-8 overflow-y-scroll'>
                  COMING SOON!
                </div>
              </div>
            </TabsContent>
            <TabsContent value='add' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1  lg:grid-cols-4'>
                <div className='flex-1 space-y-4  p-4 pt-6 md:p-8 overflow-y-scroll'>
                  <StudentForm />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* <div className='flex-1 space-y-4 p-5'>
        <Breadcrumbs items={breadcrumbItems} />

        <div className='flex-1 space-y-4 p-5'>
          <StudentForm />
        </div>
      </div> */}
    </>
  );
};

export default StudentsPage;
