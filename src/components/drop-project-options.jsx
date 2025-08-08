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
import { useContext, useState, useEffect } from "react"
import { DialogProjectEdit } from "./dialog-project-edit"
import Modal from "react-modal"
import { apiGetProject } from "@/api/projectAPI"

Modal.setAppElement("#root")

export function DropProjectOptions({ id }) {
  const ctx = useContext(GlobalContext)
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [project, setProject] = useState(null)

  useEffect(() => {
    const fetchProject = async () => {
      const projectData = await apiGetProject(id)
      setProject(projectData)
    }

    fetchProject()
  }, [id])

  const handleSelect = () => {
    ctx.handlerSelectProject(id)
    setIsOpen(false)
  }

  const handleDelete = () => {
    ctx.handlerDeleteProject(id)
    setIsOpen(false)
  }

  const handleUnauthorizedDeleteClick = () => {
    setIsDeleteOpen(true)
    setIsOpen(false)
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-1 text-black/50 dark:bg-transparent dark:text-gray-300"
          >
            <CgMoreAlt />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-3" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSelect}>Select</DropdownMenuItem>
            <DialogProjectEdit id={id} setIsDropdownOpen={setIsOpen} />
            <DropdownMenuItem
              onClick={
                ctx.customerId === project?.authorId
                  ? handleDelete
                  : handleUnauthorizedDeleteClick
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        contentLabel="Not Authorized to Delete Project"
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity "
      >
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-neutral-800">
          <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            Permission Denied
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Only the Project Author can delete the project
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="dark:border-gray-600 dark:text-white dark:hover:bg-neutral-700"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
