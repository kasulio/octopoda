import * as React from "react";
import { Link, type LinkOptions } from "@tanstack/react-router";
import {
  ChartBarIcon,
  ImportIcon,
  LayoutDashboardIcon,
  ServerIcon,
  UsersIcon,
  WebhookIcon,
  type LucideIcon,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      linkOptions: {
        to: "/dashboard",
      },
      icon: LayoutDashboardIcon,
      isActive: true,
    },
    {
      title: "Instances",
      linkOptions: {
        to: "/dashboard/instances",
      },
      icon: ServerIcon,
    },
    {
      title: "Users",
      linkOptions: {
        to: "/dashboard/users",
      },
      icon: UsersIcon,
    },
    {
      title: "Grafana",
      linkOptions: {
        to: "/dashboard/grafana-embed",
      },
      icon: ChartBarIcon,
    },
    {
      title: "Import",
      linkOptions: {
        to: "/dashboard/import",
      },
      icon: ImportIcon,
    },
  ],
  navSecondary: [],
} satisfies Record<
  "navMain" | "navSecondary",
  {
    title: string;
    icon: LucideIcon;
    linkOptions: LinkOptions;
    isActive?: boolean;
  }[]
>;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                to="/"
                onClick={() => sidebar.isMobile && sidebar.setOpenMobile(false)}
              >
                <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                  <WebhookIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">Octopoda</span>
                  <span className="text-xs truncate">Analytics</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
