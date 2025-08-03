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
import { useContext, useState } from "react"
import ProjectMateCard from "./ProjectMateCard"
import { apiCheckEmailExists } from "@/api/customerAPI"

export function DialogProjectMatesInvite({ id }) {
  const ctx = useContext(GlobalContext)
  const [projectMateEmail, setProjectMateEmail] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (
      ctx.projectMates?.some(
        (projectMate) =>
          projectMate.email.toLowerCase().trim() ===
          projectMateEmail.toLowerCase().trim()
      )
    ) {
      setError("Project mate is already in the project")
      return
    }

    try {
      const exists = await apiCheckEmailExists(projectMateEmail)

      if (!exists) {
        setError("Email not registered")
      }
      return
    } catch (error) {
      console.log(error.message)
    } finally {
      ctx.handlerInviteProjectmate({ id, projectMateEmail })
      // setIsOpen(false)
      setProjectMateEmail("")
    }

    // if (projectMateEmail)
    // const formData = new FormData(e.target).get("columnName")
    // console.log(formData)
    // ctx.handlerCreateColumn({ id, projectMateEmail })
    // setIsOpen(false)
    // setProjectMateEmail("")
  }

  const handleOnChange = (e) => {
    setProjectMateEmail(e.target.value)
    setError(null)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setError(null)
        setIsOpen(open)
        if (!open) {
          setProjectMateEmail("")
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl">
          <div className="flex items-center gap-2">
            <BiPlusCircle className="text-gray-500" />
            <div className="flex gap-1">
              {ctx.projectMates?.map((projectMate) => (
                <div
                  key={projectMate.id}
                  className="flex size-7 items-center justify-center rounded-full bg-gray-200 text-[0.7rem] text-gray-800"
                >
                  {projectMate.firstName.slice(0, 1) +
                    projectMate.lastName.slice(0, 1)}
                </div>
              ))}
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Invite Project Mate</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row gap-2">
            <div>
              <div>
                {/* <Label htmlFor="name-1">Name</Label> */}
                <Input
                  className="w-75"
                  id="projectMateEmail"
                  type="email"
                  name="projectMateEmail"
                  value={projectMateEmail}
                  placeholder="Enter Project Mate's email"
                  onChange={handleOnChange}
                  required
                />
              </div>
              <div className="mt-2 text-[0.8rem] text-red-400">
                {error && error}
              </div>
            </div>
            <Button type="submit">Invite</Button>
          </div>
          <div>
            <div className="mb-2 text-gray-700">Project Mates</div>
            <div className="flex flex-col gap-2 rounded-2xl bg-gray-50 p-2">
              {ctx.projectMates?.map((projectMate) => (
                <ProjectMateCard key={projectMate.id} props={projectMate} />
              ))}
            </div>
          </div>

          <DialogFooter></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
