"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CountrySelect } from "@/components/locationFilters";

// Define the validation schema with Zod
const adminFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  name: z.string().min(2, "First Name must be at least 2 characters."),
  role: z.enum(["SUPER_ADMIN", "REGIONAL_ADMIN"], {
    required_error: "Role is required.",
  }),
  countryId: z.string().nonempty("Please select a valid country."),
});

type AdminFormData = z.infer<typeof adminFormSchema>;

interface AdminEditingFormProps {
  initialData?: Partial<AdminFormData>; // `initialData` is optional for creation forms
  onSubmit: (data: Partial<AdminFormData>) => void;
  onCancel: () => void;
}

const AdminEditingForm: React.FC<AdminEditingFormProps> = ({ initialData = {}, onSubmit, onCancel }) => {
  const isEditing = !!initialData.email; // Determine if this is an editing form
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set()); // Track altered fields

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: initialData,
  });

  // Watch values to track changes in inputs
  const watchedFields = watch();

  // Handle form submission
  const submitHandler = (data: AdminFormData) => {
    if (isEditing) {
      // Filter out untouched fields for editing
      const alteredData = Array.from(touchedFields).reduce((acc, field) => {
        acc[field as keyof AdminFormData] = data[field as keyof AdminFormData];
        return acc;
      }, {} as Partial<AdminFormData>);

      if (Object.keys(alteredData).length === 0) {
        toast.info("No changes made.");
        return;
      }

      onSubmit(alteredData);
    } else {
      // Submit all data for creation
      onSubmit(data);
    }
  };

  // Handle value changes and track touched fields
  const handleChange = (fieldName: string, value: any) => {
    setValue(fieldName as keyof AdminFormData, value);
    setTouchedFields((prev) => new Set(prev).add(fieldName)); // Mark the field as touched
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <Input
          type="text"
          {...register("email")}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium">Password</label>
        <Input
          type="password"
          placeholder="Enter new password"
          {...register("password")}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium">First Name</label>
        <Input
          type="text"
          {...register("name")}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <Select
          defaultValue={initialData.role || ""}
          onValueChange={(value) => handleChange("role", value)}
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

      {/* Country ID */}
      <div>
        <label className="block text-sm font-medium">Country</label>
        <CountrySelect
          onChange={(countryId) => handleChange("countryId", String(countryId))}
          defaultValue={initialData.countryId || ""}
        />
        {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId.message}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Save Changes" : "Create Admin"}</Button>
      </div>
    </form>
  );
};

export default AdminEditingForm;
