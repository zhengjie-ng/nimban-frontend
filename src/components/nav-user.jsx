import GlobalContext from "@/context/GlobalContext"
import { useContext } from "react"
import { Link } from "react-router-dom"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({ user = {} }) {
  const { isMobile } = useSidebar()
  const ctx = useContext(GlobalContext)
  const isAdmin = localStorage.getItem("isAdmin") === "true"

  console.log(
    "NavUser - isAdmin:",
    isAdmin,
    "localStorage:",
    localStorage.getItem("isAdmin")
  )

  if (!ctx) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                {ctx.customerData && (
                  <AvatarFallback className="rounded-lg">
                    {(
                      ctx.customerData?.firstName?.slice(0, 1) +
                      ctx.customerData?.lastName?.slice(0, 1)
                    ).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {ctx.customerData?.firstName} {ctx.customerData?.lastName}
                </span>
                <span className="truncate text-xs">
                  {ctx.customerData?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  {ctx.customerData && (
                    <AvatarFallback className="rounded-lg">
                      {(
                        ctx.customerData?.firstName?.slice(0, 1) +
                        ctx.customerData?.lastName?.slice(0, 1)
                      ).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {ctx.customerData?.firstName} {ctx.customerData?.lastName}
                  </span>
                  <span className="truncate text-xs">
                    {ctx.customerData?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onSelect={() => {
                    window.location.href = "/admin"
                  }}
                >
                  <ShieldCheck />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {!isAdmin && <div style={{ display: "none" }}>Not admin</div>}
            <DropdownMenuItem>
              <LogOut />
              <div onClick={ctx.handlerLogout}>Log out</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
