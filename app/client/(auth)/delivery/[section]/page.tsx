"use client";

import NotFound from "@/app/not-found";
import { StoreGrid } from "@/components/client/store/storesGrid";
import Error from "@/components/ui/error";
import { useClientAuth } from "@/contexts/ClientAuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function AllStoresPage({ params }: { params: { section?: string } }) {
  const { section } = params;
  const [stores, setStores] = useState<
    { name: string; image: string | null; banner: string | null; description: string | null; uuid: string }[] | null
  >(null);
  const [sectionData, setSectionData] = useState<{ name: string; name_ar: string } | null>(null);
  const [error, setError] = useState(false);
  const { user } = useClientAuth();
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchStores() {
      if (!section) {
        console.error("No section provided");
        setError(true);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/stores/${section}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch stores:", response.status);
          setError(true);
          return;
        }

        const data = await response.json();
        if (data?.stores?.length > 0) {
          setStores(data.stores);
          setSectionData({ name: data.name, name_ar: data.name_ar });
        } else {
          console.error("No stores found in the response");
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching stores:", err);
        setError(true);
      }
    }

    fetchStores();
  }, [section, user.token]);

  if (error) {
    return (
      <Error />

    );
  }

  if (!stores) {
    return (
      <NotFound />
    );
  }

  return (
    <StoreGrid
      stores={stores}
      sectionName={language === "ar" ? sectionData?.name_ar || "" : sectionData?.name || ""}
    />
  );
}
