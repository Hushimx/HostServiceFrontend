"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { useLanguage } from "@/contexts/LanguageContext";

// Define the schema using zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password cannot exceed 20 characters"),
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
  const { t } = useLanguage(); // Language translation function

  const onSubmit = async (data) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/vendor/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (response.ok) {
        toast.success(t("login.success"), { duration: 3000 });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        Router.push("/vendor");
      } else if (response.status === 401) {
        setError("password", { message: t("login.invalid_credentials") });
        toast.error(t("login.invalid_credentials"));
      } else {
        toast.error(t("login.error"));
      }
    } catch (error) {
      toast.error(t("login.server_error"));
    }
  };

  // Extract error messages safely
  const getErrorMessage = (field) =>
    errors[field]?.message ? String(errors[field].message) : null;

  return (
    <>
      <Head>
        <title>{t("login.vendor.login_title")}</title>
      </Head>

      <div
        className="flex items-center justify-center min-h-screen text-gray-800"
        style={{
          backgroundImage: "url('/assets/images/loginBg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-md p-8 bg-white bg-opacity-90 text-gray-900 rounded-lg shadow-2xl">

          {/* Vendor Title */}
          <h1 className="text-3xl font-bold text-center mb-6">
            {t("login.vendor.login_heading")}
          </h1>
          <p className="text-center text-gray-600 mb-6">
            {t("login.vendor.login_subtitle")}
          </p>

          {/* Global Error Message */}
          {(errors.email || errors.password) && (
            <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded">
              {getErrorMessage("email") || getErrorMessage("password")}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("common.email")}
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder={t("common.placeholders.email")}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {getErrorMessage("email")}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("common.password")}
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder={t("common.placeholders.password")}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {getErrorMessage("password")}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-purple-600 text-white hover:bg-white hover:text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("common.loading") : t("common.login")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
