import { getImageUrl } from "@/lib/utils";

export function StoreHeader({ storeData }: { storeData: { storeName: string,image:string, banner: string } }) {
  return (
    <div className="relative bg-gray-100 shadow-lg">
      {/* Banner */}
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl(storeData.banner)})`,backgroundSize:"cover" }}>
        <div className="absolute inset-0 bg-black opacity-50" />

        {/* Store Info Card */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-md p-6 flex items-center gap-2 max-w-lg w-11/12">
          <img src={getImageUrl(storeData.image)} alt={storeData.storeName} className="w-12 h-12 rounded-full" />
          <h1 className="text-lg font-bold">{storeData.storeName}</h1>
        </div>
      </div>
    </div>
  );
}
