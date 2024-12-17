"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/locationFilters";
import { CitySelect } from "@/components/locationFilters";
import { toast } from "sonner";
import { fetchFromNest } from "@/hooks/useFetch";
import Loading from "@/components/ui/loading";
import Error from "@/components/ui/error";

// Validation schema for editing hotels
const editHotelSchema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters."),
  cityId: z.number({
    required_error: "City is required.",
    invalid_type_error: "City must be selected.",
  }),
  location: z.string().min(5, "Location must be at least 5 characters."),
  neighborhood: z.string().min(3, "Neighborhood must be at least 3 characters."),
});

type EditHotelFormData = z.infer<typeof editHotelSchema>;

const EditHotelPage: React.FC = () => {
  const { hotelId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<EditHotelFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditHotelFormData>({
    resolver: zodResolver(editHotelSchema),
    mode: "onChange",
  });

  const watchedFields = watch();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setError(null); // Reset error state
        const hotel = await fetchFromNest(`/admin/hotels/${hotelId}`);
        setInitialData(hotel);

        // Prepopulate form fields
        setValue("name", hotel.name);
        setValue("cityId", hotel.cityId);
        setValue("location", hotel.location);
        setValue("neighborhood", hotel.neighborhood);
      } catch (err: any) {
        setError("Failed to fetch hotel data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId, setValue]);

  const onSubmit = async (data: EditHotelFormData) => {
    const updateBody: Partial<EditHotelFormData> = {};

    if (watchedFields.name !== initialData?.name) updateBody.name = data.name;
    if (watchedFields.location !== initialData?.location) updateBody.location = data.location;
    if (watchedFields.neighborhood !== initialData?.neighborhood) updateBody.neighborhood = data.neighborhood;
    if (watchedFields.cityId !== initialData?.cityId) updateBody.cityId = data.cityId;

    if (Object.keys(updateBody).length > 0) {
      try {
        await fetchFromNest(`/admin/hotels/${hotelId}`, {
          method: "PATCH",
          body: updateBody,
        });
        toast.success("Hotel updated successfully!");
        router.push("/dashboard/hotels");
      } catch (error: any) {
        toast.error(error.message || "Failed to update hotel.");
      }
    } else {
      toast.info("No changes to update.");
    }
  };

  if (loading) return <Loading message="Fetching hotel details..." />;
  if (error) return <Error message={error} onRetry={() => location.reload()} />;

  return (
    <div className="w-full p-8 max-w-3xl mx-auto shadow-secondary-lg rounded-md border bg-card text-card-foreground shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Hotel</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hotel Name */}
        <div>
          <label className="block text-sm font-medium">Hotel Name</label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Country and City */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          <CountrySelect
            initialValue={initialData?.city.countryId}
            onChange={() => setValue("cityId", null)}
          />

        </div>
        <div>
          <label className="block text-sm font-medium">City</label>
          <CitySelect
            initialValue={initialData?.cityId}
            countryId={initialData?.cityId}
            onChange={(cityId) => setValue("cityId", cityId)}
          />

        </div>
        {/* Location */}
        <div>
          <label className="block text-sm font-medium">Location</label>
          <Input type="text" {...register("location")} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        {/* Neighborhood */}
        <div>
          <label className="block text-sm font-medium">Neighborhood</label>
          <Input type="text" {...register("neighborhood")} />
          {errors.neighborhood && <p className="text-red-500 text-sm">{errors.neighborhood.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard/hotels")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditHotelPage;
