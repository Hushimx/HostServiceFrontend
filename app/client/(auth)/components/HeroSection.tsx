export default function HeroSection({ hotelName = "Dream Stay Hotel", roomNumber = "101" }) {
    return (
      <section className="container mx-auto relative">
        {/* Welcome Message above the banner */}
        <div className="flex items-center justify-between mb-5 p-4 bg-white bg-opacity-80 shadow-md rounded-t-md">
          <h1 className="text-xl font-bold text-purple-900">
            مرحباً بكم في {hotelName}!
          </h1>
          <p className="text-lg font-semibold text-gray-600">
            غرفة رقم: <span className="text-yellow-600">{roomNumber}</span>
          </p>
        </div>
  
        {/* Hero Background Image */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/1000x400"
            alt="Hero Banner"
            className="w-full h-[550px] object-cover rounded-md shadow-lg"
          />
        </div>
      </section>
    );
  }
  