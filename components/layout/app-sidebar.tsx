'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsLeft,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import Logo from '../logo';
import { useDashboardAuth } from '@/contexts/AdminAuthContext';
import { hasPermission } from '@/lib/rbac';
import { useLanguage } from '@/contexts/LanguageContext';



export default function AppSidebar({user,navItems,role,logout}) {
  
  const pathname = usePathname();
  const { language,t } = useLanguage();
  const { toggleSidebar,state } = useSidebar();

  const [sidebarPostion, setSidebarPostion] = React.useState<'left' | 'right'>('right');
  React.useEffect(() => {
  
    setSidebarPostion(language === 'ar' ? 'right' : 'left');
  } , [language]);
  return (
    <Sidebar collapsible="icon" side={sidebarPostion} onMouseEnter={()=>{
      if(state == "collapsed") toggleSidebar()
    }}

 
    
    >
      <SidebarHeader>

       <div className="flex justify-center">
       <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>{t("overview.table.overview")}</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              if(item.permission &&!hasPermission(role, item.permission)) return
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span className='text-lg'>{t(`nav.${item.title}`) || item.title}</span>
                        {language !== 'ar' ?
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        :
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        }
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{t(`nav.${subItem.title}`) || subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span className=' text-lg'>{t(`nav.${item.title}`) || item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={ ''}
                      alt={''}
                    />
                    <AvatarFallback className="rounded-lg">
                    {user.name[0]}

                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                    {user.name}
                    </span>
                    <span className="truncate text-xs">
                    {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={''}
                        alt={ ''}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">
                        {' '}
                        {user.email}

                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {/* <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem> */}


                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
