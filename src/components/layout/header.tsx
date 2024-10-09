import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import HomeLogo from '@/components/common/home-logo';
import ThemeToggle from '@/components/layout/theme-toggle';

import { MobileSidebar } from './mobile-sidebar';

export default async function Header() {
  const user = await currentUser();
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-14 items-center justify-between px-4'>
        <div className='hidden lg:block'>
          <Link href='/' target='_blank'>
            <HomeLogo />
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className='flex items-center gap-2'>
          <div className='flex flex-col'>
            <span className='text-xs leading-3 font-medium'>
              {user?.username}
            </span>
            <span className='text-[10px] text-gray-500 text-right'>
              {user?.publicMetadata?.role as string}
            </span>
          </div>
          <UserButton />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
