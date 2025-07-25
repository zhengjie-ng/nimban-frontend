import ProductContext from "@/context/GlobalContext"
import { useContext } from "react"
import TaskCard from "./TaskCard"
import { useDroppable, useDraggable } from "@dnd-kit/core"

function TaskColumn({ taskColumn }) {
  const ctx = useContext(ProductContext)

  // make the column draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: `column-${taskColumn.id}`, // Unique ID for column
    data: {
      type: "column",
      column: taskColumn,
    },
  })

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

  const tasks =
    ctx.projectData?.tasks?.filter((task) => task.statusId === taskColumn.id) ||
    []

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
      }
    : undefined

  return (
    <div
      ref={combinedRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`min-h-[60rem] w-96 rounded-3xl bg-gray-50 shadow-lg ${
        isOver ? "bg-gray-100/50" : ""
      }`}
    >
      <div className="min-h-12 cursor-grab rounded-3xl rounded-b-none bg-gray-200 p-4 font-medium">
        {taskColumn.name} ({tasks.length})
      </div>
      <div className="mt-3 flex flex-col">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export default TaskColumn
