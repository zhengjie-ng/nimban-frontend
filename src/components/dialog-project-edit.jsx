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
import { useContext, useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export function DialogProjectEdit({ id, setIsDropdownOpen }) {
  const ctx = useContext(GlobalContext)
  const [projectName, setProjectName] = useState(
    ctx.projectList.find((project) => project.id === id).name
  )
  const [isOpen, setIsOpen] = useState(false)
  const [hideProject, setHideProject] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (projectName.length < 3 || projectName.length > 30) {
      return
    }

    e.preventDefault()
    ctx.handlerEditProject({ id, projectName })
    setIsOpen(false)
    setProjectName("")
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    if (isOpen === false) {
      setProjectName(ctx.projectList.find((project) => project.id === id).name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start pl-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                placeholder="Enter project name (3-30 characters)"
                onChange={(e) => setProjectName(e.target.value)}
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Checkbox />
            <Label htmlFor="terms">Hide Project</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
