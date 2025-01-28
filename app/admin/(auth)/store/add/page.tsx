"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
import { useLanguage } from "@/contexts/LanguageContext";
import withPermission from "@/components/providers/withRoles";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";

const validationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    name: Yup.string()
      .min(2, t("validation_name_min"))
      .required(t("common.validation.required")),
    address: Yup.string().required(t("common.validation.required")),
    locationUrl: Yup.string().optional(),
    cityId: Yup.number().required(t("common.validation.required")),
    vendorId: Yup.number().required(t("common.validation.required")),
    sectionId: Yup.number().required(t("common.validation.required")),
    description: Yup.string().optional(),
  });

 function AddStorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const { role,user } = useDashboardAuth()
  const initialValues = {
    name: "",
    address: "",
    locationUrl: "",
    cityId: null as number | null,
    vendorId: null as number | null,
    sectionId: null as number | null,
    description: "",
    logo: null as File | null,
    banner: null as File | null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any
  ) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("address", values.address);
    formData.append("cityId", values.cityId?.toString());
    formData.append("vendorId", values.vendorId?.toString());
    formData.append("sectionId", values.sectionId?.toString());
    if (values.locationUrl) formData.append("locationUrl", values.locationUrl);
    if (values.description) formData.append("description", values.description);
    if (values.logo) formData.append("image", values.logo);
    if (values.banner) formData.append("banner", values.banner);
    try {
      await fetchFromNest("/admin/stores", {
        method: 'POST',
        body: formData,

      });
      toast.success(t("success.add"));
      resetForm();
    } catch (err) {
      toast.error(t("errors.somethingWentWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("store.header.name")}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema(t)}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Name */}
            <div>
              <label>{t("store.header.name")}</label>
              <Field
                name="name"
                as={Input}
                placeholder={t("common.placeholders.description")}
              />
              {touched.name && errors.name && (
                <p className="text-sm text-red-500">{t(errors.name)}</p>
              )}
            </div>
            {/* Address */}
            <div>
              <label>{t("common.address")}</label>
              <Field
                name="address"
                as={Input}
                placeholder={t("common.placeholders.address")}
              />
              {touched.address && errors.address && (
                <p className="text-sm text-red-500">{t(errors.address)}</p>
              )}
            </div>
            {/* Description */}
            <div>
              <label>{t("common.placeholders.description")}</label>
              <Field
                name="description"
                as={Textarea}
                placeholder={t("common.placeholders.description")}
              />
            </div>
              {/* LocationUrl */}
                        <div>
              <label>{t("common.locationUrl")}</label>
              <Field
                name="locationUrl"
                as={Input}
                placeholder={t("common.placeholders.locationUrl")}
              />
              {touched.locationUrl && errors.locationUrl && (
                <p className="text-sm text-red-500">{t(errors.locationUrl)}</p>
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

            {/* Vendor */}
            <div>
              <label>{t("vendors.table.vendor")}</label>
              <VendorSelect
              city={values.cityId}
                value={values.vendorId}
                onSelect={(vendorId) => setFieldValue("vendorId", vendorId)}
              />
              {touched.vendorId && errors.vendorId && (
                <p className="text-sm text-red-500">{t(errors.vendorId)}</p>
              )}
            </div>

            {/* Section */}
            <div>
              <label>{t("store.header.section")}</label>
              <SectionSelect
                value={values.sectionId}
                onChange={(sectionId) => setFieldValue("sectionId", sectionId)}
              />
              {touched.sectionId && errors.sectionId && (
                <p className="text-sm text-red-500">{t(errors.sectionId)}</p>
              )}
            </div>

            {/* Logo */}
            <div>
              <label>{t("store.header.image")}</label>
              <ImageUpload
                value={values.logo ? URL.createObjectURL(values.logo) : null}
                onChange={(file) => setFieldValue("logo", file)}
              />
            </div>

            {/* Banner */}
            <div>
              <label>{t("store.header.banner")}</label>
              <ImageUpload
                value={values.banner ? URL.createObjectURL(values.banner) : null}
                onChange={(file) => setFieldValue("banner", file)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/store")}
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
}

export default withPermission(Permission.CREATE_STORES)(AddStorePage);