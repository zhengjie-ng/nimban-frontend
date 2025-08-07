import { AiOutlineUp, AiOutlineDown } from "react-icons/ai"
import { useDraggable } from "@dnd-kit/core"
import { Label } from "@radix-ui/react-dropdown-menu"
import { DropTaskOptions } from "./drop-task-options"
import { useContext } from "react"
import GlobalContext from "../context/GlobalContext"
import { useMediaQuery } from "@uidotdev/usehooks"

function TaskCard({ task }) {
  const ctx = useContext(GlobalContext)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const enumStatus = {
    1: (
      <Label className="dark:bg-secondary flex max-w-28 items-center justify-center gap-1 rounded-2xl bg-gray-200 p-1 pr-4 pl-4 dark:border-1">
        {isDesktop ? <span>? Optional</span> : <span>?</span>}
      </Label>
    ),
    2: (
      <Label className="dark:bg-secondary flex max-w-30 items-center justify-center gap-1 rounded-2xl bg-green-200 p-1 pr-3 pl-3 md:pr-6 md:pl-4 dark:border-1">
        {isDesktop ? (
          <span className="flex items-center justify-center gap-1">
            <AiOutlineDown /> Low
          </span>
        ) : (
          <span>
            <AiOutlineDown />
          </span>
        )}
      </Label>
    ),
    3: (
      <Label className="dark:bg-secondary flex max-w-30 items-center justify-center gap-1 rounded-2xl bg-yellow-200 p-1 pr-4 pl-4 dark:border-1">
        {isDesktop ? <span>= Medium</span> : <span>=</span>}
      </Label>
    ),
    4: (
      <Label className="dark:bg-secondary flex max-w-22 items-center justify-center gap-1 rounded-2xl bg-red-200 p-1 pr-3 pl-3 md:pr-6 md:pl-4 dark:border-1">
        {isDesktop ? (
          <span className="flex items-center justify-center gap-1">
            <AiOutlineUp /> High
          </span>
        ) : (
          <span>
            <AiOutlineUp />
          </span>
        )}
      </Label>
    ),
    5: (
      <Label className="dark:bg-secondary flex max-w-30 items-center justify-center gap-1 rounded-2xl bg-purple-200 p-1 pr-3 pl-3 md:pr-6 md:pl-4 dark:border-1">
        {isDesktop ? <span>! Critical</span> : <span>!</span>}
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
      style={{ ...style, touchAction: "none" }}
      {...listenersOnState}
      {...attributes}
      className="dark:bg-secondary m-4 flex min-h-36 cursor-grab flex-col rounded-2xl bg-white p-4 shadow-md active:cursor-grabbing dark:border-2"
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
      <div className="mb-2 max-h-30 min-h-15 overflow-y-auto text-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
        {task.description}
      </div>
      <div className="flex gap-1">
        {filterAssignees?.map((assignee) => (
          <span
            key={assignee.id}
            className="dark:bg-secondary flex size-7 items-center justify-center rounded-full bg-gray-200 text-[0.7rem] dark:border-1 dark:text-gray-200"
          >
            {(
              assignee.firstName.slice(0, 1) + assignee.lastName.slice(0, 1)
            ).toUpperCase()}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-row justify-between gap-2">
        <div className="text-[0.7rem] text-gray-500 sm:text-[0.5rem] md:text-sm dark:text-gray-200">
          {enumStatus[task.priority]}
        </div>
        <div className="text-[0.7rem] text-gray-400 sm:text-[0.5rem] md:text-sm">
          {task.code}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
