import { searchParamsCacheMaker, serializeMaker,adminsFiltering } from '@/lib/searchparams';
import { parseAsString, SearchParams } from 'nuqs/parsers';
import React from 'react';
import RoomsListingPage from './_components/rooms-listing-page';


export const metadata = {
  title: 'Dashboard : Vendors'
};



export default async function Page({params} :  {params : {hotelId : number}}) { 
  const {hotelId} = await params

  return <RoomsListingPage  hotelId={hotelId} />;
}
