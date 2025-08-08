import { BiFolder } from "react-icons/bi"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import GlobalContext from "../context/GlobalContext"
import { useContext } from "react"
import { Button } from "./ui/button"
import { DialogProjectCreate } from "./dialog-project-create"
import { DropProjectOptions } from "./drop-project-options"

export function NavProjects({ showHidden }) {
  const ctx = useContext(GlobalContext)

  const sortedProjects = ctx.projectList?.sort((a, b) => a.id - b.id)

  return (
    <SidebarGroup>
      <SidebarMenu>
        <DialogProjectCreate />
        <Collapsible asChild className="group/collapsible" defaultOpen={true}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                <BiFolder />
                <span>Projects</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {sortedProjects?.map((project) => (
                  <SidebarMenuSubItem key={project?.id}>
                    {project.hidden === false && (
                      <div className="flex items-center justify-between">
                        <SidebarMenuSubButton asChild>
                          <span
                            onClick={() => ctx.handlerSelectProject(project.id)}
                          >
                            {project?.name}
                          </span>
                        </SidebarMenuSubButton>
                        <DropProjectOptions id={project?.id} />
                      </div>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
              <SidebarMenuSub>
                {sortedProjects?.map((project) => (
                  <SidebarMenuSubItem key={project?.id}>
                    {project.hidden === true && showHidden === true && (
                      <div className="flex items-center justify-between">
                        <SidebarMenuSubButton asChild>
                          <span
                            className="italic opacity-70"
                            onClick={() => ctx.handlerSelectProject(project.id)}
                          >
                            {project?.name}
                          </span>
                        </SidebarMenuSubButton>
                        <DropProjectOptions id={project?.id} />
                      </div>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
