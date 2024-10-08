import Link from 'next/link';

import { cn } from '@/lib/utils';

import HomeLogo from '@/components/common/home-logo';
import ThemeToggle from '@/components/layout/theme-toggle';
import { UserNav } from '@/components/layout/user-nav';

import { MobileSidebar } from './mobile-sidebar';

export default function Header() {
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-14 items-center justify-between px-4'>
        <div className='hidden lg:block'>
          <Link href='/dashboard' target='_blank'>
            <HomeLogo />
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className='flex items-center gap-2'>
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
