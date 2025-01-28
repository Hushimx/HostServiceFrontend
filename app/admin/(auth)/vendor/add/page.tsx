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

const AddVendorPage: React.FC = () => {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const { t } = useLanguage();
  const { role,user } = useDashboardAuth()

  const initialValues = {
    name: '',
    phoneNo: '',
    email: '',
    address: '',
    cityId: null,
    password: '',
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters.').required(t("common.validation.required")),
    phoneNo: Yup.number().required(t("common.validation.required")),
    email: Yup.string().email('Invalid email format.').required(t("common.validation.required")),
    address: Yup.string().required(t("common.validation.required")),
    cityId: Yup.number().nullable().required(t("common.validation.required")),
    password: Yup.string().min(6, 'Password must be at least 6 characters.').required(t("common.validation.required")),
  });
  
  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest('/admin/vendors', {
        method: 'POST',
        body: values,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t("success.add"));
      resetForm(); // Reset the form on success
      await new Promise((res) => setTimeout(() => res(''), 1500));
      router.push('/admin/vendor');
    } catch (err) {
      if(err.details.code == "WHATSAPP_ERROR"){
        toast.error('errors.WHATSAPP_ERROR');
      }else if(err.details.code == "INVALID_WHATSAPP_NUMBER"){
        toast.error('errors.INVALID_WHATSAPP_NUMBER');
      }else if(err.details.code == "PHONE_NUMBER_CONFLICT"){
        toast.error('errors.PHONE_NUMBER_CONFLICT');
      }else if(err.details.code == "EMAIL_CONFLICT"){ {
        toast.error('errors.EMAIL_CONFLICT');
      }}else{
        toast.error(t('errors.add'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("vendors.add.title")}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">{t("common.name")}</label>
              <Field
                name="name"
                as={Input}
                placeholder={t("common.name")}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t("common.phone")} </label>
              <Field
                name="phoneNo"
                as={Input}
                maxLength={12}
                placeholder={"e.g. 966596000912"}
              />
              {touched.phoneNo && errors.phoneNo && (
                <p className="text-sm text-red-500">{errors.phoneNo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t("common.email")}</label>
              <Field
                name="email"
                as={Input}
                placeholder={t("common.placeholders.email")}
              />
              {touched.email && errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">{t("common.address")}</label>
              <Field
                name="address"
                as={Input}
                placeholder={t("common.placeholders.address")}
              />
              {touched.address && errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
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


            <div>
              <label className="block text-sm font-medium">{t("common.password")}</label>
              <Field
                name="password"
                as={Input}
                type="password"
                placeholder={t("common.placeholders.password")}
              />
              {touched.password && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push('/admin/vendor')}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
              {t("common.add_new")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddVendorPage;
