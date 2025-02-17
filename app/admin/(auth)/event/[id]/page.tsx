"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountrySelect } from "@/components/ui/countrySelector";
import { CitySelect } from "@/components/ui/citySelector";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageUpload } from "@/components/ui/imageUpload";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { getImageUrl } from "@/lib/utils";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";

const EditEventPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const router = useRouter();
  const { role, user } = useDashboardAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [originalData, setOriginalData] = useState<any>({});
  const [isImageTouched, setIsImageTouched] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, t("common.validation.min", { min: 3 }))
      .required(t("common.validation.required")),

    title_ar: Yup.string()
      .min(3, t("common.validation.min", { min: 3 }))
      .optional(),
    address: Yup.string().required(t("common.validation.required")),
    locationUrl: Yup.string().url(t("validation_invalid_url")).optional(),
    cityId: Yup.number().required(t("common.validation.required")),
    description: Yup.string().optional(),
    description_ar: Yup.string().optional(),
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const event = await fetchFromNest(`/admin/events/${id}`);
        setOriginalData(event);
        setSelectedCountry(event.city?.countryId || null);
        console.log(event)
        formik.setValues(
          {
            title: event.title || "",
            title_ar: event.title_ar || "",
            address: event.address || "",
            locationUrl: event.locationUrl || "",
            description: event.description || "",
            description_ar: event.description_ar || "",
            cityId: event.cityId || "",
            image: event.image || null,
          },
          false
        );
      } catch (err) {
        setError(t("errors.fetch"));
        toast.error(t("errors.somethingWentWrong"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const formik = useFormik({
    initialValues: {
      title: "",
      title_ar: "",
      address: "",
      locationUrl: "",
      description: "",
      description_ar: "",
      cityId: "",
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (key === "image" && !isImageTouched) return acc;
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t("no_changes_made"));
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
        await fetchFromNest(`/admin/events/${id}`, {
          method: "PATCH",
          body: formData,
        });
        toast.success(t("success.update"));
        // router.push("/admin/events");
      } catch (err) {
        toast.error(t("errors.somethingWentWrong"));
      }
    },
    enableReinitialize: true,
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("events.edit.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        
        {/* Image */}
        <div>
          <label>{t("common.image")}</label>
          <ImageUpload
            value={
              isImageTouched && formik.values.image instanceof File
                ? URL.createObjectURL(formik.values.image)
                : getImageUrl(originalData.image)
            }
            onChange={(file) => {
              formik.setFieldValue("image", file);
              setIsImageTouched(true);
            }}
          />
        </div>
        {/* Title */}
        <div>
          <label>{t("events.header.title")}</label>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.event_title")}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-sm text-red-500">{formik.errors.title}</p>
          )}
        </div>
        {/* Title arabic */}
        <div>
          <label>{t("events.header.title_ar")}</label>
          <Input
            name="title_ar"
            value={formik.values.title_ar}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.event_title")}
          />
          {formik.touched.title_ar && formik.errors.title_ar && (
            <p className="text-sm text-red-500">{formik.errors.title_ar}</p>
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

        {/* Location URL */}
        <div>
          <label>{t("common.locationUrl")}</label>
          <Input
            name="locationUrl"
            value={formik.values.locationUrl}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.locationUrl")}
          />
          {formik.touched.locationUrl && formik.errors.locationUrl && (
            <p className="text-sm text-red-500">{formik.errors.locationUrl}</p>
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
            initialValue={+formik.values.cityId}
            onCityChange={(cityId) => formik.setFieldValue("cityId", cityId)}
          />
          {formik.touched.cityId && formik.errors.cityId && (
            <p className="text-sm text-red-500">{formik.errors.cityId}</p>
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
            placeholder={t("common.description")}
            style={{ backgroundColor: "white" }}
          />
        </div>
                        {/* Description */}
                        <div>
          <label>{t("common.description_ar")}</label>
          <ReactQuill
            className="ReactQuill"
            value={formik.values.description_ar}
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
            placeholder={t("common.description")}
            style={{ backgroundColor: "white" }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/event")}
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

export default EditEventPage;
