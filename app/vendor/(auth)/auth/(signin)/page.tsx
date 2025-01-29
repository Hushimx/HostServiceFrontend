"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Head from 'next/head';
import { Toaster, toast } from 'sonner';
import {useRouter} from 'next/navigation';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';

// Define the schema using zod
const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z
    .string()
    .min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف')
    .max(20, 'كلمة المرور لا يمكن أن تتجاوز 20 حرفًا'),
});

const LoginForm = () => {
  // React Hook Form setup with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const Router = useRouter();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('تم تسجيل الدخول بنجاح!', { duration: 3000 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Router.push('/dashboard');
        // Handle successful login (e.g., redirect or store token)
      } else if (response.status === 401) {
        setError('password', { message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        toast.error('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else {
        toast.error('حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا');
      }
    } catch (error) {
      toast.error('فشل الاتصال بالخادم');
    }
  };

  // Safely extract error messages
  const getErrorMessage = (field) =>
    errors[field]?.message ? String(errors[field].message) : null;

  return (
    <>
      <Head>
        <title>تسجيل الدخول - موقعك</title>
      </Head>


      <div className="flex items-center justify-center min-h-screen  text-foreground" style={{backgroundImage: "url('/assets/images/loginBg.png')",backgroundSize:"cover"}}>
        <div className="w-full max-w-md p-8 bg-primary text-primary-foreground rounded-lg shadow-lg">
        <Logo />

          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-6">تسجيل الدخول</h1>

          {/* Global Error Message */}
          {(errors.email || errors.password) && (
            <div className="mb-4 text-sm text-error bg-error-foreground p-3 rounded">
              {getErrorMessage('email') || getErrorMessage('password')}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="ادخل بريدك الإلكتروني"
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                  errors.email ? 'border-error' : 'border-input'
                }`}
              />
              {errors.email && (
                <p className="text-sm text-error mt-1">
                  {getErrorMessage('email')}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="ادخل كلمة المرور"
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                  errors.password ? 'border-error' : 'border-input'
                }`}
              />
              {errors.password && (
                <p className="text-sm text-error mt-1">
                  {getErrorMessage('password')}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className='w-full bg-purple-700 text-white hover:bg-white hover:text-black'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
