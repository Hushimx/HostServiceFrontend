"use client"; // Required for Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const offersSlides = [
  { id: 2, image: "/assets/images/offer2.png", title: "عرض 2", link: "https://google.com" },
  { id: 1, image: "/assets/images/offer1.png", title: "عرض 1", link: "https://google.com" },
  { id: 3, image: "/assets/images/offer3.png", title: "عرض 3", link: "https://google.com" },  
  { id: 3, image: "/assets/images/offer3.png", title: "عرض 3", link: "https://google.com" },
];

export default function OffersSection() {
  return (
    <section className="py-10  text-primary">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">عروض رهيبة ومميزات كثيرة</h2>
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-[-50px] left-4 flex items-center gap-2 z-10 md:flex hidden">
            {/* Left Button */}
            <button className="offers-button-prev w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-600 disabled:opacity-50 disabled:pointer-events-none">
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            {/* Right Button */}
            <button className="offers-button-next w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center shadow hover:bg-purple-600 disabled:opacity-50 disabled:pointer-events-none">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Swiper */}
          <Swiper
            slidesPerView="auto" // Automatically adjusts slide width
            spaceBetween={16} // Space between slides
            navigation={{
              nextEl: ".offers-button-next",
              prevEl: ".offers-button-prev",
            }}
            modules={[Navigation]}
            dir="rtl"
            breakpoints={{
              0: {
                slidesPerView: 1.2, // Show slightly more than one slide for small screens
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 1.5, // Slightly more than 1 slide on larger phones
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2.2, // Show slightly more than 2 slides on tablets
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.2, // Show slightly more than 3 slides on desktops
                spaceBetween: 30,
              },
            }}
            className="mySwiper"
          >
            {offersSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative rounded-lg overflow-hidden">
                <a href={slide.link}>
                   {/* Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full object-cover rounded-lg"
                  />


                    </a>                
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
