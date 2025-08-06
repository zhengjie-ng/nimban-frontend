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
import { useContext, useState, useEffect } from "react"
import { Textarea } from "./ui/textarea"
import { ComboPriorityEdit } from "./combo-priority-edit"
import { ComboStatusEdit } from "./combo-status-edit"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { twMerge } from "tw-merge"

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

const animatedComponents = makeAnimated()

export function DialogTaskEdit(props) {
  const ctx = useContext(GlobalContext)
  const id = props.id
  const [taskName, setTaskName] = useState(props.name)
  const [description, setDescription] = useState(props.description)
  const [priority, setPriority] = useState(
    Priorities.find((p) => p.value == props.priority)
  )
  const [status, setStatus] = useState(props.status)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAssignees, setSelectedAssignees] = useState([])

  // Format project mates for react-select
  const assigneeOptions =
    ctx.projectMates?.map((mate) => ({
      value: mate.id,
      label: `${mate.firstName} ${mate.lastName}`,
    })) || []

  // Get current task's assignees and set them as initial selected values
  useEffect(() => {
    if (isOpen && ctx.projectMates) {
      const currentTask = ctx.projectData?.tasks.find((task) => task.id === id)
      const initialAssignees = currentTask?.assigneesId || []

      const initialSelected = assigneeOptions.filter((option) =>
        initialAssignees.includes(option.value)
      )
      setSelectedAssignees(initialSelected)
    }
  }, [isOpen, ctx.projectMates, ctx.projectData, id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.length < 3 || taskName.length > 30) {
      return
    }

    ctx.handlerEditTask({
      id,
      taskName,
      description,
      priority: priority?.value || 1,
      status:
        status ||
        ctx.projectData.taskColumns.find(
          (taskColumn) => taskColumn.position === 0
        ).id,
      assigneesId: selectedAssignees.map((assignee) => assignee.value),
    })
    setIsOpen(false)
    setTaskName("")
    props.setIsDropdownOpen(false)
    ctx.setEnableDrag(true)
  }

  useEffect(() => {
    if (isOpen === false) {
      setTaskName(props.name)
      setDescription(props.description)
      setPriority(Priorities.find((p) => p.value == props.priority))
      setStatus(props.status)
    }
  }, [isOpen, props.name, props.description, props.priority, props.status])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start pl-2">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              {/* Make changes to your profile here. Click save when you&apos;re done. */}
            </DialogDescription>
          </DialogHeader>
          <Label>Name</Label>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input
                placeholder="Enter task name (3-30 characters)"
                value={taskName}
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
            value={description}
            placeholder="Enter task description"
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <Label>Assignees</Label>
            <Select
              isMulti
              name="assignees"
              options={assigneeOptions}
              value={selectedAssignees}
              onChange={setSelectedAssignees}
              className="text-sm"
              // className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              components={animatedComponents}
              placeholder="Select assignees..."
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
              classNamePrefix="select"
            />
          </div>
          <div className="flex justify-items-center gap-2">
            <ComboPriorityEdit
              className={"w-1/2"}
              parentPriority={priority}
              setParentPriority={setPriority}
            />
            <ComboStatusEdit
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
