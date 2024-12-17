"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CountrySelect } from "@/components/locationFilters";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";

// Validation schema
const editAdminSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.enum(["SUPER_ADMIN", "REGIONAL_ADMIN"], {
    required_error: "Role is required.",
  }),
  countryId: z.number(),
});

type EditAdminFormData = z.infer<typeof editAdminSchema>;
type InitialAdminData = EditAdminFormData & { initialCountryId: string };

const EditAdminPage: React.FC = () => {
  const { adminId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<InitialAdminData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditAdminFormData>({
    resolver: zodResolver(editAdminSchema),
    mode: 'onChange',
  });

  // Watch all form fields
  const watchedFields = watch();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const admin = await fetchFromNest(`/admin/admins/${adminId}`);
        const initialFormData = {
          email: admin.email,
          password: "", // Password is not returned for security reasons
          name: admin.firstName,
          role: admin.role,
          countryId: String(admin.countryId),
          initialCountryId: String(admin.countryId),
        };
        setInitialData(initialFormData);
        
        // Set initial values
        setValue("email", admin.email);
        setValue("name", admin.firstName);
        setValue("role", admin.role);
        setValue("countryId", String(admin.countryId));
      } catch (error: any) {
        toast.error("Failed to fetch admin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, setValue]);

  const onSubmit = async (data: EditAdminFormData) => {
    // Prepare differential update
    const updateBody: Partial<EditAdminFormData> = {};

    // Check and add changed fields
    if (watchedFields.email !== initialData?.email) {
      updateBody.email = data.email;
    }
    if (watchedFields.name !== initialData?.name) {
      updateBody.name = data.name;
    }
    if (watchedFields.role !== initialData?.role) {
      updateBody.role = data.role;
    }
    if (watchedFields.password) {
      updateBody.password = data.password;
    }
    if (String(watchedFields.countryId) !== initialData?.initialCountryId) {
      updateBody.countryId = data.countryId;
    }

    // Only send request if there are changes
    if (Object.keys(updateBody).length > 0) {
      try {
        await fetchFromNest(`/admin/admins/${adminId}`, {
          method: "PATCH",
          body: updateBody,
        });
        toast.success("Admin updated successfully!");
        router.push("/dashboard/admin");
      } catch (error: any) {
        toast.error(error.message || "Failed to update admin.");
      }
    } else {
      toast.info("No changes to update.");
    }
  };

  if (loading || !initialData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full p-8 max-w-3xl mx-auto shadow-secondary-lg rounded-md border bg-card text-card-foreground shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <Input type="email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input type="password" placeholder="Enter new password" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium">Role</label>
          <Select
            defaultValue={initialData.role}
            onValueChange={(value) => setValue("role", value as "SUPER_ADMIN" | "REGIONAL_ADMIN")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="REGIONAL_ADMIN">Regional Admin</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          <CountrySelect
            defaultValue={initialData.countryId}
            onChange={(value) => setValue("countryId", value)}
          />
          {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty}>Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditAdminPage;