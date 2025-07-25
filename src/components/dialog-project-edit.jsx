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

export function DialogProjectEdit({ id }) {
  const ctx = useContext(GlobalContext)
  const [projectName, setProjectName] = useState(
    ctx.projectList.find((project) => project.id === id).name
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    ctx.handlerEditProject({ id, projectName })
    setIsOpen(false)
    setProjectName("")
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
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <Label>Name</Label>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
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
