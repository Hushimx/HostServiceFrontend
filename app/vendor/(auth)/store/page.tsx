import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import ListingPage from './_components/listing-page';


export const metadata = {
  title: 'Products'
};



export default async function Page({params} :  {params : {id : String}}) {
  const { id } = await params
  return <ListingPage />;
}
