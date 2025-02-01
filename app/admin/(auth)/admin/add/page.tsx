'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/ui/countrySelector';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const AddAdminPage: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: '',
    countryId: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t('common.validation.min', { min: 2 }))
      .required(t('common.validation.required')),
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('common.validation.required')),
    password: Yup.string()
      .min(6, t('common.validation.min', { min: 6 }))
      .required(t('common.validation.required')),
    role: Yup.string()
      .required(t('common.validation.required')),
    countryId: Yup.number()
      .nullable()
      .required(t('common.validation.required')),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      try {
        await fetchFromNest('/admin/admins', {
          method: 'POST',
          body: values,
          headers: { 'Content-Type': 'application/json' },
        });
      toast.success(t('success.add'));
      resetForm(); // Reset the form on success
      setTimeout(() => {
        router.push('/admin/admin');
      }, 1500);
    } catch (err) {
      toast.error(t('errors.add'));
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('admins.add.title')}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium">{t('common.name')}</label>
              <Field
                name="name"
                as={Input}
                placeholder={t('common.placeholders.name')}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">{t('email')}</label>
              <Field
                name="email"
                as={Input}
                placeholder={t('common.placeholders.email')}
              />
              {touched.email && errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">{t('password')}</label>
              <Field
                name="password"
                type="password"
                as={Input}
                placeholder={t('common.placeholders.password')}
              />
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium">{t('common.role')}</label>
              <Select
                value={values.role}
                onValueChange={(value) => setFieldValue("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.placeholders.role')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUPER_ADMIN">{t('super_admin')}</SelectItem>
                  <SelectItem value="REGIONAL_ADMIN">{t('regional_admin')}</SelectItem>
                </SelectContent>
              </Select>
              {touched.role && errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">{t('common.country')}</label>
              <CountrySelect
                selectedCountry={selectedCountry}
                onCountryChange={(countryId) => {
                  setSelectedCountry(countryId);
                  setFieldValue('countryId', countryId);
                }}
              />
              {touched.countryId && errors.countryId && (
                <p className="text-sm text-red-500">{errors.countryId}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/admin/admin')}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {t('common.add_new')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddAdminPage;
