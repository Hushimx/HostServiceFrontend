'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import PhoneInput from '@/components/ui/phoneInput';
import Logo from '@/components/logo';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';

export default function JoinRoomForm({ uuid }: { uuid: UUID }) {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState('SA');
  const Router = useRouter();
  async function sendUserData(uuid: UUID, fullPhoneNumber: string) {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/client/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid, phoneNumber: fullPhoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorCode = errorData?.code;

        if (errorCode === 'INVALID_ROOM_UUID') {
          toast.error(t('error_invalid_room_uuid'));
        } else {
          toast.error(t('errors.somethingWentWrong'));
        }

        throw new Error('Failed to join room');
      }

      return await response.json();
    } catch (err) {
      console.error('Error sending user data:', err);
      throw err;
    }
  }

  const handlePhoneChange = (fullPhoneNumber: string) => {
    setPhoneNumber(fullPhoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error(t('validation.missing_phone_number'));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await sendUserData(uuid, phoneNumber);
      localStorage.setItem('authToken', res.token);
      setCountryCode(res.code);
      toast.success(t('success.login'));
      await new Promise((res) => setTimeout(() => res(''), 1500));
      Router.push(`/client`);
    } catch {
      toast.error(t('errors.somethingWentWrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 px-4" style={{ height: 'calc(100vh - 76px)' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Logo */}
        <div className="w-full flex justify-center mb-4">
          <Logo />
        </div>

        {/* Title */}
        <h1 className="text-2xl my-5 font-bold text-gray-800 text-center mb-6">
          {t('common.login')}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t("common.phone")}
            </label>
            <PhoneInput
              allowedCountries={[countryCode]}
              onChange={handlePhoneChange}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-indigo-600 text-white font-semibold text-lg rounded-lg shadow-md transition duration-300 text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.loading') : t('common.send')}
          </button>
        </form>
      </div>
    </div>
  );
}
