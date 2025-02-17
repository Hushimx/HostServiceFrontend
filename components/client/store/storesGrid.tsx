import { StoreCard } from "@/components/client/store/storeCard";
import { useLanguage } from "@/contexts/LanguageContext";

export function StoreGrid({
  stores,
  sectionName,
}: {
  stores: { name: string; image: string | null; banner: string | null; description: string | null; uuid: string }[];
  sectionName: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="sticky top-0 bg-gray-100 z-10">
          <h1 className="text-3xl font-bold mb-6 py-4">{sectionName}</h1>
        </div>
        {stores.length === 0  ? (
        <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="sticky top-0 bg-gray-100 z-10">
            <h1 className="text-3xl font-bold mb-6 py-4 text-center">{t("store.no_stores")}</h1>
          </div>
        </div>
      </div>
        ):(
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard key={store.uuid} store={store} />
          ))}
        </div>
        )

        }
      </div>
    </div>
  );
}
