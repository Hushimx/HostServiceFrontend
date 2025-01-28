import { CartProvider } from "@/contexts/CartContext";


export default function StoreLayout({ children }: { children: React.ReactNode }) {
  // const authToken = cookies().then((res) => res.get('authToken'));

  // // Redirect to login if not authenticated
  // if (!authToken) {
  //   redirect('/login');
  // }

  return (
    <CartProvider >
      {children}
    </CartProvider>
  );
}