import React from 'react'
import OrdersPage from './ordersFlow'

export default async  function page({params} :  {params : {storeId : number}}) {
  const {storeId} = await params;
  return (
    <div>
      <OrdersPage storeId={storeId}  />
    </div>
  )
}

