'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchFromNest } from '@/hooks/useFetch';
import { useLanguage } from '@/contexts/LanguageContext';

interface Country {
  id: number;
  name: string;
  name_ar: string
}

interface CountrySelectProps {
  selectedCountry: number | null;
  onCountryChange: (countryId: number | null) => void;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  selectedCountry,
  onCountryChange,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t,language } = useLanguage()
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const data = await fetchFromNest('/admin/countries');
        setCountries(data);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSelect = (value: string) => {
    const countryId = value ? Number(value) : null;
    onCountryChange(countryId);
  };
  const selectedcountryFound = countries.find((c) => c.id === selectedCountry)

  return (
    <Select
      onValueChange={handleSelect}
      value={selectedCountry?.toString() || ''}
      disabled={isLoading}
    >
      <SelectTrigger>
        {isLoading
          ? t("common.loading")
          : selectedcountryFound ? (language == "ar" ? selectedcountryFound.name_ar : selectedcountryFound.name) : t("countrys.selector.title")}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">{t("common.none")}</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country.id} value={country.id.toString()}>
            {language == "ar" ? country.name_ar : country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
