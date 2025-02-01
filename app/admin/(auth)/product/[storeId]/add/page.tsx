"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SectionSelect } from "@/components/ui/sectionSelect";
import { ImageUpload } from "@/components/ui/imageUpload";
import { fetchFromNest } from "@/hooks/useFetch";
import { useLanguage } from "@/contexts/LanguageContext";

const AddProductPage: React.FC = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const validationSchema = Yup.object().shape({
       name: Yup.string()
      .min(2, t("common.validation.min", { min: 2 }))
      .required(t("common.validation.required")),
    price: Yup.number()
      .min(0, t("validation_min_value"))
      .required(t("common.validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 20,
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });

      try {
        await fetchFromNest(`/admin/products/${storeId}`, {
          method: "POST",
          body: formData,
        });

        toast.success(t("success.add"));
        setTimeout(()=>{
          router.back()
        },1500)

      } catch (err) {
        toast.error(t("errors.somethingWentWrong"));
      }
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("products.add.title")}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label>{t("products.table.name")}</label>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.product_name")}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label>{t("products.table.price")}</label>
          <Input
            type="number"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.product_price")}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        {/* Category
        <div>
          <label>{t("product_category")}</label>
          <SectionSelect
            value={+formik.values.categoryId}
            onChange={(categoryId) => formik.setFieldValue("categoryId", categoryId)}
          />
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="text-sm text-red-500">{formik.errors.categoryId}</p>
          )}
        </div> */}

        {/* Photo */}
        <div>
          <label>{t("products.table.product_photo")}</label>
          <ImageUpload
            value={
              formik.values.image instanceof File
                ? URL.createObjectURL(formik.values.image)
                : null
            }
            onChange={(file) => {
              formik.setFieldValue("image", file);
            }}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push(`/admin/product/${storeId}`)}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={formik.isSubmitting}>
            {t("products.table.create_product")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
