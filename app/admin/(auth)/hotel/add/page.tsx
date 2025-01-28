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

// Validation Schema

const AddHotelPage: React.FC = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const { t } = useLanguage();
  const { role,user } = useDashboardAuth()

  const initialValues = {
    name: '',
    address: '',
    locationUrl: '',
    cityId: null,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t('validation_name_min'))
      .required(t('common.validation.required')),
    address: Yup.string().required(t('common.validation.required')),
    locationUrl: Yup.string()
      .url(t('validation_url_invalid'))
      .required(t('common.validation.required')),
    cityId: Yup.number().nullable().required(t('common.validation.required')),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest('/admin/hotels', {
        method: 'POST',
        body: values,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t('success.add'));
      resetForm(); // Reset the form on success
      setTimeout(() => {
        router.push('/admin/hotel');
      }, 1500);
    } catch (err) {
      toast.error(t('toast_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('hotels.add.title')}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">{t('common.name')}</label>
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
              <label className="block text-sm font-medium">{t("common.address")}</label>
              <Field
                name="address"
                as={Input}
                placeholder={t('common.placeholders.address')}
              />
              {touched.address && errors.address && (
                <p className="text-sm text-red-500">{t(errors.address)}</p>
              )}
            </div>

                 {/* Country */}
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
                initialValue={values.cityId}
                onCityChange={(cityId) => setFieldValue("cityId", cityId)}
              />
              {touched.cityId && errors.cityId && (
                <p className="text-sm text-red-500">{t(errors.cityId)}</p>
              )}
            </div>



            <div>
              <label className="block text-sm font-medium">{t('common.locationUrl')}</label>
              <Field
                name="locationUrl"
                as={Input}
                placeholder={t('common.placeholders.locationUrl')}
              />
              {touched.locationUrl && errors.locationUrl && (
                <p className="text-sm text-red-500">{t(errors.locationUrl)}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/admin/hotel')}
              >
                {t('common.cancel')}
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

export default AddHotelPage;
