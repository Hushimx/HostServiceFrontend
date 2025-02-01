'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const initialValues = {
    name: '',
    slug: '',
    description: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t('validation_name_min'))
      .required(t('common.validation.required')),
    slug: Yup.string()
      .matches(/^[a-z0-9-]+$/, t('validation_slug_invalid'))
      .required(t('common.validation.required')),
    description: Yup.string()
      .min(10, t('common.validation.min', { min: 10 }))
      .required(t('common.validation.required')),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest('/admin/services/list/', {
        method: 'POST',
        body: values,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t('success.add'));
      resetForm(); // Reset the form on success
      setTimeout(() => {
        router.push('/admin/service/list');
      }, 1500);
    } catch (err: any) {
      if (err.message.includes('A service with this slug already exists.')) {
        toast.error(t('errors.SLUG_CONFLICT'));
      } else {
        toast.error(t('errors.add'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('services.table.title')}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">{t('services.table.name')}</label>
              <Field
                name="name"
                as={Input}
                placeholder={t('common.placeholders.name')}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{t(errors.name)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t('service_slug')}</label>
              <Field
                name="slug"
                as={Input}
                placeholder={t('common.placeholders.service_slug')}
              />
              {touched.slug && errors.slug && (
                <p className="text-sm text-red-500">{t(errors.slug)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t('common.description')}</label>
              <Field
                name="description"
                as={Textarea}
                placeholder={t('common.placeholders.service_description')}
              />
              {touched.description && errors.description && (
                <p className="text-sm text-red-500">{t(errors.description)}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/admin/service/list')}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {t('common.add_new')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddServicePage;
