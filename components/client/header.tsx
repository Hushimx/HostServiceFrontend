'use client';
import { useState } from 'react';
import Link from 'next/link';
import Logo from '../logo';
import LanguageSelect from '../language-select';

export default function Header({logoHref = '/'}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header>
      <nav className="" style={{ backgroundColor: '#2e0937' }}>
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Logo href={logoHref} />
          <LanguageSelect btnClassName={"capitalize text-white "} /> {/* Add Language Select Component */}
        </div>
      </nav>
    </header>
  );
}
