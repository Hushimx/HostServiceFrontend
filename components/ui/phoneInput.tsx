import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CountriesCodes } from '@/constants/data';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhoneInputProps {
  allowedCountries?: string[]; // Optional: Restrict to specific countries
  onChange?: (fullPhoneNumber: string) => void; // Callback for the full phone number
  initialCountryCode?: string; // Default selected country
  initialPhoneNumber?: string; // Full initial phone number (with country code)
  className?: string; // Additional styles
}
const PhoneInput: React.FC<PhoneInputProps> = ({
  allowedCountries,
  onChange,
  initialCountryCode,
  initialPhoneNumber = '', // Full phone number including country code
  className = '',
}) => {
  const filteredCountries = allowedCountries
    ? CountriesCodes.filter((c) => allowedCountries.includes(c.code))
    : CountriesCodes;

  const initialCountry = initialCountryCode
    ? filteredCountries.find((c) => c.code === initialCountryCode) || filteredCountries[0]
    : filteredCountries[0];

  const { t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Parse initialPhoneNumber
  useEffect(() => {
    if (initialPhoneNumber) {
      const matchedCountry = filteredCountries.find((country) =>
        initialPhoneNumber.startsWith(country.dial_code)
      );

      if (matchedCountry) {
        setSelectedCountry(matchedCountry);
        setPhoneNumber(
          initialPhoneNumber.replace(matchedCountry.dial_code, '') // Remove dial code from the number
        );
      }
    }
  }, [initialPhoneNumber, filteredCountries]);

  const handleCountryChange = (code: string) => {
    const country = filteredCountries.find((c) => c.code === code);
    if (country) {
      setSelectedCountry(country);
      if (onChange) {
        if (!phoneNumber) {
          onChange('');
        } else {
          onChange(`${country.dial_code}${phoneNumber}`);
        }
      }
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow digits only

    // Restrict the first digit dynamically based on selectedCountry.startDigit
    const allowedStartDigit = selectedCountry.startDigit; // Dynamically fetched
    if (value && allowedStartDigit && !value.startsWith(allowedStartDigit)) {
      return; // Ignore input if the first digit doesn't match
    }

    setPhoneNumber(value);
    if (onChange) {
      if (!value) {
        onChange('');
      } else {
        onChange(`${selectedCountry.dial_code}${value}`);
      }
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Country Selector */}
      <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-28 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {filteredCountries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="mr-2">{country.flag}</span>
              ({country.dial_code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Phone Number Input */}
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={t('common.placeholders.phone')}
        minLength={selectedCountry.minLength}
        maxLength={selectedCountry.maxLength}
        className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default PhoneInput;

