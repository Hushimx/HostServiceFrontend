'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/ui/countrySelector';
import { CitySelect } from '@/components/ui/citySelector';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';
import { hasPermission, Permission } from '@/lib/rbac';
import { useDashboardAuth } from '@/contexts/AdminAuthContext';

const AddDriverPage: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, role } = useDashboardAuth();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const initialValues = {
    name: '',
    phoneNo: '',
    cityId: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t('common.validation.min', { min: 2 }))
      .required(t('common.validation.required')),
    phoneNo: Yup.string()
      .min(9, t('common.validation.min', { min: 9 }))
      .required(t('common.validation.required')),
    cityId: Yup.number()
      .nullable()
      .required(t('common.validation.required')),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest('/admin/drivers', {
        method: 'POST',
        body: values,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t('success.add'));
      setTimeout(() => {
        router.push('/admin/driver');
      }, 1500);
    } catch (err) {
      if(err.details.code == "WHATSAPP_ERROR"){
        toast.error(t('errors.WHATSAPP_ERROR'));
      }else if(err.details.code == "INVALID_WHATSAPP_NUMBER"){
        toast.error(t('errors.INVALID_WHATSAPP_NUMBER'));
      }else if(err.details.code == "PHONE_NUMBER_CONFLICT"){
        toast.error(t('errors.PHONE_NUMBER_CONFLICT'));
      }else if(err.details.code == "EMAIL_CONFLICT"){ {
        toast.error(t('errors.EMAIL_CONFLICT'));
      }}else{
      toast.error(t('errors.add'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('drivers.add.title')}</h1>
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

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">{t("common.phone")}</label>
              <Field
                name="phoneNo"
                as={Input}
                placeholder={t('common.placeholders.name')}
              />
              {touched.phoneNo && errors.phoneNo && (
                <p className="text-sm text-red-500">{errors.phoneNo}</p>
              )}
            </div>

            <div>
              <label>{t("common.country")}</label>
             {hasPermission(role, Permission.ACCESS_ALL_HOTELS) && <CountrySelect
                selectedCountry={selectedCountry}
                onCountryChange={(countryId) => {
                  setSelectedCountry(countryId);
                  setFieldValue("cityId", null);
                }}
              />} 
            </div>

            {/* City */}
            <div>
              <label>{t("common.city")}</label>
              <CitySelect
                countryId={selectedCountry || +user.countryId}
                initialValue={+values.cityId}
                onCityChange={(cityId) => setFieldValue("cityId", cityId)}             />
              {touched.cityId && errors.cityId && (
                <p className="text-sm text-red-500">{t(errors.cityId)}</p>
              )}
            </div>


            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/admin/driver')}
              >
                {t("common.cancel")}
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

export default AddDriverPage;
