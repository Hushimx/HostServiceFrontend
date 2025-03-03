import { UUID } from "crypto";
import PurchaseFlowClient from "./PurchaseFlowClient"; // Client component handling the cart logic
import { e } from "nuqs/dist/serializer-D6QaciYt";
import { title } from "process";


// Server Component to Fetch Store and Hotel Info
export default async function PurchaseFlow({
  params,
}: {
  params: { storeId: UUID };
}) {
  const {storeId} = await params;




  return (
    <div>
      {/* Pass server-fetched params to the client component */}
      <PurchaseFlowClient  storeId={storeId} />
    </div>
  );
}
