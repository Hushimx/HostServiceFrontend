import React from 'react'
import VendorsPage from './roomsFlow'

export default async  function page({params} :  {params : {hotelId : number}}) {
  return (
    <div>
      <VendorsPage  />
    </div>
  )
}

