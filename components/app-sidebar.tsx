"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar"

const getNavData = (user?: { name: string; email: string; avatar: string }) => ({
  user: user || {
    name: "User",
    email: "user@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Hosting Providers",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Reviews & Ratings",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Hosting Plans",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Provider Management",
      icon: IconUsers,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Add New Provider",
          url: "#",
        },
        {
          title: "Pending Approvals",
          url: "#",
        },
      ],
    },
    {
      title: "Content",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Expert Reviews",
          url: "#",
        },
        {
          title: "Comparison Articles",
          url: "#",
        },
      ],
    },
    {
      title: "Coupons & Deals",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Coupons",
          url: "#",
        },
        {
          title: "Expired Deals",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "User Feedback",
      url: "#",
      icon: IconReport,
    },
    {
      name: "SEO Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      name: "Hosting Knowledge Base",
      url: "#",
      icon: IconFileWord,
    },
  ],
})

export function AppSidebar({ 
  user,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user?: { name: string; email: string; avatar: string }
}) {
  const data = getNavData(user)
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Hosting Discount Platform</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
