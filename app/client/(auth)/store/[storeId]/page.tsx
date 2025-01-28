import React from 'react'
import Store from './store'

async function page({params}:{params:{storeId:string}}) {
  const {storeId} = await params
  return (
    <div>
      <Store storeId={storeId}/>
    </div>
  )
}

export default page
