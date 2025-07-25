import { BiPlusCircle } from "react-icons/bi"
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
import { useEffect, useContext, useState } from "react"
import { Textarea } from "./ui/textarea"
import { ComboPriorityCreate } from "./combo-priority-create"
import { ComboStatusCreate } from "./combo-status-create"

export function DialogTaskCreate({ id }) {
  const ctx = useContext(GlobalContext)
  const [taskName, setTaskName] = useState(null)
  const [description, setDescription] = useState(null)
  const [priority, setPriority] = useState(null)
  const [status, setStatus] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    ctx.handlerCreateTask({
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

  useEffect(() => {
    if (isOpen === false) {
      setPriority(null)
      setStatus(null)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full">
            <BiPlusCircle />
            Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
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
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </div>
          </div>
          <Label>Description</Label>
          <Textarea
            className="min-h-36"
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-2">
            <ComboPriorityCreate
              parentPriority={priority}
              setParentPriority={setPriority}
            />
            <ComboStatusCreate
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
