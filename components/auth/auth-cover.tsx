export default function AuthCover() {
  return (
    <>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          CBF SUNDAY SCHOOL
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              Welcome to CBF Sunday School Attendance Tracker! Streamline
              attendance management effortlessly with our user-friendly platform
              designed to enhance organization and ensure accurate
              record-keeping for your Sunday school.
            </p>
          </blockquote>
        </div>
      </div>
    </>
  );
}
