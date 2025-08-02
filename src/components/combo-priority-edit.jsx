import { useState } from "react"
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
const Priorities = [
  {
    value: "1",
    label: "Optional",
    color: "gray",
  },
  {
    value: "2",
    label: "Low",
    color: "green",
  },
  {
    value: "3",
    label: "Medium",
    color: "yellow",
  },
  {
    value: "4",
    label: "High",
    color: "red",
  },
  {
    value: "5",
    label: "Critical",
    color: "purple",
  },
]

const colorClasses = {
  gray: {
    base: "bg-gray-200",
    hover: "hover:bg-gray-200/80",
  },
  green: {
    base: "bg-green-200",
    hover: "hover:bg-green-200/80",
  },
  yellow: {
    base: "bg-yellow-200",
    hover: "hover:bg-yellow-200/80",
  },
  red: {
    base: "bg-red-200",
    hover: "hover:bg-red-200/80",
  },
  purple: {
    base: "bg-purple-200",
    hover: "hover:bg-purple-200/80",
  },
}

export function ComboPriorityEdit({ parentPriority, setParentPriority }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`${colorClasses[parentPriority.color].base} ${
              colorClasses[parentPriority.color].hover
            } w-[125px] justify-start`}
          >
            <div>{parentPriority.label}</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[125px] p-0" align="start">
          <PriorityList
            setOpen={setOpen}
            setSelectedPriority={setParentPriority}
          />
        </PopoverContent>
      </Popover>
    )
  }

  // Mobile version
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {<>{parentPriority.label}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <div className="px-4 py-2">
            <DialogTitle className="text-lg font-medium">
              Select Priority
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose a priority level for your task
            </DialogDescription>
          </div>
          <PriorityList
            setOpen={setOpen}
            setSelectedPriority={setParentPriority}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )

  function PriorityList({ setOpen, setSelectedPriority }) {
    return (
      <Command>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {Priorities.map((Priority) => (
              <CommandItem
                key={Priority.value}
                value={Priority.value}
                onSelect={(value) => {
                  setSelectedPriority(
                    Priorities.find((priority) => priority.value == value) ||
                      null
                  )
                  setOpen(false)
                }}
              >
                {Priority.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  }
}
