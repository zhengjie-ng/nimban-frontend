import GlobalContext from "@/context/GlobalContext"
import { useContext } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import TaskColumn from "@/components/TaskColumn"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { DialogColumnCreate } from "@/components/dialog-column-create"
import { DialogTaskCreate } from "@/components/dialog-task-create"
import { DialogProjectCreateLarge } from "@/components/dialog-project-create-large"
import { BiPlusCircle } from "react-icons/bi"
import { DialogProjectMatesInvite } from "@/components/dialog-projectmates-invite"

function HomePage() {
  const ctx = useContext(GlobalContext)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  )

  // sort columns by position
  const sortedColumns = ctx.taskColumnData
    ? [...ctx.taskColumnData].sort((a, b) => {
        const posA = a.position ?? 0
        const posB = b.position ?? 0
        return posA - posB
      })
    : []

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
        {ctx.projectData ? (
          <div>
            <div className="mt-4 ml-4 flex items-center gap-3">
              <DialogTaskCreate id={ctx.projectData?.id} />
              <DialogColumnCreate id={ctx.projectData?.id} />
              <DialogProjectMatesInvite id={ctx.projectData?.id} />
              {/* <div className="flex items-center gap-2 rounded-2xl border-1 p-1">
                <BiPlusCircle className="text-gray-500" />
                <div className="flex gap-1">
                  {ctx.projectMates.map((projectMate) => (
                    <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-[0.7rem] text-gray-800">
                      {projectMate.firstName.slice(0, 1) +
                        projectMate.lastName.slice(0, 1)}
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
            <div className="justify-left mt-4 ml-4 flex gap-8">
              {/* {ctx.enableDrag ? ( */}
              <DndContext
                onDragEnd={ctx.handlerTaskDragEnd}
                collisionDetection={closestCenter}
                autoScroll={false}
                sensors={sensors}
              >
                {sortedColumns.map((taskColumn) => (
                  <TaskColumn key={taskColumn.id} taskColumn={taskColumn} />
                ))}
              </DndContext>
              {/* ) : (
                <>
                  {sortedColumns.map((taskColumn) => (
                    <TaskColumn key={taskColumn.id} taskColumn={taskColumn} />
                  ))}
                </>
              )} */}
            </div>
          </div>
        ) : (
          <div className="flex h-screen items-center justify-center pb-50 text-5xl text-gray-600">
            <DialogProjectCreateLarge />
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HomePage
