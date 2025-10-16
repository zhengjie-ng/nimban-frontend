import { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import GlobalContext from "../context/GlobalContext"
import { GripVertical } from "lucide-react"

export function DialogColumnReorder({ columnId, columnName, isOpen, onOpenChange }) {
  const ctx = useContext(GlobalContext)
  const [orderedTasks, setOrderedTasks] = useState([])

  useEffect(() => {
    if (isOpen) {
      // Disable dragging when dialog opens
      ctx.setEnableDrag(false)

      if (ctx.taskColumnData) {
        const column = ctx.taskColumnData.find((col) => col.id === columnId)
        if (column && column.tasks) {
          // Sort tasks by current position
          const sorted = [...column.tasks].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          console.log('📋 Loading tasks for reorder:', sorted.map(t => ({ id: t.id, name: t.name, position: t.position })))
          setOrderedTasks(sorted)
        }
      }
    } else {
      // Re-enable dragging when dialog closes
      ctx.setEnableDrag(true)
    }
  }, [isOpen, columnId, ctx])

  const moveTask = (index, direction, e) => {
    // Prevent event propagation to avoid triggering column drag
    e?.stopPropagation()
    e?.preventDefault()

    const newOrder = [...orderedTasks]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newOrder.length) return

    // Remove the task from current position
    const [movedTask] = newOrder.splice(index, 1)
    // Insert it at the target position
    newOrder.splice(targetIndex, 0, movedTask)

    console.log('🔄 After move:', newOrder.map(t => ({ name: t.name, position: t.position })))
    setOrderedTasks(newOrder)
  }

  const handleSave = async () => {
    // Update positions in backend
    const updates = orderedTasks.map((task, index) => ({
      id: task.id,
      position: index * 1000, // Use same spacing as drag-and-drop
    }))

    console.log('💾 Saving new positions:', updates)

    try {
      // Import the API function
      const { apiPatchTask } = await import("@/api/taskAPI")

      // Update all tasks with new positions
      await Promise.all(
        updates.map(({ id, position }) =>
          apiPatchTask(id, {
            position,
            sortedTimeStamp: new Date().toISOString(),
          })
        )
      )

      console.log('✅ Positions saved successfully')

      // Close dialog first
      onOpenChange(false)

      // Force refresh project data
      setTimeout(() => {
        ctx.setUpdateProject(true)
      }, 100)
    } catch (error) {
      console.error("Failed to reorder tasks:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={true}>
      <DialogContent
        className="sm:max-w-[500px]"
        onPointerDownCapture={(e) => e.stopPropagation()}
        onPointerMoveCapture={(e) => e.stopPropagation()}
        onPointerUpCapture={(e) => e.stopPropagation()}
        onMouseDownCapture={(e) => e.stopPropagation()}
        onMouseMoveCapture={(e) => e.stopPropagation()}
        onMouseUpCapture={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
        onTouchEndCapture={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Reorder Tasks in "{columnName}"</DialogTitle>
          <DialogDescription>
            Use the arrows to reorder tasks within this column.
          </DialogDescription>
        </DialogHeader>

        <div
          className="max-h-[400px] overflow-y-auto space-y-2 py-4"
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
        >
          {orderedTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No tasks in this column
            </div>
          ) : (
            orderedTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-3 border rounded-md bg-secondary/20"
              >
                <GripVertical className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{task.name}</div>
                  <div className="text-sm text-gray-500">{task.code}</div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => moveTask(index, "up", e)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => moveTask(index, "down", e)}
                    disabled={index === orderedTasks.length - 1}
                  >
                    ↓
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Save Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
