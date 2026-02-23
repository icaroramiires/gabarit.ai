"use client"
import { signOut } from "next-auth/react"

import * as React from "react"
import {
    BookOpen,
    LayoutDashboard,
    Settings,
    CheckSquare,
    TrendingUp,
    User
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
        },
        {
            title: "Questões",
            url: "/questoes",
            icon: CheckSquare,
        },
        {
            title: "Materiais",
            url: "/materiais",
            icon: BookOpen,
        },
        {
            title: "Desempenho",
            url: "/desempenho",
            icon: TrendingUp,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <BookOpen className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">gabarit.ai</span>
                                <span className="truncate text-xs">Versão Alpha</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {data.navMain.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild tooltip={item.title}>
                                <a href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <User className="size-4" />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">Estudante</span>
                                <span className="truncate text-xs">Premium</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <Settings className="size-4" />
                            <span>Sair (Logout)</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
