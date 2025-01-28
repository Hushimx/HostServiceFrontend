import { useLanguage } from "@/contexts/LanguageContext";

export default function EventsTeaser() {
    const { t } = useLanguage()
    return (
      <section className="relative py-12 bg-gray-100">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            {t("events.explore")}
          </h2>
          <a
            href="/client/events"
            className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            {t("events.see_events")}
          </a>
        </div>
      </section>
    );
  }
  