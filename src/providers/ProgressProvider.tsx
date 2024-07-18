'use client';

import NextTopLoader from 'nextjs-toploader';
import React from 'react';

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <NextTopLoader />
    </>
  );
};

export default ProgressProvider;
