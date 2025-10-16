import GlobalContext from "@/context/GlobalContext"
import { useContext, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from "@/components/ui/shadcn-io/kanban"
import TaskCard from "@/components/TaskCard"
import { DialogColumnCreate } from "@/components/dialog-column-create"
import { DialogTaskCreate } from "@/components/dialog-task-create"
import { DialogProjectCreateLarge } from "@/components/dialog-project-create-large"
import { BiPlusCircle } from "react-icons/bi"
import { DialogProjectMatesInvite } from "@/components/dialog-projectmates-invite"
import { DropColumnOptions } from "@/components/drop-column-options"

function HomePage() {
  const ctx = useContext(GlobalContext)

  // Transform data for Kanban component
  const { columns, kanbanData } = useMemo(() => {
    if (!ctx.taskColumnData || !ctx.projectData?.tasks) {
      return { columns: [], kanbanData: [] }
    }

    // Sort columns by position
    const sortedColumns = [...ctx.taskColumnData].sort((a, b) => {
      const posA = a.position ?? 0
      const posB = b.position ?? 0
      return posA - posB
    })

    // Transform columns to Kanban format
    const cols = sortedColumns.map((col) => ({
      id: col.id,
      name: col.name,
      position: col.position,
    }))

    // Transform tasks to Kanban format
    const tasks = ctx.projectData.tasks.map((task) => ({
      id: task.id,
      column: task.statusId,
      name: task.name,
      task: task, // Keep original task data for rendering
      position: task.position ?? 0,
    }))

    return { columns: cols, kanbanData: tasks }
  }, [ctx.taskColumnData, ctx.projectData?.tasks])

  const handleDataChange = () => {
    // This is called by Kanban for visual reordering within same column
    // The actual backend persistence happens in handlerTaskDragEnd
    // We don't need to do anything here as the state update will be handled by the drag end handler
  }

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
          <div className="flex size-full flex-col">
            <div className="mt-4 ml-4 flex items-center gap-3">
              <DialogTaskCreate id={ctx.projectData?.id} />
              <DialogColumnCreate id={ctx.projectData?.id} />
              <DialogProjectMatesInvite id={ctx.projectData?.id} />
            </div>
            <div className="mt-4 flex size-full overflow-x-auto px-4">
              <KanbanProvider
                columns={columns}
                data={kanbanData}
                onDataChange={handleDataChange}
                onDragEnd={ctx.handlerTaskDragEnd}
                className="w-full"
              >
                {(column) => (
                  <KanbanBoard
                    id={column.id}
                    key={column.id}
                    className="max-w-96 min-w-80"
                  >
                    <div className="flex items-center justify-between p-2">
                      <KanbanHeader className="flex-1">
                        {column.name} (
                        {
                          kanbanData.filter((t) => t.column === column.id)
                            .length
                        }
                        )
                      </KanbanHeader>
                      <DropColumnOptions id={column.id} name={column.name} />
                    </div>
                    <KanbanCards id={column.id}>
                      {(item) => (
                        <KanbanCard
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          column={item.column}
                        >
                          <TaskCard task={item.task} />
                        </KanbanCard>
                      )}
                    </KanbanCards>
                  </KanbanBoard>
                )}
              </KanbanProvider>
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
