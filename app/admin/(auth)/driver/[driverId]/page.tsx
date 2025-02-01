'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import { CitySelect } from "@/components/ui/citySelector";
import { CountrySelect } from "@/components/ui/countrySelector";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/app/not-found";

const EditDriverPage: React.FC = () => {
  const { driverId } = useParams();
  const router = useRouter();
  const { role, user } = useDashboardAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("common.validation.min", { min: 2 }))
      .required(t("common.validation.required")),
    phoneNo: Yup.string()
      .min(9, t("validation_phone_valid"))
      .required(t("common.validation.required")),
    cityId: Yup.number().required(t("common.validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNo: "",
      cityId: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t("no_changes_made"));
        return;
      }

      try {
        await fetchFromNest(`/admin/drivers/${driverId}`, {
          method: "PATCH",
          body: modifiedFields,
          headers: { "Content-Type": "application/json" },
        });
        toast.success(t("success.update"));
        router.push("/admin/driver");
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
        toast.error(t('errors.update'));
        }      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        setLoading(true);
        const driver = await fetchFromNest(`/admin/drivers/${driverId}`);
        setOriginalData(driver);
        setSelectedCountry(driver.city?.country.id || null);
        formik.setValues(
          {
            name: driver.name,
            phoneNo: driver.phoneNo,
            cityId: driver.city.id || null,
          },
          false
        );
      } catch (err) {
        if(err.code == 404){
          setError("404");
        }else{
          setError(t("errors.fetch"));
        }
        toast.error(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId]);

  if (loading) return <Loading />;
  if(error == "404") return <NotFound />
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("drivers.edit.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium">{t("common.name")}</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium">{t("common.phone")}</label>
          <Input
            name="phoneNo"
            value={formik.values.phoneNo}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.phone")}
          />
          {formik.touched.phoneNo && formik.errors.phoneNo && (
            <p className="text-sm text-red-500">{formik.errors.phoneNo}</p>
          )}
        </div>

        {/* Country */}
        {hasPermission(role, Permission.ACCESS_ALL_HOTELS) && (
          <div>
            <label className="block text-sm font-medium">{t("common.country")}</label>
            <CountrySelect
              selectedCountry={selectedCountry}
              onCountryChange={(countryId) => {
                setSelectedCountry(countryId);
                formik.setFieldValue("cityId", null);
              }}
            />
          </div>
        )}

        {/* City */}
        <div>
          <label className="block text-sm font-medium">{t("common.city")}</label>
          <CitySelect
            countryId={selectedCountry || +user.countryId}
            initialValue={formik.values.cityId}
            onCityChange={(cityId) => formik.setFieldValue("cityId", cityId)}
          />
          {formik.touched.cityId && formik.errors.cityId && (
            <p className="text-sm text-red-500">{formik.errors.cityId}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
          type="button"
            variant="outline"
            onClick={() => router.push("/admin/driver")}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={!formik.dirty || formik.isSubmitting}
          >
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDriverPage;
