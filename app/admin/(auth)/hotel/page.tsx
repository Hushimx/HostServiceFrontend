import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import HotelsListingPage from './_components/hotels-listing-page';


export const metadata = {
  title: 'Hotels'
};



export default async function Page() {

  return <HotelsListingPage  />;
}
