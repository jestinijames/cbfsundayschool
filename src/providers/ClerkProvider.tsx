'use client';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface clerkContextProps {
  role: string;
  setRole: React.Dispatch<React.SetStateAction<string>>;
}

interface clerkProviderProps {
  children: ReactNode;
  currentRole: string;
}

const ClerkContext = createContext<clerkContextProps | undefined>(undefined);

export const ClerkProvider = ({
  children,
  currentRole,
}: clerkProviderProps) => {
  const memoizedRole = useMemo(() => currentRole, [currentRole]);
  const [role, setRole] = useState(memoizedRole);

  return (
    <ClerkContext.Provider value={{ role, setRole }}>
      {children}
    </ClerkContext.Provider>
  );
};

export const useClerkContext = () => {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error('useClerkContext must be used within a ClerkProvider');
  }
  return context;
};
