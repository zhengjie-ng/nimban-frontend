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
import { DialogProjectEdit } from "./dialog-project-edit"

export function DropProjectOptions({ id }) {
  const ctx = useContext(GlobalContext)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-1 text-black/50">
          <CgMoreAlt />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-3" align="start">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>Select</DropdownMenuItem>
          <DialogProjectEdit id={id} />
          <DropdownMenuItem onClick={() => ctx.handlerDeleteProject(id)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
