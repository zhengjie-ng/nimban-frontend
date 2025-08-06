import GlobalContext from "../context/GlobalContext"
import { useContext, useState } from "react"
import { Button } from "@/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@uidotdev/usehooks"
import { DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { twMerge } from "tw-merge"

export function ComboStatusCreate({
  parentStatus,
  setParentStatus,
  className,
}) {
  const ctx = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={twMerge(`w-[125px] justify-start ${className}`)}
          >
            {parentStatus ? (
              <div>
                {
                  ctx.projectData.taskColumns.find(
                    (taskColumn) => taskColumn.id === parentStatus
                  ).name
                }
              </div>
            ) : (
              <>+ Set Status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[125px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setParentStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  // Mobile version
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={twMerge(`w-[125px] justify-start ${className}`)}
        >
          {parentStatus ? <>{parentStatus.label}</> : <>+ Set Status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <div className="px-4 py-2">
            <DialogTitle className="text-lg font-medium">
              Select Status
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose a status level for your task
            </DialogDescription>
          </div>
          <StatusList setOpen={setOpen} setSelectedStatus={setParentStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  )

  function StatusList({ setOpen, setSelectedStatus }) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {ctx.projectData.taskColumns.map((taskColumn) => (
              <CommandItem
                key={taskColumn.id}
                value={taskColumn.id}
                onSelect={(value) => {
                  setSelectedStatus(
                    ctx.projectData.taskColumns.find(
                      (taskColumn) => taskColumn.name === value
                    ).id
                  )
                  setOpen(false)
                }}
              >
                {taskColumn.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }
}
