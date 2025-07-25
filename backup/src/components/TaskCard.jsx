import { useDraggable } from "@dnd-kit/core"

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10, // Ensure dragged item appears above others
        opacity: 0.8, // Visual feedback during drag
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="m-4 h-36 cursor-grab rounded-2xl bg-white p-2 shadow-md active:cursor-grabbing"
    >
      <div className="font-medium">{task.name}</div>
      <div className="mt-2 text-sm text-gray-500">
        Priority: {task.pirority}
      </div>
    </div>
  )
}

export default TaskCard
