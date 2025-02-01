'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchFromNest } from '@/hooks/useFetch';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import { useLanguage } from '@/contexts/LanguageContext';

const EditServicePage: React.FC = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const EditServiceSchema = Yup.object().shape({
    name: Yup.string().min(2, t('common.validation.min', { min: 2 })).required(t('common.validation.required')),
    description: Yup.string().required(t('common.validation.required')),
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const service = await fetchFromNest(`/admin/services/list/${slug}`);
        setOriginalData(service);
        formik.setValues({
          name: service.name,
          description: service.description,
        }, false);
      } catch (err) {
        setError(t('failed_fetch_service_data'));
        toast.error(t('failed_fetch_service_data'));
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema: EditServiceSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t('common.no_changes_made'));
        return;
      }

      try {
        await fetchFromNest(`/admin/services/list/${slug}`, {
          method: 'PATCH',
          body: modifiedFields,
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success(t('success.update'));
      } catch (err) {
        toast.error(t('errors.failed_update_service'));
      }
    },
    enableReinitialize: true,
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('services.table.slug')}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">{t('services.table.name')}</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder={t('common.placeholders.name')}
          />
          {formik.errors.name && formik.touched.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('common.description')}</label>
          <Textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder={t('common.placeholders.description')}
          />
          {formik.errors.description && formik.touched.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type='button' variant="outline" onClick={() => router.push('/admin/service/list/')}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditServicePage;
