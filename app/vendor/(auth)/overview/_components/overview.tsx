"use client";
import React, { useEffect, useState } from "react";
import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchFromNest } from "@/hooks/useFetch";
import { useDashboardAuth } from "@/contexts/AdminAuthContext";

export default function OverViewPage() {
  const { t } = useLanguage(); // Access translations

  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch data from the backend
    const fetchOverviewData = async () => {
      setLoading(true);
      setError(null); // Reset error state
      try {
        const data = await fetchFromNest(
          `/vendor/overview`
        );
        setOverviewData(data);
      } catch (error) {
        setError("Error fetching overview data. Please try again.");
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-medium">{t("common.loading") || "Loading..."}</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-medium text-red-500">{error}</p>
        </div>
      </PageContainer>
    );
  }

  if (!overviewData) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl font-medium">
            {t("overview.error.no_data") || "No data available."}
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {t("overview.table.welcome_back") || "Hi, Welcome back 👋"}
          </h2>

        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              {t("overview.table.overview")}
            </TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              {t("overview.table.analytics")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {/* Overview Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("overview.table.totalRevenue")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                  {overviewData.currency} {overviewData.totalRevenue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                     {t("overview.table.totalRevenue_description")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("overview.table.deliveryOrdersCount") ||
                      "Delivery Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData.deliveryOrdersCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("overview.table.deliveryOrdersCount_description")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("overview.table.serviceOrdersCount") ||
                      "Service Orders"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData.serviceOrdersCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("overview.table.serviceOrdersCount_description")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("overview.table.totalClients") || "Total Clients"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {overviewData.totalClients}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("overview.table.totalClients_description")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
