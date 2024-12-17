"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/locationFilters";
import { CitySelect } from "@/components/locationFilters";
import { fetchFromNest } from "@/hooks/useFetch";
import { toast } from "sonner";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";

// Validation schema for hotel creation
const createHotelSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters."),
  countryId: z.number({
    required_error: "Country is required.",
    invalid_type_error: "Country must be selected.",
  }),
  cityId: z.number({
    required_error: "City is required.",
    invalid_type_error: "City must be selected.",
  }),
  address: z.string().min(5, "Address must be at least 5 characters."),
  locationUrl: z
    .string()
    .url("Please enter a valid URL.")
    .optional(),
});

type CreateHotelFormData = z.infer<typeof createHotelSchema>;

const CreateHotelPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateHotelFormData>({
    resolver: zodResolver(createHotelSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);

  const onSubmit = async (data: CreateHotelFormData) => {
    try {
      setLoading(true);
      setError(null);

      await fetchFromNest("/admin/hotels", {
        method: "POST",
        body: data,
      });

      toast.success("Hotel created successfully!");
      setTimeout(() => {
        router.push("/dashboard/hotels");
      },2000)
    } catch (err: any) {
      setError(err.message || "Failed to create hotel.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Creating hotel..." />;
  if (error) return <Error message={error} onRetry={() => setError(null)} />;

  return (
    <div className="w-full p-8 max-w-3xl mx-auto shadow-secondary-lg rounded-md border bg-card text-card-foreground shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Hotel</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hotel Name */}
        <div>
          <label className="block text-sm font-medium">Hotel Name</label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          <CountrySelect
            onChange={(countryId) => {
              setSelectedCountry(countryId);
              setValue("countryId", countryId); // Set countryId for form submission
            }}
          />
          {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId.message}</p>}
        </div>

        {/* City Selection */}
        {selectedCountry && (
          <div className="mt-4">
            <label className="block text-sm font-medium">City</label>
            <CitySelect
              countryId={selectedCountry}
              onChange={(cityId) => setValue("cityId", cityId)} // Set cityId for form submission
            />
            {errors.cityId && <p className="text-red-500 text-sm">{errors.cityId.message}</p>}
          </div>
        )}

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <Input type="text" {...register("address")} />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Location URL */}
        <div>
          <label className="block text-sm font-medium">Location URL</label>
          <Input type="url" {...register("locationUrl")} placeholder="https://example.com" />
          {errors.locationUrl && <p className="text-red-500 text-sm">{errors.locationUrl.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/hotels")}>
            Cancel
          </Button>
          <Button type="submit" className="text-white">Create Hotel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateHotelPage;
