import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import OrdersListingPage from './_components/listing-page';


export const metadata = {
  title: 'Service Orders List'
};



export default async function Page() {

  return <OrdersListingPage  />;
}
