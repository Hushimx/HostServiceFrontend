// Import necessary components
import Header from "@/components/client/header";
import PageContainer from "@/components/layout/page-container";
import FooterNav from "@/components/client/footer-nav"; // Assuming FooterNav is in this path

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
        <div className="flex-grow client-conatiner">{children}</div>

      {/* Footer Navigation */}
      <FooterNav />
    </div>
  );
}
