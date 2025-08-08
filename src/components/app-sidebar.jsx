import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { NavHeader } from "@/components/nav-header"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "./ui/separator"
import { useState } from "react"

export function AppSidebar({ ...props }) {
  const [showHidden, setShowHidden] = useState(false)
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects showHidden={showHidden} />
      </SidebarContent>
      <SidebarFooter>
        <div className="mb-2 ml-2 flex gap-3">
          <Checkbox
            checked={showHidden}
            onCheckedChange={(checked) => setShowHidden(checked)}
          />
          <Label htmlFor="terms">Show Hidden</Label>
        </div>
        <Separator />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
