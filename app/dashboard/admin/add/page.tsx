"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
const addAdminSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  name: z.string().min(2, "Name must be at least 2 characters."),
  role: z.enum(["SUPER_ADMIN", "REGIONAL_ADMIN"], {
    required_error: "Role is required.",
  }),
  countryId: z.number(),
});

type AddAdminFormData = z.infer<typeof addAdminSchema>;

const AddAdminPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddAdminFormData>({
    resolver: zodResolver(addAdminSchema),
  });

  const onSubmit = async (data: AddAdminFormData) => {
    try {
      await fetchFromNest("/admin/admins", {
        method: "POST",
        body: data,
      });
      toast.success("Admin created successfully!");
      router.push("/dashboard/admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to create admin.");
    }
  };

  return (
    <div className="w-full p-8 max-w-3xl mx-auto shadow-secondary-lg rounded-md border bg-card text-card-foreground shadow">
      <h1 className="text-2xl font-bold mb-4">Add New Admin</h1>
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
          <Input type="password" {...register("password")} />
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
          <Select onValueChange={(value) => setValue("role", value as "SUPER_ADMIN" | "REGIONAL_ADMIN")}>
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
          <CountrySelect onChange={(value) => setValue("countryId", value)} />
          {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/admin")}>
            Cancel
          </Button>
          <Button type="submit">Create Admin</Button>
        </div>
      </form>
    </div>
  );
};

export default AddAdminPage;
