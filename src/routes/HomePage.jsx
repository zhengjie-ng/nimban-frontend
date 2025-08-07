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
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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

  // const sensors = useSensors(
  //   useSensor(TouchSensor),
  //   useSensor(PointerSensor, {
  //     activationConstraint: {
  //       distance: 3,
  //     },
  //   }),
  //   useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  // )
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
