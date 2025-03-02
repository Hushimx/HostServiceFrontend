export default function CombinedServicesAndDelivery() {
  const services = [
    {
      title: "تنظيف الغرفة",
      icon: "/assets/icons/room-service.png", // Laundry icon
      link: "client/service/cleaning",
    },
    {
      title: "مغسلة الملابس" ,
      icon: "/assets/icons/laundry.png", // Room cleaning icon
      link: "client/service/laundry",
    },
    {
      title: "حجز طيران",
      icon: "/assets/icons/plane.png", // Airplane icon
      link: "https://wa.me/966596000912",
      target: "_blank",

    },
  ];

  const deliveryItems = [
    {
      title: "طلبات المطعم",
      description: "تشكيلة متنوعة من الأطعمة والوجبات.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
      alt: "طلبات المطعم",
      link: "/client/delivery/restaurants",
    },
    {
      title: "بقالة",
      description: "توفير احتياجات النزلاء من الأغذية والمشروبات.",
      image:
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800&auto=format&fit=crop",
      alt: "بقالة",
      link: "/client/delivery/groceries",
    },
    {
      title: "صيدلية",
      description: "توفير الأدوية ومستحضرات العناية الشخصية.",
      image:
        "https://plus.unsplash.com/premium_photo-1661776050248-bf49f31df5c7?q=80&w=800&auto=format&fit=crop",
      alt: "صيدلية",
      link: "/client/delivery/pharmacies",
    },
  ];

  return (
    <>
      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            خدماتنا
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <a
                key={index}
                href={service.link}
                target={service.target || ""}
                className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 "
              >
                <img
                  src={service.icon}
                  alt={service.title}
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700 text-center">
                  {service.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="py-16 container mx-auto">
        <h2 className="text-4xl font-extrabold text-center mb-14 tracking-wide">
          التوصيل
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {deliveryItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="relative rounded-xl overflow-hidden group shadow-lg transition-transform transform hover:scale-105"
              style={{ height: "400px" }}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.alt}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 transition-opacity"></div>
              {/* Text Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-lg">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
