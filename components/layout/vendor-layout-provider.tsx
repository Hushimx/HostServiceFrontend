"use client"
import React from 'react'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import AppSidebar from './app-sidebar'
import Header from './header'
import { useVendorAuth } from '@/contexts/vendorAuthContext'

export default function VendorLayoutProvider({sidebarState,navItems,children}) {
    const { user,role } = useVendorAuth()

  return (
    
    <SidebarProvider defaultOpen={sidebarState}>
    <AppSidebar navItems={navItems} user={user} role={role} />
    <SidebarInset>
      <Header user={user} />
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </SidebarInset>
  </SidebarProvider>
  )
}
