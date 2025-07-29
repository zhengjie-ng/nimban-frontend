import { CgMoreAlt } from "react-icons/cg"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import GlobalContext from "../context/GlobalContext"
import { useContext, useState } from "react"
import { DialogColumnEdit } from "./dialog-column-edit"

export function DropColumnOptions({ id, name }) {
  const ctx = useContext(GlobalContext)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open) => {
    if (open) {
      ctx.setEnableDrag(false)
      setIsOpen(true)
      // setTimeout(() => ctx.setEnableDrag(false), 1000)
    } else {
      // When closing, first close dropdown then enable drag
      setIsOpen(false)
      setTimeout(() => ctx.setEnableDrag(true), 100)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-1 text-black/50">
          <CgMoreAlt />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-3" align="start">
        <DropdownMenuGroup>
          <DialogColumnEdit id={id} name={name} setIsDropdownOpen={setIsOpen} />
          <DropdownMenuItem onClick={() => ctx.handlerDeleteTaskColumn(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
