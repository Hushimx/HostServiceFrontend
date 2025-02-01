"use client"
import React from 'react'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import AppSidebar from './app-sidebar'
import Header from './header'
import { useDashboardAuth } from '@/contexts/AdminAuthContext'

export default function AdminLayoutProvider({sidebarState,navItems,children}) {
    const { user,role } = useDashboardAuth()
    const Logout = async() => {
       const logout = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/logout`, { method: "POST",credentials: "include" }); 
       if (logout.ok) {
        window.location.href = "/admin/signin";
       }

      }

  return (
    <SidebarProvider defaultOpen={sidebarState}>
    <AppSidebar navItems={navItems} user={user} role={role} logout={Logout} />
    <SidebarInset>
      <Header user={user}  logout={Logout} />
      {/* page main content */}
      {children}
      {/* page main content ends */}
    </SidebarInset>
  </SidebarProvider>
  )
}
