"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import { VendorSelect } from "@/components/ui/vendorSelect";
import { SectionSelect } from "@/components/ui/sectionSelect";
import { ImageUpload } from "@/components/ui/imageUpload";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import { useLanguage } from "@/contexts/LanguageContext";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import NotFound from "@/app/not-found";
import { get } from "http";
import { getImageUrl } from "@/lib/utils";
import { add } from "date-fns";

const EditStorePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const { role } = useDashboardAuth()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});
  const [isLogoTouched, setIsLogoTouched] = useState(false);
  const [isBannerTouched, setIsBannerTouched] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("validation_min_length"))
      .required(t("common.validation.required")),
    address: Yup.string().required(t("common.validation.required")),
    cityId: Yup.number().required(t("common.validation.required")),
    vendorId: Yup.number().required(t("common.validation.required")),
    sectionId: Yup.number().required(t("common.validation.required")),
    locationUrl: Yup.string().optional(),
    description: Yup.string().optional(),
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const store = await fetchFromNest(`/admin/stores/${id}`);
        setOriginalData(store);
        setSelectedCountry(store.city?.countryId || null);
        formik.setValues(
          {
            name: store.name,
            address: store.address || "",
            locationUrl: store.locationUrl || "",
            description: store.description || "",
            cityId: store.cityId || "",
            vendorId: store.vendorId || "",
            sectionId: store.sectionId || "",
            image: store.imageUrl || null,
            banner: store.bannerUrl || null,
          },
          false
        );
      } catch (err) {
        if(err.code === 404){
          setError("404")
        }else{
          setError(t("errors.fetch"));
        }
        toast.error(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [id, t]);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      locationUrl: "",
      description: "",
      cityId: "",
      vendorId: "",
      sectionId: "",
      image: null,
      banner: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (key === "image" && !isLogoTouched) return acc;
        if (key === "banner" && !isBannerTouched) return acc;
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t("errors.no_changes_made"));
        return;
      }

      const formData = new FormData();
      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });

      try {
        await fetchFromNest(`/admin/stores/${id}`, {
          method: "PATCH",
          body: formData,
        });
        toast.success(t("success.update"));
        // router.push("/admin/stores");
      } catch (err) {
        toast.error(t("errors.update"));
      }
    },
    enableReinitialize: true,
  });

  if (loading) return <Loading />;
  if(error == "404"){
    return <NotFound />
  }
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("store.edit.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label>{t("store.header.name")}</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.store_name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>
          {/* Address */}
                <div>
          <label>{t("common.address")}</label>
          <Input
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.address")}
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-sm text-red-500">{formik.errors.address}</p>
          )}
        </div>
      {/* locationUrl */}
      <div>
          <label>{t("common.locationUrl")}</label>
          <Input
            name="locationUrl"
            value={formik.values.locationUrl}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.locationUrl")}
          />
        </div>

        {/* Description */}
        <div>S
          <label>{t("store.header.store_description")}</label>
          <Textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.description")}
          />
        </div>
        
 

        {/* Country */}
        <div>
          <label>{t("common.country")}</label>
          {hasPermission(role, Permission.ACCESS_ALL_HOTELS) && <CountrySelect
            selectedCountry={selectedCountry}
            onCountryChange={(countryId) => {
              setSelectedCountry(countryId);
              formik.setFieldValue("cityId", "");
            }}
          /> }
        </div>

        {/* City */}
        <div>
          <label>{t("common.city")}</label>
          <CitySelect
            countryId={selectedCountry}
            initialValue={+formik.values.cityId}
            onCityChange={(cityId) => formik.setFieldValue("cityId", cityId)}
          />
          {formik.touched.cityId && formik.errors.cityId && (
            <p className="text-sm text-red-500">{formik.errors.cityId}</p>
          )}
        </div>

        {/* Vendor */}
        <div>
          <label>{t("vendors.table.vendor")}</label>
          <VendorSelect
            city={+formik.values.cityId}
            value={+formik.values.vendorId}
            onSelect={(vendorId) => formik.setFieldValue("vendorId", vendorId)}
          />
          {formik.touched.vendorId && formik.errors.vendorId && (
            <p className="text-sm text-red-500">{formik.errors.vendorId}</p>
          )}
        </div>

        {/* Section */}
        <div>
          <label>{t("store.header.section")}</label>
          <SectionSelect
            value={+formik.values.sectionId}
            onChange={(sectionId) => formik.setFieldValue("sectionId", sectionId)}
          />
          {formik.touched.sectionId && formik.errors.sectionId && (
            <p className="text-sm text-red-500">{formik.errors.sectionId}</p>
          )}
        </div>

        {/* Logo */}
        <div>
          <label>{t("store.header.image")}</label>
          <ImageUpload
            value={
              isLogoTouched && formik.values.image instanceof File
                ? URL.createObjectURL(formik.values.image)
                : getImageUrl(originalData.image)
            }
            onChange={(file) => {
              formik.setFieldValue("image", file);
              setIsLogoTouched(true);
            }}
          />
        </div>

        {/* Banner */}
        <div>
          <label>{t("store.header.banner")}</label>
          <ImageUpload
            value={
              isBannerTouched && formik.values.banner instanceof File
                ? URL.createObjectURL(formik.values.banner)
                : getImageUrl(originalData.banner) 
            }
            onChange={(file) => {
              formik.setFieldValue("banner", file);
              setIsBannerTouched(true);
            }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/admin/store")}
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

export default EditStorePage;
