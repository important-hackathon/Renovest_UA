import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">
          Renovest UA
        </h1>
        <h2 className="mt-2 text-center text-md text-gray-600">
          Sign in to your account
        </h2>
      </div>

      <LoginForm />
    </div>
  );
}