import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

const Navbar = async () => {
  const user = await currentUser();
  return (
    <div className='flex items-center justify-between p-4'>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>
            {user?.username}
          </span>
          <span className='text-[10px] text-gray-500 text-right'>
            {user?.publicMetadata?.role as string}
          </span>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
