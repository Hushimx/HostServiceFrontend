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
import { useLanguage } from "@/contexts/LanguageContext";

const EditClientPage: React.FC = () => {
  const { clientId } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, t("validation_min_length"))
      .required(t("common.validation.required")),
    phoneNo: Yup.string()
      .min(9, t("validation_phone_valid"))
      .required(t("common.validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phoneNo: "",
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
        await fetchFromNest(`/admin/clients/${clientId}`, {
          method: "PATCH",
          body: modifiedFields,
          headers: { "Content-Type": "application/json" },
        });
        toast.success(t("success.update"));
        router.push("/admin/client");
      } catch (err) {
        toast.error(t("errors.update"));
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const client = await fetchFromNest(`/admin/clients/${clientId}`);
        setOriginalData(client);
        formik.setValues(
          {
            name: client.name,
            phoneNo: client.phoneNo,
          },
          false
        );
      } catch (err) {
        setError(t("errors.fetch"));
        toast.error(t("errors.fetch"));
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("clients.edit.title")}</h1>
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

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/client")}
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

export default EditClientPage;
