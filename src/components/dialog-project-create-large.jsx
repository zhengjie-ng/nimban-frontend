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

export function DialogProjectCreateLarge() {
  const ctx = useContext(GlobalContext)
  const [projectName, setProjectName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (projectName.length < 3 || projectName.length > 30) {
      // setError("Project name must be between 3 to 30 characters")
      return
    }
    const formData = new FormData(e.target)
    ctx.handlerCreateProject(formData.get("projectName"))
    setIsOpen(false)
    setProjectName("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          // setError("")
          setProjectName("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="sm:h-16 sm:w-120 sm:text-3xl lg:h-32 lg:w-200 lg:rounded-3xl lg:p-10 lg:text-5xl"
        >
          Create Project To Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Project Name</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="project-name"
                name="projectName"
                value={projectName}
                placeholder="Enter project name (3-30 characters)"
                onChange={(e) => setProjectName(e.target.value)}
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
