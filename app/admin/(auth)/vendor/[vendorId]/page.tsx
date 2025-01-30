'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { userAgent } from 'next/server';
import { useLanguage } from '@/contexts/LanguageContext';
import NotFound from '@/app/not-found';

// Validation Schema
const editVendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phoneNo: z.string().min(9, 'Phone number must be valid.').optional(),
  email: z.string().email('Invalid email format.').optional(),
  address: z.string().optional(),
  cityId: z.number(),
  password: z.string().optional(),
});

type EditVendorFormData = z.infer<typeof editVendorSchema>;

const EditVendorPage: React.FC = () => {
  const { vendorId } = useParams();
  const router = useRouter();
  const { role,user } = useDashboardAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<EditVendorFormData>({} as EditVendorFormData);
  const { t } = useLanguage();
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<EditVendorFormData>({
    resolver: zodResolver(editVendorSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const vendor = await fetchFromNest(`/admin/vendors/${vendorId}`);
        setOriginalData(vendor); // Store original data to compare later
        setSelectedCountry(vendor.city?.countryId || null);
        setValue('name', vendor.name);
        setValue('phoneNo', vendor.phoneNo);
        setValue('email', vendor.email);
        setValue('address', vendor.address);
        setValue('cityId', vendor.cityId || null);
      } catch (err) {
      console.log(err)
        if(err.code === 404){
          setError("404")
        } else{
          setError(t("errors.fetch"));

        }
        toast.error(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId, setValue]);

  const onSubmit = async () => {
    const currentData = getValues();
    const modifiedFields = Object.entries(currentData).reduce((acc, [key, value]) => {
      // Only include password if it has a non-empty value
      if (key === 'password' && (!value || value === '')) {
        return acc;
      }
  
      // Include other fields if they are modified
      if (originalData[key as keyof EditVendorFormData] !== value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Partial<EditVendorFormData>);
  
    if (Object.keys(modifiedFields).length === 0) {
      toast.info('No changes made.');
      return;
    }
  
    try {
      await fetchFromNest(`/admin/vendors/${vendorId}`, {
        method: 'PATCH',
        body: modifiedFields,
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(t("success.update"));
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
        toast.error('errors.update');
      }
    }
  };
  
  if (loading) return <Loading />;
  if(error == "404"){
    return <NotFound />
  }
  if (error) return <Error message={error} />;
  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("vendors.table.vendor_edit")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">{t("common.name")}</label>
          <Input {...register('name')} placeholder={t("common.name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">{t("common.phone")}</label>
          <Input maxLength={12} {...register('phoneNo')} placeholder={"96696000915"} />
          {errors.phoneNo && <p className="text-sm text-red-500">{errors.phoneNo.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">{t("common.email")}</label>
          <Input {...register('email')} placeholder={t("common.placeholders.email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">{t("common.address")}</label>
          <Input {...register('address')} placeholder={t("common.placeholders.address")} />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>
        {hasPermission(role, Permission.ACCESS_ALL_VENDORS) && (
          <div>
            <label className="block text-sm font-medium">{t("common.country")}</label>
            <CountrySelect
              selectedCountry={selectedCountry}
              onCountryChange={(countryId) => {
                setSelectedCountry(countryId);
                setValue('cityId', null);
              }}
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">{t("common.city")}</label>
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <CitySelect
                countryId={selectedCountry || +user.countryId}
                initialValue={field.value}
                onCityChange={field.onChange}
              />
            )}
          />
          {errors.cityId && <p className="text-sm text-red-500">{errors.cityId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">{t("password")}</label>
          <Input {...register('password')} type="password" placeholder={t("common.placeholders.password")} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type='button' onClick={() => router.push('/admin/vendor')}>
            {t("common.cancel")}
          </Button>
          <Button type="submit">{t("common.save")}</Button>
        </div>
      </form>
    </div>
  );
};

export default EditVendorPage;
