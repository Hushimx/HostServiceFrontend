"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import ServiceSelect from "@/components/ui/serviceSelect";
import { VendorSelect } from "@/components/ui/vendorSelect";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditServicePage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const validationSchema = Yup.object().shape({
    description: Yup.string().optional(),
    description_ar: Yup.string().optional(),
    address: Yup.string().required(t("common.validation.required")),
    locationUrl: Yup.string().url(t("validation_invalid_url")).optional(),
  });

  const formik = useFormik({
    initialValues: {

      description: "",
      description_ar: "",
      address: "",
      locationUrl: "",
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
        toast.info(t("errors.no_changes_made"));
        return;
      }

      try {
        await fetchFromNest(`/vendor/services/${id}`, {
          method: "PATCH",
          body: modifiedFields,
          headers: { "Content-Type": "application/json" },
        });
        toast.success(t("success.update"));
        // router.push("/admin/services");
      } catch (err) {
        toast.error(t("errors.somethingWentWrong"));
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const service = await fetchFromNest(`/vendor/services/${id}`);
        setOriginalData(service);
        setSelectedCountry(service.city?.countryId || null);
        setSelectedCity(service.cityId || null);
        formik.setValues({

          description: service.description || "",
          description_ar: service.description_ar || "",
          address: service.address || "",
          locationUrl: service.locationUrl || "",
        });
      } catch (err) {
        setError(t("errors.fetch"));
        toast.error(t("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("services.edit.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">



        {/* Address */}
        <div>
          <label>{t("common.address")}</label>
          <textarea
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.address")}
            className="w-full p-2 border rounded"
          />
          {formik.touched.address && formik.errors.address && (
            <p className="text-sm text-red-500">{formik.errors.address}</p>
          )}
        </div>

        {/* Location URL */}
        <div>
          <label>{t("common.locationUrl")}</label>
          <textarea
            name="locationUrl"
            value={formik.values.locationUrl}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.locationUrl")}
            className="w-full p-2 border rounded"
          />
          {formik.touched.locationUrl && formik.errors.locationUrl && (
            <p className="text-sm text-red-500">{formik.errors.locationUrl}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label>{t("common.description")}</label>
          <ReactQuill
            className="ReactQuill"
            value={formik.values.description}
            onChange={(content) => formik.setFieldValue("description", content)}
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
          />
        </div>

        {/* Description (Arabic) */}
        <div>
          <label>{t("common.description_ar")}</label>
          <ReactQuill
            className="ReactQuill"
            value={formik.values.description_ar}
            onChange={(content) => formik.setFieldValue("description_ar", content)}
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
          <Button variant="outline" type="button" onClick={() => router.push("/vendor/service/")}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditServicePage;
