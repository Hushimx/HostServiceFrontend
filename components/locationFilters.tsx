'use client';

import React, { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';

interface Country {
  id: number;
  name: string;
}

interface CountrySelectProps {
  onChange: (countryId: number | null) => void; // Allow null for "Select all"
  initialValue?: number | null;
  CountrySelectProps?: number | null;
}

interface City {
  id: number;
  name: string;
}

interface CitySelectProps {
  countryId: number | null; // The selected country ID
  initialValue?: number | null;
  onChange: (cityId: number | null) => void; // Allow null for "None selected"
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ onChange,initialValue }) => {
  console.log(initialValue)
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(initialValue || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:3333/admin/countries', {
          headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM1MTQyODMwLCJleHAiOjE3MzUyMjU2MzB9.fOcBmSJMk5FGrnXeSM1eeLUoohhAOHstNqHvUm0ZkRk`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data: Country[] = await response.json();

        setCountries(data);
                if(data.find((c) => c.id === initialValue)){
          setSelectedCountry(initialValue || null);
    
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();

  }, []);

  const handleSelect = (value: string) => {
    const countryId = value ? Number(value) : null; // Null for "Select all"
    setSelectedCountry(countryId);
    onChange(countryId);
  };
  console.log(selectedCountry)
  return (
    <Select onValueChange={handleSelect} value={selectedCountry?.toString() || ''}>
      <SelectTrigger>
        {isLoading ? 'Loading...' : selectedCountry ? `${countries.find((c) => c.id === selectedCountry)?.name}` : 'Select a Country'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Select all</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country.id} value={country.id.toString()}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const CitySelect: React.FC<CitySelectProps> = ({ countryId, onChange, initialValue }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setCities([]); // Reset cities if no country is selected
      setSelectedCity(null); // Reset selected city
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:3333/admin/countries/${countryId}/cities`, {
          headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoicml5YWRoLWFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzM1MTQyODMwLCJleHAiOjE3MzUyMjU2MzB9.fOcBmSJMk5FGrnXeSM1eeLUoohhAOHstNqHvUm0ZkRk`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch cities');
        const data: City[] = await response.json();
        setCities(data);

        // If initialValue exists and matches a city ID in the data, set it as selected
        if (initialValue && data.some((city) => city.id === initialValue)) {
          setSelectedCity(initialValue);
          onChange(initialValue); // Notify parent component of the selection
        } else {
          setSelectedCity(null); // Reset selection if initialValue doesn't match
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [countryId]);

  const handleSelect = (value: string) => {
    const cityId = value ? Number(value) : null; // Null for no selection
    setSelectedCity(cityId);
    onChange(cityId);
  };

  return (
    <Select
      onValueChange={handleSelect}
      value={selectedCity?.toString() || ''}
      disabled={!countryId || isLoading}
    >
      <SelectTrigger>
        {isLoading
          ? 'Loading...'
          : selectedCity
          ? `${cities.find((c) => c.id === selectedCity)?.name}`
          : 'Select a City'}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">None</SelectItem>
        {cities.map((city) => (
          <SelectItem key={city.id} value={city.id.toString()}>
            {city.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
