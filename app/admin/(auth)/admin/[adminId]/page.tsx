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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CountrySelect } from "@/components/ui/countrySelector";
import { hasPermission, Permission } from "@/lib/rbac";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/app/not-found";

const EditAdminPage: React.FC = () => {
  const { adminId } = useParams();
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
    email: Yup.string()
      .email(t("validation.email"))
      .required(t("common.validation.required")),
    password: Yup.string(),
    role: Yup.string().required(t("common.validation.required")),
    countryId: Yup.number().required(t("common.validation.required")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      countryId: null,
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
        await fetchFromNest(`/admin/admins/${adminId}`, {
          method: "PATCH",
          body: modifiedFields,
          headers: { "Content-Type": "application/json" },
        });
        toast.success(t("success.update"));
        router.push("/admin/admin");
      } catch (err) {
        toast.error(t("errors.update"));
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const admin = await fetchFromNest(`/admin/admins/${adminId}`);
        setOriginalData(admin);
        setSelectedCountry(admin.countryId || null);
        formik.setValues(
          {
            name: admin.name,
            email: admin.email,
            password: "",
            role: admin.role,
            countryId: admin.countryId || null,
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

    fetchAdmin();
  }, [adminId]);

  if (loading) return <Loading />;
  if(error == "404"){
    return <NotFound />
  }
if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t("admins.edit.title")}</h1>
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

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">{t("common.email")}</label>
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm text-red-500">{formik.errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">{t("common.password")}</label>
          <Input
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder={t("common.placeholders.password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500">{formik.errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">{t("role")}</label>
          <Select
            value={formik.values.role}
            onValueChange={(value) => formik.setFieldValue("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("common.placeholders.role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUPER_ADMIN">{t("roles.SUPER_ADMIN")}</SelectItem>
              <SelectItem value="REGIONAL_ADMIN">{t("roles.REGIONAL_ADMIN")}</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-sm text-red-500">{formik.errors.role}</p>
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
                formik.setFieldValue("countryId", countryId);
              }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/admin")}
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

export default EditAdminPage;
