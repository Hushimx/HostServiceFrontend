'use client';

import React, { useEffect, useState, memo } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';

interface City {
  id: number;
  name: string;
  name_ar: string;
}

interface CitySelectProps {
  countryId: number | null;
  initialValue: number | null;
  onCityChange: (cityId: number | null) => void;
}

export const CitySelect: React.FC<CitySelectProps> = memo(({
  countryId,
  initialValue,
  onCityChange,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t,language } = useLanguage()

  useEffect(() => {
    if (!countryId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFromNest(`/admin/countries/${countryId}/cities?limit=0`);
        setCities(res.data);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [countryId]);

  const handleSelect = (value: string) => {
    const cityId = value ? Number(value) : null;
    onCityChange(cityId);
  };
  const selectedCity = cities.find((city) => city.id === initialValue);
  return (
    <Select
      onValueChange={handleSelect}
      value={initialValue?.toString() || ''}
      disabled={!countryId || isLoading}
    >
      <SelectTrigger>
        {isLoading
          ? t("common.loading")
          : initialValue
          ?  selectedCity ? language == "ar" ? selectedCity.name_ar : selectedCity.name : t("cities.selector.title")
          : t("cities.selector.title")}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{t("common.none")}</SelectItem>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id.toString()}>
            {language == "ar" ? city.name_ar : city.name}
            </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});

CitySelect.displayName = 'CitySelect'; // Required for memoized components
