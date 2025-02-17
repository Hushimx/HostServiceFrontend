"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ui/imageUpload";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";
import { useLanguage } from "@/contexts/LanguageContext";
import {  Permission } from "@/lib/rbac";
import { useVendorAuth } from "@/contexts/vendorAuthContext";
import { getImageUrl } from "@/lib/utils";

const EditProductPage: React.FC = () => {
  const { storeId,id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any>({});
  const [isImageTouched, setIsImageTouched] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("common.validation.min", { min: 2 }))
      .required(t("common.validation.required")),
    price: Yup.number().required(t("common.validation.required")).min(1, t("common.validation.required")),
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setLoading(true);
        const product = await fetchFromNest(`/vendor/products/${storeId}/${id}`);
        setOriginalData(product);
        formik.setValues(
          {
            name: product.name,
            price: product.price,
            image: product.image,
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

    fetchStore();
  }, [id, t]);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
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
        await fetchFromNest(`/vendor/products/${storeId}/${id}`, {
          method: "PATCH",
          body: formData,
        });
        toast.success(t("success.update"));
        // router.push("/vendor/stores");
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
      <h1 className="text-2xl font-bold mb-4">{t("products.edit.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label>{t("common.name")}</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder={t("store_common.placeholders.name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>





        {/* Price */}
        <div>
          <label>{t("common.name")}</label>
          <Input
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            placeholder={t("common.price")}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>


        {/* Logo */}
        <div>
          <label>{t("products.table.product_photo")}</label>
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



        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/vendor/product/${storeId}`)}
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

export default EditProductPage;
