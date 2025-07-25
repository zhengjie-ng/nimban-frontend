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

export function DialogColumnCreate({ id }) {
  const ctx = useContext(GlobalContext)
  const [columnName, setColumnName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = () => {
    ctx.handlerCreateColumn({ id, columnName })
    setIsOpen(false)
    setColumnName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full">
            <BiPlusCircle />
            Column
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Column</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Name</Label> */}
              <Input
                placeholder="Enter column name"
                onChange={(e) => setColumnName(e.target.value)}
                required
              />
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div> */}
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
