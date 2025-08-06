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
import { useEffect, useContext, useState } from "react"
import { Textarea } from "./ui/textarea"
import { ComboPriorityCreate } from "./combo-priority-create"
import { ComboStatusCreate } from "./combo-status-create"
import React from "react"
import Select from "react-select"
import makeAnimated from "react-select/animated"

export function DialogTaskCreate({ id }) {
  const ctx = useContext(GlobalContext)
  const [taskName, setTaskName] = useState(null)
  const [description, setDescription] = useState(null)
  const [priority, setPriority] = useState(null)
  const [status, setStatus] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [assignees, setAssignees] = useState(null)

  const animatedComponents = makeAnimated()

  const assigneeOptions = ctx.projectMates?.map((projectMate) => ({
    value: projectMate.id,
    label: projectMate.firstName + " " + projectMate.lastName,
    shortName: (
      projectMate.firstName.slice(0, 1) + projectMate.lastName.slice(0, 1)
    ).toUpperCase(),
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.length < 3 || taskName.length > 30) {
      return
    }

    let new_position = null
    if (status) {
      const column = ctx.taskColumnData.find(
        (taskColumn) => taskColumn.id === status
      )

      new_position = column.tasks.length + 1
      console.log(new_position)
    } else if (!status) {
      const column = ctx.taskColumnData.find(
        (taskColumn) => taskColumn.position === 0
      )
      new_position = column.tasks.length + 1
      console.log(new_position)
    }

    const assigneesId = assignees?.map((assignee) => assignee.value)

    ctx.handlerCreateTask({
      id,
      taskName,
      description,
      priority: priority?.value || 3,
      status:
        status ||
        ctx.projectData.taskColumns.find(
          (taskColumn) => taskColumn.position === 0
        ).id,
      position: new_position,
      assigneesId,
    })
    setIsOpen(false)
    setTaskName("")
  }

  useEffect(() => {
    if (isOpen === false) {
      setPriority(null)
      setStatus(null)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-24">
          <BiPlusCircle />
          Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re
              done. */}
            </DialogDescription>
          </DialogHeader>
          <Label>Name</Label>
          <div className="grid gap-4">
            <div className="grid gap-3">
              {/* <Label htmlFor="name-1">Name</Label> */}
              <Input
                placeholder="Enter task name (3-30 characters)"
                onChange={(e) => setTaskName(e.target.value)}
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>
          <Label>Description</Label>
          <Textarea
            className="min-h-36"
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Label>Assignees</Label>
          <Select
            className="text-sm"
            options={assigneeOptions}
            isMulti
            placeholder="Select assignees..."
            closeMenuOnSelect={false}
            onChange={setAssignees}
            components={animatedComponents}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                backgroundColor: "var(--select-bg)",
                borderColor: state.isFocused
                  ? "var(--select-focus-border)"
                  : "var(--select-border)",
                boxShadow: state.isFocused
                  ? "0 0 0 1px var(--select-focus-ring)"
                  : baseStyles.boxShadow,
                "&:hover": {
                  borderColor: state.isFocused
                    ? "var(--select-focus-border)"
                    : "var(--select-hover-border)",
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "var(--select-bg)",
                borderColor: "var(--select-border)",
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? "var(--select-option-selected-bg)"
                  : isFocused
                    ? "var(--select-option-hover-bg)"
                    : "var(--select-option-bg)",
                color: isSelected ? "white" : "var(--select-text)",
                "&:active": {
                  backgroundColor: "var(--select-option-selected-bg)",
                },
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "var(--select-multi-bg)",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "var(--select-multi-text)",
              }),
              multiValueRemove: (base) => ({
                ...base,
                color: "var(--select-multi-text)",
                ":hover": {
                  backgroundColor: "var(--select-multi-remove-hover)",
                  color: "white",
                },
              }),
              input: (base) => ({
                ...base,
                color: "var(--select-text)",
              }),
              singleValue: (base) => ({
                ...base,
                color: "var(--select-text)",
              }),
              placeholder: (base) => ({
                ...base,
                color: "var(--select-placeholder)",
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "var(--select-separator)",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "var(--select-indicator)",
                ":hover": {
                  color: "var(--select-text)",
                },
              }),
              clearIndicator: (base) => ({
                ...base,
                color: "var(--select-indicator)",
                ":hover": {
                  color: "var(--select-text)",
                },
              }),
            }}
            // classNamePrefix="select"

            // styles={{
            //   control: (baseStyles, state) => ({
            //     ...baseStyles,
            //     borderColor: state.isFocused
            //       ? "#a855f7"
            //       : baseStyles.borderColor, // purple-600
            //     boxShadow: state.isFocused
            //       ? "0 0 0 1px #a855f7"
            //       : baseStyles.boxShadow,
            //     "&:hover": {
            //       borderColor: state.isFocused
            //         ? "#a855f7"
            //         : baseStyles.borderColor,
            //     },
            //   }),
            // }}
          />
          <div className="flex gap-2">
            <ComboPriorityCreate
              className={"w-1/2"}
              parentPriority={priority}
              setParentPriority={setPriority}
            />
            <ComboStatusCreate
              className={"w-1/2"}
              parentStatus={status}
              setParentStatus={setStatus}
            />
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
