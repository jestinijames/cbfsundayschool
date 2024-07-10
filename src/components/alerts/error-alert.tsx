import React from 'react';

const ErrorAlert = ({ error }: { error: string }) => {
  return (
    <div
      className='flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800'
      role='alert'
    >
      <svg
        className='flex-shrink-0 inline w-8 h-8 me-3'
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z' />
        <path d='m14.5 9.5-5 5' />
        <path d='m9.5 9.5 5 5' />
      </svg>
      <span className='sr-only'>Error</span>
      <div>
        <span className='font-medium'>Error!</span> {error}
      </div>
    </div>
  );
};

export default ErrorAlert;
