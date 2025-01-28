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
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const validationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    title: Yup.string()
      .min(3, t("validation_min"))
      .required(t("common.validation.required")),
      title_ar: Yup.string()
      .min(3, t("validation_min"))
      .optional(),
    address: Yup.string().required(t("common.validation.required")),
    locationUrl: Yup.string().url(t("validation_invalid_url")).optional(),
    cityId: Yup.number().required(t("common.validation.required")),

    description: Yup.string().optional(),
    description_ar: Yup.string().optional(),
    });

 function AddStorePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const { role,user } = useDashboardAuth()
  const initialValues = {
    title: "",
    title_ar: "",
    address: "",
    locationUrl: "",
    cityId: null as number | null,
    description: "",
    description_ar: "",
    image: null as File | null,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: any
  ) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("cityId", values.cityId.toString());
    formData.append("address", values.address);
    if (values.locationUrl) formData.append("locationUrl", values.locationUrl);
    if (values.description) formData.append("description", values.description);
    if (values.description_ar) formData.append("description_ar", values.description_ar);
    if (values.image) formData.append("image", values.image);
    try {
      await fetchFromNest("/admin/events", {
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
      <h1 className="text-2xl font-bold mb-4">{t("events.add.title")}</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema(t)}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, touched, errors, isSubmitting }) => (
          <Form className="space-y-6">
            
            {/* Image */}
            <div>
              <label>{t("events.add.title")}</label>
              <ImageUpload
                value={values.image ? URL.createObjectURL(values.image) : null}
                onChange={(file) => setFieldValue("image", file)}
              />
            </div>
            
            {/* title */}
            <div>
              <label>{t("events.header.title")}</label>
              <Field
                name="title"
                as={Input}
                placeholder={t("events.table.write_name")}
              />
              {touched.title && errors.title && (
                <p className="text-sm text-red-500">{t(errors.title)}</p>
              )}
            </div>
         
            {/* title */}
            <div>
              <label>{t("events.header.title_ar")}</label>
              <Field
                name="title_ar"
                as={Input}
                placeholder={t("events.table.write_name")}
              />
              {touched.title_ar && errors.title_ar && (
                <p className="text-sm text-red-500">{t(errors.title_ar)}</p>
              )}
            </div>
              {/* Address */}
            <div>
              <label>{t("common.address")}</label>
              <Field
                name="address"
                as={Input}
                placeholder={t("common.address")}
              />
              {touched.address && errors.address && (
                <p className="text-sm text-red-500">{t(errors.address)}</p>
              )}
            </div>

               {/* Location URL */}
            <div>
              <label>{t("locationUrl")}</label>
              <Field
                name="common.locationUrl"
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
                placeholder={t("common.description")}
                style={{ backgroundColor: "white" }}
              />
            </div>

  
            {/* description_ar */}
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
                placeholder={t("common.description_ar")}
                style={{ backgroundColor: "white" }}
              />
            </div>






            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/event")}
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