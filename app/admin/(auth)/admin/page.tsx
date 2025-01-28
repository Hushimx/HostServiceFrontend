import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import HotelsListingPage from './_components/admin-listing-page';


export const metadata = {
  title: 'Admins'
};



export default async function Page() {

  return <HotelsListingPage  />;
}
