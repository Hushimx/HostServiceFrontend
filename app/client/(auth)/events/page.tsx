"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { getImageUrl } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const EventList = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {t} = useLanguage();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          cache: "no-store",
          headers: {
            authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        res = await res.json();
        setEvents(res);
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const { language } = useLanguage();
  if (loading) {
    <Loading />;
  }

  if (!events.length && !loading) {
    return <p className="text-center mt-8 text-lg font-semibold">No events found.</p>;
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">{t("events.explore")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105"
            onClick={() => router.push(`/client/events/${event.id}`)}
          >
            {/* Event Image */}
            <img
              src={getImageUrl(event.image)}
              alt={event.title}
              className="w-full h-40 object-cover "
            />

            {/* Event Details */}
            <div className="p-4">
              <h2 className="text-xl font-semibold truncate">{language === "ar" ? event.title_ar : event.title}</h2>
              <p className="text-gray-600 text-sm mt-1 truncate">{event.address}</p>
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-60 transition-opacity"></div>

            {/* Call-to-Action Button */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
