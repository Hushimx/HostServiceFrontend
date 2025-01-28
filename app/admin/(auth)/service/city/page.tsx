import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import ListingPage from './_components/listing-page';


export const metadata = {
  title: 'City Services List'
};



export default async function Page() {

  return <ListingPage  />;
}
