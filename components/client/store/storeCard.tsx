import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

export function StoreCard({
    store,
  }: {
    store: {
      name: string;
      description: string;
      image: string; // Banner Image
      banner: string; // Store Logo
      uuid: string
    };
  }) {
    return (
        <Link href={`/client/store/${store.uuid}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative border border-gray-200">
        {/* Banner Section */}
        <div className="relative">
          <img
            src={getImageUrl(store.banner)}
            alt={`${store.name} banner`}
            className="w-full h-48 object-cover"
          />
  

  
          {/* Store Logo */}
          <div className="absolute -bottom-6 mx-5">
            <img
              src={getImageUrl(store.image)}
              alt={`${store.name} logo`}
              className="w-16 h-16 rounded-full border-4 border-white shadow-md"
            />
          </div>
        </div>
  
        {/* Store Details Section */}
        <div className="pt-8 px-4 pb-4">

  
          {/* Store Name */}
          <h2 className="text-lg font-bold text-gray-800 truncate">{store.name}</h2>
  
          {/* Description */}
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {store.description}
          </p>
          </div>

      </div>
      </Link>
    );
  }
  