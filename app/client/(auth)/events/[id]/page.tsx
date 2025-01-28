"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getImageUrl } from "@/lib/utils";
import Error from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();
  const Router = useRouter()
  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
          cache: "no-store",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            // No event found
            setEvent(null);
          } else {
            throw new Error("Failed to fetch event details");
          }
        } else {
          const data = await response.json();
          if (Object.keys(data).length === 0) {
            setEvent(null);
          } else {
            setEvent(data);
          }
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!event) {
    return <Error message="Event not found" />;
  }

  return (
    <div className="p-4 space-y-4 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="border-b pb-2 flex justify-between">
        <div>
        <h1 className="text-2xl font-bold text-gray-800">{language === "ar" ? event.title_ar : event.title}</h1>
        <p className=" text-gray-600 text-md mt-1">
          {t("common.address")}: {event.address}
        </p>
        </div>
        <Button onClick={() => Router.push('/client/events')}>
          {t("common.back")}
        </Button>
      </div>

      {/* Image Section */}
      <div>
        <img
          src={getImageUrl(event.image)} // Use actual image URL or fallback
          alt="Event"
          className="w-full h-48 object-contain rounded-lg"
        />
      </div>

      {/* Description Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">{t("events.about")}</h2>
        <p
          className="text-sm text-gray-700 mt-2 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: language === "ar" ? event.description_ar : event.description,
          }}
        ></p>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {
          event.locationUrl && (
            <a
              href={event.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              {t("events.go_to_location")}
            </a>
          )
        }

      </div>
    </div>
  );
};

export default EventDetails;
