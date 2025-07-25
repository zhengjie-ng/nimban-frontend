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
import { useContext } from "react"
import { DialogColumnEdit } from "./dialog-column-edit"

export function DropColumnOptions({ id, name }) {
  const ctx = useContext(GlobalContext)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-1 text-black/50">
          <CgMoreAlt />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-3" align="start">
        <DropdownMenuGroup>
          <DialogColumnEdit id={id} name={name} />
          <DropdownMenuItem onClick={() => ctx.handlerDeleteTaskColumn(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
