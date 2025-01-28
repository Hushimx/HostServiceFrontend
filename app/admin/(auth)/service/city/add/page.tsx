"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import ServiceSelect from "@/components/ui/serviceSelect";
import { VendorSelect } from "@/components/ui/vendorSelect";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { role, user } = useDashboardAuth();

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  const initialValues = {
    cityId: "",
    serviceId: "", // Initialize serviceId from URL param if available
    vendorId: "",
    description: "",
    description_ar: "",
    address: "",
    locationUrl: "",
  };

  const validationSchema = Yup.object().shape({
    cityId: Yup.number().required(t("common.validation.required")),
    serviceId: Yup.number().required(t("common.validation.required")),
    vendorId: Yup.number().required(t("common.validation.required")),
    description: Yup.string().optional(),
    description_ar: Yup.string().optional(),
    address: Yup.string().required(t("common.validation.required")),
    locationUrl: Yup.string().url(t("validation_invalid_url")).optional(),
  });

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await fetchFromNest(`/admin/services/cities/`, {
        method: "POST",
        body: values,
        headers: { "Content-Type": "application/json" },
      });
      toast.success(t("success.add"));
      resetForm();
      setTimeout(() => {
        router.push("/admin/service/city");
      }, 1500);
    } catch (err: any) {
      
      if (err.details.code == "CITY_CONFLICT") {
        toast.error(t("errors.CITY_CONFLICT"));
      } else {
        toast.error(t("errors.add"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("services.add.title")}</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Service */}
            <div>
              <label>{t("services.table.name")}</label>
              <ServiceSelect
                value={+values.serviceId}
                onChange={(serviceId) => setFieldValue("serviceId", serviceId)}
              />
              {touched.serviceId && errors.serviceId && (
                <p className="text-sm text-red-500">{t(errors.serviceId)}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label>{t("common.country")}</label>
              {hasPermission(role, Permission.ACCESS_ALL_HOTELS) && (
                <CountrySelect
                  selectedCountry={selectedCountry}
                  onCountryChange={(countryId) => {
                    setSelectedCountry(countryId);
                    setFieldValue("cityId", null);
                  }}
                />
              )}
            </div>

            {/* City */}
            <div>
              <label>{t("common.city")}</label>
              <CitySelect
                countryId={selectedCountry || +user.countryId}
                initialValue={+values.cityId}
                onCityChange={(cityId) => {
                  setFieldValue("cityId", cityId);
                  setFieldValue("vendorId", "");
                  setSelectedCity(cityId);
                }}
              />
              {touched.cityId && errors.cityId && (
                <p className="text-sm text-red-500">{t(errors.cityId)}</p>
              )}
            </div>

            {/* Vendor */}
            <div>
              <label>{t("vendors.table.vendor_list")}</label>
              <VendorSelect
                city={selectedCity}
                value={+values.vendorId}
                onSelect={(vendorId) => setFieldValue("vendorId", vendorId)}
              />
              {touched.vendorId && errors.vendorId && (
                <p className="text-sm text-red-500">{t(errors.vendorId)}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label>{t("common.address")}</label>
              <Field
                name="address"
                className="w-full p-2 border rounded"
                placeholder={t("common.placeholders.address")}
              />
              {touched.address && errors.address && (
                <p className="text-sm text-red-500">{t(errors.address)}</p>
              )}
            </div>

            {/* Location URL */}
            <div>
              <label>{t("common.locationUrl")}</label>
              <Field
                name="locationUrl"
                className="w-full p-2 border rounded"
                placeholder={t("common.placeholders.locationUrl")}
              />
              {touched.locationUrl && errors.locationUrl && (
                <p className="text-sm text-red-500">{t(errors.locationUrl)}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label>{t("common.description")}</label>
              <ReactQuill
                className="ReactQuill"
                value={values.description}
                onChange={(content) => setFieldValue("description", content)}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["bold", "italic", "underline"],
                    ["link", "image"],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "ltr" }],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "align",
                  "list",
                  "bullet",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "image",
                  "indent",
                  "direction",
                ]}
                placeholder={t("common.placeholders.description")}
                style={{ backgroundColor: "white" }}
              />
            </div>

            {/* Description (Arabic) */}
            <div>
              <label>{t("common.description_ar")}</label>
              <ReactQuill
                className="ReactQuill"
                value={values.description_ar}
                onChange={(content) => setFieldValue("description_ar", content)}
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["bold", "italic", "underline"],
                    ["link", "image"],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "ltr" }],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "align",
                  "list",
                  "bullet",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "image",
                  "indent",
                  "direction",
                ]}
                placeholder={t("common.placeholders.description_ar")}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push(`/admin/service/city`)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {t("common.add")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddServicePage;
