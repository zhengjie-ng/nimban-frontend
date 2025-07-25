import ProductContext from "@/context/GlobalContext"
import { useContext } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import TaskColumn from "@/components/TaskColumn"
import { DndContext, closestCenter } from "@dnd-kit/core"

function HomePage() {
  const ctx = useContext(ProductContext)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Label>{ctx.projectData?.name}</Label>
          </div>
        </header>
        <Separator />
        <div className="mt-4 ml-4 flex gap-3">
          <Button className="w-32">New Task</Button>
          <Button className="w-32">New Column</Button>
        </div>

        <div className="justify-left mt-4 ml-4 flex gap-8">
          <DndContext
            onDragEnd={ctx.handlerTaskDragEnd}
            collisionDetection={closestCenter}
            autoScroll={false}
          >
            {ctx.projectData?.taskColumns.map((taskColumn) => (
              <TaskColumn key={taskColumn.id} taskColumn={taskColumn} />
            ))}
          </DndContext>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HomePage
