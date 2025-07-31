import GlobalContext from "@/context/GlobalContext"
import { useContext } from "react"
import TaskCard from "./TaskCard"
import {
  useDroppable,
  useDraggable,
  // useSensor,
  // PointerSensor,
} from "@dnd-kit/core"
import { DropColumnOptions } from "./drop-column-options"
import { Button } from "./ui/button"

function TaskColumn({ taskColumn }) {
  const ctx = useContext(GlobalContext)

  // make the column draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: `column-${taskColumn.id}`,
    data: {
      type: "column",
      column: taskColumn,
    },
  })

  const listenersOnState = ctx.enableDrag ? { ...listeners } : undefined

  // droppable for tasks
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: taskColumn.id,
    data: {
      type: "column",
      column: taskColumn,
    },
  })

  // merge drag and drop refs so the column is both draggable and droppable
  const combinedRef = (node) => {
    setDragRef(node)
    setDropRef(node)
  }

  // const tasks =
  //   ctx.projectData?.tasks?.filter((task) => task.statusId === taskColumn.id) ||
  //   []

  const sortedTasks = taskColumn.tasks
    ? [...taskColumn.tasks].sort((a, b) => {
        const posA = a.position ?? 0
        const posB = b.position ?? 0
        return posA - posB
      })
    : []

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined

  // const sortedTasks = tasks.sort(
  //   (a, b) => a?.sortedTimeStamp - b?.sortedTimeStamp
  // )

  return (
    <div
      ref={combinedRef}
      style={style}
      {...listenersOnState}
      {...attributes}
      className={`min-h-[60rem] w-96 rounded-3xl bg-gray-50 shadow-lg ${
        isOver ? "bg-gray-100/50" : ""
      }`}
    >
      <div className="flex min-h-12 cursor-grab items-center justify-between rounded-3xl rounded-b-none bg-gray-200 p-4 font-medium">
        <div className="flex">
          {taskColumn.name} ({sortedTasks.length})
        </div>
        {/* <Button onClick={() => console.log("Delete Item")}>Delete</Button> */}
        <DropColumnOptions id={taskColumn.id} name={taskColumn.name} />
      </div>

      <div className="mt-3 flex flex-col">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
