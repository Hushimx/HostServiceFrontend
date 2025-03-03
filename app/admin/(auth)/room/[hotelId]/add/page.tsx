'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';

const AddRoomPage : React.FC = () => {
  const router = useRouter();
  const { hotelId } = useParams();
  const { t } = useLanguage();

  const initialValues = {
    roomNumber: '',
    type: '',
  };

  const validationSchema = Yup.object().shape({
    roomNumber: Yup.string()
      .required(t('common.validation.required')),
    type: Yup.string()
      .required(t('common.validation.required')),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest(`/admin/rooms/${hotelId}`, {
        method: 'POST',
        body: values,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t('success.add'));
      resetForm(); // Reset the form on success
      setTimeout(() => {
        router.push(`/admin/room/${hotelId}`);
      }, 1500);
    } catch (err) {
      toast.error(t('error.add'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('rooms.table.add_room')}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">{t('room.header.number')}</label>
              <Field
                name="roomNumber"
                as={Input}
                placeholder={t('room.header.number')}
              />
              {touched.roomNumber && errors.roomNumber && (
                <p className="text-sm text-red-500">{t(errors.roomNumber)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t('room.header.type')}</label>
              <Field
                name="type"
                as={Input}
                placeholder={t('room.header.type')}
              />
              {touched.type && errors.type && (
                <p className="text-sm text-red-500">{t(errors.type)}</p>
              )}
            </div>

            <div className="flex justify-end gap-5">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/admin/room/${hotelId}`)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting} >
                {t('common.add')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRoomPage;
