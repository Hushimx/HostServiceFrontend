import ServicePage from "./serviceFlow";



export const metadata = {
  title: 'Service',
}
export default async function page({params}:any) 
  {
    const {serviceName} = await params;
  return (
    <div>
      <ServicePage slug={serviceName} />
    </div>
  )
}


