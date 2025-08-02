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

export function DialogProjectCreate() {
  const ctx = useContext(GlobalContext)
  const [projectName, setProjectName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (projectName.length < 3 || projectName.length > 30) {
      return
    }

    // setError("")
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
          setProjectName("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Project Name</DialogTitle>
            {/* <DialogDescription>
              Enter a name between 3 to 30 characters
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                id="project-name"
                name="projectName"
                value={projectName}
                placeholder="Enter project name (3-30 characters)"
                onChange={(e) => {
                  setProjectName(e.target.value)

                  // if (error) setError("")
                }}
                required
                minLength={3}
                maxLength={30}
              />
              {/* {error && <p className="text-sm text-red-500">{error}</p>} */}
            </div>
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
