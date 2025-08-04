import { MdOutlinePersonRemove } from "react-icons/md"
import { useContext } from "react"
import GlobalContext from "@/context/GlobalContext"
function ProjectMateCard({ props }) {
  const ctx = useContext(GlobalContext)
  return (
    <div className="flex items-center justify-between rounded-2xl hover:bg-gray-100">
      <div className="flex items-center gap-2 p-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-[0.8rem] text-gray-800">
          {props.firstName.slice(0, 1) + props.lastName.slice(0, 1)}
        </div>
        <div className="flex flex-col">
          <div className="text-[0.9rem]">
            {props.firstName} {props.lastName}
          </div>
          <div className="text-[0.7rem] text-gray-800">{props.email}</div>
        </div>
      </div>
      {ctx.projectData.authorId !== props.id && (
        <MdOutlinePersonRemove
          onClick={() => ctx.handlerRemoveProjectmate(props.id)}
          className="mr-5 size-5 text-gray-500 hover:text-red-400"
        />
      )}
    </div>
  )
}

export default ProjectMateCard
