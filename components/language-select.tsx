"use client";
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming you have a language context
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from './ui/dropdown-menu';

export default function LanguageSelect({btnClassName}) {
  const { language, setLanguage } = useLanguage(); // Use language context or similar logic

  // On component mount, check for the language in local storage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language'); // Get the language from local storage
    if (savedLanguage) {
      setLanguage(savedLanguage as 'en' | 'ar'); // Set the language from local storage
    }
  }, [setLanguage]);

  const handleChange = (lang) => {
    setLanguage(lang); // Update the language in your context
    localStorage.setItem('language', lang); // Store the language in local storage
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={btnClassName ? btnClassName : "capitalize text-sidebar-primary "  }>
          {language === 'en' ? 'English' : 'العربية'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleChange('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('ar')}>العربية</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}