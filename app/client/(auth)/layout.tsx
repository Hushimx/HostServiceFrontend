// client/(auth)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ClientAuthProvider } from "@/contexts/ClientAuthContext";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  // const authToken = cookies().then((res) => res.get('authToken'));

  // // Redirect to login if not authenticated
  // if (!authToken) {
  //   redirect('/login');
  // }

  return (
    <ClientAuthProvider >
      {children}
    </ClientAuthProvider>
  );
}