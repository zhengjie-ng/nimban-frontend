import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GlobalContext from "../context/GlobalContext"
import { useContext, useState } from "react"
import { Textarea } from "./ui/textarea"
import { ComboPriorityEdit } from "./combo-priority-edit"
import { ComboStatusEdit } from "./combo-status-edit"

const Priorities = [
  {
    value: "1",
    label: "Low",
    color: "green",
  },
  {
    value: "2",
    label: "Medium",
    color: "yellow",
  },
  {
    value: "3",
    label: "High",
    color: "red",
  },
  {
    value: "4",
    label: "Critical",
    color: "purple",
  },
]

export function DialogTaskEdit(props) {
  const ctx = useContext(GlobalContext)
  const id = props.id
  const [taskName, setTaskName] = useState(props.name)
  const [description, setDescription] = useState(props.description)
  const [priority, setPriority] = useState(
    Priorities.find((p) => p.value == props.priority)
  )
  const [status, setStatus] = useState(props.status)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    ctx.handlerEditTask({
      id,
      taskName,
      description,
      priority: priority?.value || 1,
      status:
        status ||
        ctx.projectData.taskColumns.find(
          (taskColumn) => taskColumn.position === 0
        ).id,
    })
    setIsOpen(false)
    setTaskName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start pl-2">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <Label>Name</Label>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Name</Label> */}
              <Input
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>
          </div>
          <Label>Description</Label>
          <Textarea
            className="min-h-36"
            value={description}
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <ComboPriorityEdit
              parentPriority={priority}
              setParentPriority={setPriority}
            />
            <ComboStatusEdit
              parentStatus={status}
              setParentStatus={setStatus}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
