/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */

'use client';

import { ArrowDownAZIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

import { Button } from '@/components/custom/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

const userText = new Map<string, string>([
  ['all', 'All Users'],
  ['approved', 'Approved'],
  ['notApproved', 'Not Approved'],
]);

const UserRoles = () => {
  const [sort, setSort] = useState('ascending');
  const [userType, setUserType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null); // Track loading state
  const [users, setUsers] = useState<
    | {
        id: string;
        name: string;
        email: string;
        role: string;
        emailVerified: string;
        emailApproved: boolean;
      }[]
    | null
  >(null);

  const { toast } = useToast();
  const [isPending] = useTransition();

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: data.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: 'Failed to fetch users',
      });
    }
  };

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    setLoadingUserId(userId); // Show loader for the clicked button

    try {
      const response = await fetch(`/api/users/toggle-approval`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, emailApproved: !currentStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          variant: 'success',
          title: 'Success',
          description: data.success,
        });
        // Refetch users to update the UI
        fetchUsers();
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong.',
          description: data.error,
        });
      }
    } catch (error) {
      console.error('Error during toggleApproval:', error); // Log the error
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update approval status',
      });
    } finally {
      setLoadingUserId(null); // Hide the loader
    }
  };

  const filteredUsers = users
    ?.sort((a, b) =>
      sort === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name),
    )
    .filter((user) =>
      userType === 'approved'
        ? user.emailApproved
        : userType === 'notApproved'
          ? !user.emailApproved
          : user,
    )
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <section className='flex flex-col gap-y-4'>
      {/* Filters */}
      <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
        <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
          <Input
            placeholder='Filter users...'
            className='h-9 w-40 lg:w-[250px]'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className='w-36'>
              <SelectValue>{userText.get(userType)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Users</SelectItem>
              <SelectItem value='approved'>Approved</SelectItem>
              <SelectItem value='notApproved'>Not Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className='w-16'>
            <SelectValue>
              <SlidersHorizontalIcon size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align='end'>
            <SelectItem value='ascending'>
              <div className='flex items-center gap-4'>
                <ArrowDownAZIcon size={16} />
                <span>Ascending</span>
              </div>
            </SelectItem>
            <SelectItem value='descending'>
              <div className='flex items-center gap-4'>
                <ArrowDownAZIcon size={16} />
                <span>Descending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* Content */}
      <Separator className='shadow' />
      <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3'>
        {filteredUsers?.map((user) => (
          <li key={user.id} className='rounded-lg border p-4 hover:shadow-md'>
            <div className='mb-8 flex items-center justify-between'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted p-2'>
                {user?.name?.[0]}
              </div>
              <Button
                variant='outline'
                size='sm'
                disabled={loadingUserId === user.id || isPending} // Disable button if it's loading
                onClick={() => toggleApproval(user.id, user.emailApproved)}
              >
                {loadingUserId === user.id ? (
                  <Skeleton className='h-4 w-12' />
                ) : user.emailApproved ? (
                  <span className='text-emerald-500'>Approved</span>
                ) : (
                  <span className='text-[#f59e0b]'>Approve</span>
                )}
              </Button>
            </div>
            <div>
              <h2 className='mb-1 font-semibold'>{user.name}</h2>
              <div className='line-clamp-2 text-gray-500'>
                Email Verified?{' '}
                {user.emailVerified ? (
                  <Badge variant='success'>Yes</Badge>
                ) : (
                  <Badge variant='warning'>Pending Approval</Badge>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default UserRoles;
