import React from 'react'
import RoomsPage from './roomsFlow'

export default async  function page({params} :  {params : {hotelId : number}}) {
  let {hotelId} = await params
  return (
    <div>
      <RoomsPage hotelId={hotelId} />
    </div>
  )
}

