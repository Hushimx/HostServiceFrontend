import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import DriversListingPage from './_components/drivers-listing-page';


export const metadata = {
  title: 'Drivers'
};



export default async function Page() {

  return <DriversListingPage  />;
}
