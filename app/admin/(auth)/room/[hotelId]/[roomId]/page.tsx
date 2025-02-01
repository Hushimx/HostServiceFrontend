'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fetchFromNest } from '@/hooks/useFetch';
import Loading from '@/components/ui/loading';
import Error from '@/components/ui/error';
import { useLanguage } from '@/contexts/LanguageContext';

const EditRoomPage: React.FC = () => {
  const { hotelId, roomId } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<any>({});

  const EditRoomSchema = Yup.object().shape({
    roomNumber: Yup.string().required(t('common.validation.required')),
    type: Yup.string().required(t('common.validation.required')),
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const room = await fetchFromNest(`/admin/rooms/${hotelId}/${roomId}`);
        setOriginalData(room);
        formik.setValues({
          roomNumber: room.roomNumber,
          type: room.type,
        }, false);
      } catch (err) {
        setError(t('failed_fetch_room_data'));
        toast.error(t('error.fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [hotelId, roomId]);

  const formik = useFormik({
    initialValues: {
      roomNumber: '',
      type: '',
    },
    validationSchema: EditRoomSchema,
    onSubmit: async (values) => {
      const modifiedFields = Object.entries(values).reduce((acc, [key, value]) => {
        if (originalData[key] !== value) {
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<typeof values>);

      if (Object.keys(modifiedFields).length === 0) {
        toast.info(t('no_changes_made'));
        return;
      }

      try {
        await fetchFromNest(`/admin/rooms/${hotelId}/${roomId}`, {
          method: 'PATCH',
          body: modifiedFields,
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success(t('success.update'));
      } catch (err) {
        toast.error(t('error.update'));
      }
    },
    enableReinitialize: true,
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-card text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('rooms.table.edit_room')}</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">{t('room.header.number')}</label>
          <Input
            name="roomNumber"
            value={formik.values.roomNumber}
            onChange={formik.handleChange}
            placeholder={t('room.header.number')}
          />
          {formik.errors.roomNumber && formik.touched.roomNumber && (
            <p className="text-sm text-red-500">{formik.errors.roomNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">{t('room.header.type')}</label>
          <Input
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            placeholder={t('room.header.type')}
          />
          {formik.errors.type && formik.touched.type && (
            <p className="text-sm text-red-500">{formik.errors.type}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" 
          type="button"
          onClick={() => router.push(`/admin/room/${hotelId}`)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={!formik.dirty || formik.isSubmitting}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditRoomPage;
