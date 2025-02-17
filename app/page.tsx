"use client";
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
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4b0a53]/90 to-[#2e0937]/90 z-0"></div>
        <div className="relative text-center text-white z-10">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">مرحبًا بكم في هوست</h1>
          <p className="text-xl font-medium">خدمات الضيافة الفندقية والسياحية لتجربة نزلاء فريدة.</p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-[#4b0a53] py-20 text-center">
        <h2 className="text-4xl font-bold mb-12">خدماتنا</h2>
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {[
            { icon: '🍽️', title: 'طلبات المطعم', description: 'تشكيلة متنوعة من الأطعمة والوجبات.' },
            { icon: '💊', title: 'صيدلية', description: 'توفير الأدوية ومستحضرات العناية.' },
            { icon: '🧺', title: 'مغسلة ملابس', description: 'خدمة غسيل وكي الملابس للنزلاء.' },
            { icon: '🛒', title: 'ماركت', description: 'توفير احتياجات النزلاء من الأغذية.' },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white text-[#4b0a53] p-8 rounded-xl shadow-md transform transition-transform hover:scale-105 "
            >
              <div className="text-5xl mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      {/* Updated About Us Section */}
      <section id="about" className="bg-[#f8f9fa] text-[#4b0a53] py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Text Section (Left Side) */}
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-bold mb-6">من نحن</h2>
              <p className="text-lg leading-relaxed">
                برنامج هوست هو برنامج إلكتروني متطور متخصص في تقديم خدمات الضيافة الفندقية والسياحية. نساعد المنشآت على
                تحسين خدماتها وتوفير الراحة للنزلاء من خلال حلول مبتكرة وسهلة الاستخدام.
              </p>
            </div>

            {/* Image Section (Right Side) */}
            <div className="w-full md:w-1/2">
              <img
                src="/assets/images/aboutus.jpg" // Replace with your image URL
                alt="من نحن"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>


      {/* Join Us Section */}
      <section id="join-us" className="bg-[#2e0937] text-white py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">انضم إلينا</h2>
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto">
          <div
            className="relative bg-cover bg-center rounded-xl shadow-lg transform transition-transform hover:scale-105 h-80 flex items-center justify-center"
            style={{ backgroundImage: "url('/assets/images/driver.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4b0a53]/50 to-[#000]/50 rounded-xl"></div>
            <div className="relative text-center">
              <h3 className="text-3xl font-bold mb-4">سائق</h3>
              <p className="text-lg mb-6">انضم إلينا كسائق لتقديم أفضل خدمات التوصيل وضمان رضا العملاء.</p>
              <button className="px-8 py-3 bg-[#f1c40f] text-[#4b0a53] font-bold rounded-lg">
                قريبًا
              </button>
            </div>
          </div>
          <div
            className="relative bg-cover bg-center rounded-xl shadow-lg transform transition-transform hover:scale-105 h-80 flex items-center justify-center"
            style={{ backgroundImage: "url('/assets/images/vendor.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4b0a53]/50 to-[#000]/50 rounded-xl"></div>
            <div className="relative text-center">
              <h3 className="text-3xl font-bold mb-4">بائع</h3>
              <p className="text-lg mb-6">كن شريكًا لبناء تجربة تسوق رائعة مع خدماتنا.</p>
              <button className="px-8 py-3 bg-[#f1c40f] text-[#4b0a53] font-bold rounded-lg">
                قريبًا
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-[#4b0a53] py-16 text-center">
        <h2 className="text-4xl font-bold mb-8">تواصل معنا</h2>
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
          واتساب: 00966509236360
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-[#4b0a53] text-white py-6 text-center">
        <p className="text-lg font-medium">&copy; 2024 برنامج هوست. جميع الحقوق محفوظة.</p>
        <p className="mt-2">تواصل معنا: <a href="mailto:hostarabian@gmail.com" className="text-[#f1c40f] underline">hostarabian@gmail.com</a></p>
      </footer>
    </>
  );
}