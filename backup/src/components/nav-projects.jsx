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
import ProductContext from "../context/ProductContext"
import { useContext } from "react"
import { Button } from "./ui/button"
import { DialogProjectCreate } from "./dialog-project-create"
import { DropProjectOptions } from "./drop_project_options"

export function NavProjects() {
  const ctx = useContext(ProductContext)

  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* {open ? <Button>Create Project</Button> : ""} */}
        <DialogProjectCreate />
        {/* <Button onClick={() => ctx.handlerCreateProject("Proj_Test")}>
          Create Project
        </Button> */}

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
                {ctx.customerData.projects.map((project) => (
                  <SidebarMenuSubItem key={project.name}>
                    <div className="flex items-center justify-between">
                      <SidebarMenuSubButton asChild>
                        <span
                          onClick={() => ctx.handlerSelectProject(project.id)}
                        >
                          {project.name}
                        </span>
                      </SidebarMenuSubButton>
                      <DropProjectOptions id={project.id} />
                    </div>
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
