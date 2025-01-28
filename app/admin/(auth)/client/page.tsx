import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import ClientListingPage from './_components/clients-listing-page';


export const metadata = {
  title: 'Clients'
};



export default async function Page() {

  return <ClientListingPage  />;
}
