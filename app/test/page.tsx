'use client';

import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const AddEditorPage: React.FC = () => {
  const [editorContent, setEditorContent] = useState('');
  const [editorContentAr, setEditorContentAr] = useState(''); // State for Arabic description
  const { t } = useLanguage();
  const router = useRouter();

  // Handle content change in the editors
  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleEditorChangeAr = (content: string) => {
    setEditorContentAr(content);
  };

  // Submit the content (optional: save to backend)
  const handleSubmit = async () => {
    try {
      // Save the content if necessary (e.g., API call)
      toast.success(t('toast_success'));
      router.push('/dashboard/editor');
    } catch (err: any) {
      toast.error(t('toast_error'));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white text-card-foreground shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{t('editor_title')}</h1>

      {/* City Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium">{t('city_selector')}</label>
        <select className="w-full p-2 border rounded-md">
          <option>{t('city_placeholder')}</option>
          <option value="city1">{t('city_1')}</option>
          <option value="city2">{t('city_2')}</option>
        </select>
      </div>

      {/* Vendors Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium">{t('vendor_selector')}</label>
        <select className="w-full p-2 border rounded-md">
          <option>{t('vendor_placeholder')}</option>
          <option value="vendor1">{t('vendor_1')}</option>
          <option value="vendor2">{t('vendor_2')}</option>
        </select>
      </div>

      {/* Description (Force LTR) */}
      <div className="mb-4">
        <label className="block text-sm font-medium">{t('description')}</label>
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'ltr' }], // Force LTR for this field
            ],
          }}
          formats={[
            'header', 'font', 'align', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'indent', 'direction'
          ]}
          placeholder={t('description_placeholder')}
          style={{ backgroundColor: 'white' }} // Set background color to white
        />
      </div>

      {/* Description_ar (RTL) */}
      <div className="mb-4">
        <label className="block text-sm font-medium">{t('description_ar')}</label>
        <ReactQuill
          value={editorContentAr}
          onChange={handleEditorChangeAr}
          className='direction-ltr'
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['bold', 'italic', 'underline'],
              ['link', 'image'],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }], // RTL direction for Arabic
            ],
          }}
          formats={[
            'header', 'font', 'align', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'indent', 'direction'
          ]}
          placeholder={t('description_ar_placeholder')}
          style={{ backgroundColor: 'white' }} // Set background color to white
        />
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push('/dashboard/editor')}
        >
          {t("common.cancel")}
        </Button>
        <Button type="button" onClick={handleSubmit}>
          {t('save')}
        </Button>
      </div>
    </div>
  );
};

export default AddEditorPage;
