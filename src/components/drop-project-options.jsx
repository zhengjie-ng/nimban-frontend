import { CgMoreAlt } from "react-icons/cg"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import GlobalContext from "../context/GlobalContext"
import { useContext, useState } from "react"
import { DialogProjectEdit } from "./dialog-project-edit"

export function DropProjectOptions({ id }) {
  const ctx = useContext(GlobalContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = () => {
    ctx.handlerSelectProject(id)
    setIsOpen(false)
  }

  const handleDelete = () => {
    ctx.handlerDeleteProject(id)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-1 text-black/50">
          <CgMoreAlt />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-3" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSelect}>Select</DropdownMenuItem>
          <DialogProjectEdit id={id} setIsDropdownOpen={setIsOpen} />
          <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
