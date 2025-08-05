import { AiOutlineUp, AiOutlineDown } from "react-icons/ai"
import { useDraggable } from "@dnd-kit/core"
import { Label } from "@radix-ui/react-dropdown-menu"
import { DropTaskOptions } from "./drop-task-options"
import { useContext } from "react"
import GlobalContext from "../context/GlobalContext"

function TaskCard({ task }) {
  const ctx = useContext(GlobalContext)
  const enumStatus = {
    1: (
      <Label className="flex max-w-20 items-center justify-center gap-1 rounded-2xl bg-gray-200 p-1 pr-6 pl-4 dark:border-1 dark:bg-gray-800">
        <AiOutlineDown /> Optional
      </Label>
    ),
    2: (
      <Label className="flex max-w-20 items-center justify-center gap-1 rounded-2xl bg-green-200 p-1 pr-6 pl-4 dark:border-1 dark:bg-gray-800">
        <AiOutlineDown /> Low
      </Label>
    ),
    3: (
      <Label className="flex max-w-30 items-center justify-center gap-1 rounded-2xl bg-yellow-200 p-1 pr-6 pl-4 dark:border-1 dark:bg-gray-800">
        = Medium
      </Label>
    ),
    4: (
      <Label className="flex max-w-22 items-center justify-center gap-1 rounded-2xl bg-red-200 p-1 pr-6 pl-4 dark:border-1 dark:bg-gray-800">
        <AiOutlineUp /> High
      </Label>
    ),
    5: (
      <Label className="flex max-w-30 items-center justify-center gap-1 rounded-2xl bg-purple-200 p-1 pr-6 pl-4 dark:border-1 dark:bg-gray-800">
        ! Critical
      </Label>
    ),
  }
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${task.id}`,
    data: {
      type: "task",
      task,
    },
  })

  const listenersOnState = ctx.enableDrag ? { ...listeners } : undefined

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10,
        opacity: 0.8,
      }
    : undefined

  const filterAssignees = ctx.projectMates?.filter((mate) =>
    task.assigneesId?.includes(mate.id)
  )

  // console.log("filterAssignees", filterAssignees)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listenersOnState}
      {...attributes}
      className="m-4 flex min-h-36 cursor-grab flex-col rounded-2xl bg-white p-4 shadow-md active:cursor-grabbing dark:border-2 dark:bg-gray-900"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{task.name}</div>
        {/* <div className="text-gray-400">{task.code}</div> */}
        <DropTaskOptions
          id={task.id}
          name={task.name}
          description={task.description}
          priority={task.priority}
          status={task.statusId}
        />
      </div>
      <div className="max-h-30 min-h-15 overflow-y-auto text-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
        {task.description}
      </div>
      <div className="flex gap-1">
        {filterAssignees.map((assignee) => (
          <span
            key={assignee.id}
            className="flex size-7 items-center justify-center rounded-full bg-gray-200 text-[0.7rem] text-gray-800 dark:border-1 dark:bg-gray-800 dark:text-gray-200"
          >
            {(
              assignee.firstName.slice(0, 1) + assignee.lastName.slice(0, 1)
            ).toUpperCase()}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-row justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-200">
          {enumStatus[task.priority]}
        </div>
        <div className="text-gray-400">{task.code}</div>
      </div>
    </div>
  )
}

export default TaskCard
