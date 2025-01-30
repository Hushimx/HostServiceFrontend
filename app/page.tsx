import Header from "@/components/client/header";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Page() {
  const { t } = useLanguage();

  return (
    <>
      {<Header />}
      {/* Hero Section */}
      <section id="hero" className="relative h-[75vh] flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover z-[-1]"
          autoPlay
          muted
          loop
        >
          <source src="/assets/landingPageHero.mp4" type="video/mp4" />
          {t("landing.video_not_supported")}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4b0a53]/90 to-[#2e0937]/90 z-0"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">{t("landing.welcome")}</h1>
          <p className="text-xl font-medium">{t("landing.subtitle")}</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-[#4b0a53] py-20 text-center">
        <h2 className="text-4xl font-bold mb-12">{t("landing.services_title")}</h2>
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            { icon: "🍽️", title: t("landing.restaurant_orders"), description: t("landing.restaurant_description") },
            { icon: "💊", title: t("landing.pharmacy"), description: t("landing.pharmacy_description") },
            { icon: "🧺", title: t("landing.laundry"), description: t("landing.laundry_description") },
            { icon: "🛒", title: t("landing.market"), description: t("landing.market_description") },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white text-[#4b0a53] p-8 rounded-xl shadow-md transform transition-transform hover:scale-105"
            >
              <div className="text-5xl mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-[#f8f9fa] text-[#4b0a53] py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">{t("landing.about_title")}</h2>
              <p className="text-lg leading-relaxed">{t("landing.about_description")}</p>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src="/assets/images/aboutus.jpg"
                alt={t("landing.about_alt")}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section id="join-us" className="bg-[#2e0937] text-white py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">{t("landing.join_us_title")}</h2>
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto">
          {[
            {
              bg: "url('/assets/images/driver.png')",
              title: t("landing.driver"),
              description: t("landing.driver_description"),
            },
            {
              bg: "url('/assets/images/vendor.png')",
              title: t("landing.vendor"),
              description: t("landing.vendor_description"),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="relative bg-cover bg-center rounded-xl shadow-lg transform transition-transform hover:scale-105 h-80 flex items-center justify-center"
              style={{ backgroundImage: item.bg }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#4b0a53]/50 to-[#000]/50 rounded-xl"></div>
              <div className="relative text-center">
                <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-lg mb-6">{item.description}</p>
                <button className="px-8 py-3 bg-[#f1c40f] text-[#4b0a53] font-bold rounded-lg">
                  {t("landing.coming_soon")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-[#4b0a53] py-16 text-center">
        <h2 className="text-4xl font-bold mb-8">{t("landing.contact_title")}</h2>
        <a
          href="mailto:hostarabian@gmail.com"
          className="inline-block bg-white text-[#4b0a53] font-bold py-3 px-6 rounded-lg mb-4 shadow-md hover:shadow-lg"
        >
          hostarabian@gmail.com
        </a>
        <br />
        <a
          href="https://wa.me/00966509236360"
          target="_blank"
          className="inline-block bg-white text-[#4b0a53] font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg"
        >
          {t("landing.whatsapp")}: 00966509236360
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#4b0a53] text-white py-6 text-center">
        <p className="text-lg font-medium">
          &copy; 2024 {t("landing.footer_rights")}
        </p>
        <p className="mt-2">
          {t("landing.contact_us")}:{" "}
          <a href="mailto:hostarabian@gmail.com" className="text-[#f1c40f] underline">
            hostarabian@gmail.com
          </a>
        </p>
      </footer>
    </>
  );
}
