'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CountrySelect } from '@/components/ui/countrySelector';
import { CitySelect } from '@/components/ui/citySelector';
import { fetchFromNest } from '@/hooks/useFetch';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import { hasPermission, Permission } from '@/lib/rbac';
import { useDashboardAuth } from '@/contexts/AdminAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const EditHotelPage: React.FC = () => {
  const { hotelId } = useParams();
  const router = useRouter();
  const { role } = useDashboardAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const EditHotelSchema = Yup.object().shape({
    name: Yup.string().min(2, t('common.validation.min', { min: 2 })).required(t('common.validation.required')),
    address: Yup.string().optional(),
    cityId: Yup.number().required(t('common.validation.required')),
    locationUrl: Yup.string().url(t('validation_invalid_url')).optional(),
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const hotel = await fetchFromNest(`/admin/hotels/${hotelId}`);
        setOriginalData(hotel);
        setSelectedCountry(hotel.city?.countryId || null);
        formik.setValues({
          name: hotel.name,
          address: hotel.address,
          cityId: hotel.cityId || '',
          locationUrl: hotel.locationUrl || '',
        }, false);
      } catch (err) {
        setError(t('errors.fetch'));
        toast.error(t('errors.fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      cityId: '',
      locationUrl: '',
    },
    validationSchema: EditHotelSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t('no_changes_made'));
        return;
      }

      try {
        await fetchFromNest(`/admin/hotels/${hotelId}`, {
          method: 'PATCH',
          body: modifiedFields,
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success(t('success.update'));
      } catch (err) {
        toast.error(t('errors.somethingWentWrong'));
      }
    },
    enableReinitialize: true,
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('hotels.edit.title')}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">{t('common.name')}</label>
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
          <label className="block text-sm font-medium">{t("common.address")}</label>
          <Input
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder={t('common.placeholders.address')}
          />
          {formik.errors.address && formik.touched.address && (
            <p className="text-sm text-red-500">{formik.errors.address}</p>
          )}
        </div>
        {hasPermission(role, Permission.ACCESS_ALL_HOTELS) && (
          <div>
            <label className="block text-sm font-medium">{t('hotel_country')}</label>
            <CountrySelect
              selectedCountry={selectedCountry}
              onCountryChange={(countryId) => {
                setSelectedCountry(countryId);
                formik.setFieldValue('cityId', '');
              }}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">{t('common.city')}</label>
          <CitySelect
            countryId={selectedCountry}
            initialValue={+formik.values.cityId}
            onCityChange={(cityId) => formik.setFieldValue('cityId', cityId)}
          />
          {formik.errors.cityId && formik.touched.cityId && (
            <p className="text-sm text-red-500">{formik.errors.cityId}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('common.locationUrl')}</label>
          <Input
            name="locationUrl"
            value={formik.values.locationUrl}
            onChange={formik.handleChange}
            placeholder={t('common.placeholders.locationUrl')}
          />
          {formik.errors.locationUrl && formik.touched.locationUrl && (
            <p className="text-sm text-red-500">{formik.errors.locationUrl}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type='button' variant="outline" onClick={() => router.push('/admin/hotel')}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditHotelPage;
