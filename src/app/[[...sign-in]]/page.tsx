import SignInForm from '@/components/auth/sign-in-form';
import AuthCover from '@/components/layout/auth-cover';

const HomePage = () => {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthCover />
      <div className='flex h-full items-center p-4 lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome Back!
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter Your Credentials to Proceed
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
