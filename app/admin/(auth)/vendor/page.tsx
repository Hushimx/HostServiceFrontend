import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import VendorListingPage from './_components/vendor-listing-page';


export const metadata = {
  title: 'Vendors'
};



export default async function Page() {

  return <VendorListingPage  />;
}
