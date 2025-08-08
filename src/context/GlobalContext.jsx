import {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react"
import { globalReducer, defaultProduct } from "../reducers/GlobalReducers"
import {
  apiGetCustomers,
  apiGetCustomer,
  apiCreateCustomer,
  apiUpdateCustomer,
} from "@/api/customerAPI"

import { useNavigate } from "react-router-dom"
import {
  apiCreateProject,
  apiDeleteProject,
  apiGetProject,
  apiPatchProject,
} from "@/api/projectAPI"
import {
  apiCreateTaskColumn,
  apiPatchTaskColumn,
  apiDeleteTaskColumn,
} from "@/api/taskColumnAPI"
import { apiCreateTask, apiDeleteTask, apiPatchTask } from "@/api/taskAPI"

const GlobalContext = createContext()

export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, defaultProduct)
  const [isLoading, setIsLoading] = useState(false)
  const [updateCustomer, setUpdateCustomer] = useState(false)
  const [updateProject, setUpdateProject] = useState(false)
  const [updateProjectList, setUpdateProjectList] = useState(null)
  const [updateTaskColumnData, setUpdateTaskColumnData] = useState(null)
  const [customerData, setCustomerData] = useState(null)
  const [projectData, setProjectData] = useState(null)
  const [taskColumnData, setTaskColumnData] = useState(null)
  const [projectList, setProjectList] = useState(null)
  const [enableDrag, setEnableDrag] = useState(true)
  const [projectMates, setProjectMates] = useState([])
  const [msgForgetPassword, setMsgForgetPassword] = useState(null)
  const [projectId, setProjectId] = useState(null)
  const navigate = useNavigate()

  const getCustomerData = useCallback(async () => {
    console.log("Get customer data")
    setIsLoading(true)
    try {
      const data = await apiGetCustomer(state.customerId)
      setCustomerData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
      setUpdateCustomer(false)
    }
  }, [state.customerId])

  const getProjectList = useCallback(async () => {
    console.log("Get project list")
    // if (!customerData?.projectsId) return
    try {
      const projects = await Promise.all(
        customerData.projectsId.map((projectId) => apiGetProject(projectId))
      )
      setProjectList(projects)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProjectList(false)
    }
  }, [customerData])

  const getProjectData = useCallback(async () => {
    console.log("Get project data")
    try {
      const data = await apiGetProject(customerData?.lastAccessedId)
      setProjectData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(false)
      setUpdateTaskColumnData(true)
      // getProjectMates()
    }
  }, [customerData?.lastAccessedId])

  const getProjectDataOnLogin = useCallback(async () => {
    console.log("Get project data on login")
    try {
      if (customerData?.lastAccessedId) {
        const data = await apiGetProject(customerData?.lastAccessedId)
        setProjectData(data)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(false)
      setUpdateTaskColumnData(true)
      // getProjectMates()
    }
  }, [customerData?.lastAccessedId])

  const getProjectMates = useCallback(async () => {
    try {
      const data = await Promise.all(
        projectData?.teammatesId.map((teammateId) => apiGetCustomer(teammateId))
      )
      // Extract only the needed fields
      const simplifiedMates = data.map((mate) => ({
        id: mate.id,
        firstName: mate.firstName,
        lastName: mate.lastName,
        email: mate.email,
      }))
      setProjectMates(simplifiedMates)
    } catch (error) {
      console.error(error.message)
    }
  }, [projectData?.teammatesId])

  const getTaskColumnData = () => {
    console.log("update task column")
    const columnsData = projectData?.taskColumns
    const tasksData = projectData?.tasks
    // setTaskColumnData(data)

    const newData = columnsData?.map((col) => ({
      ...col,
      tasks: tasksData.filter((task) => task.statusId === col.id),
    }))
    if (newData) {
      setTaskColumnData(newData)
    }

    setUpdateTaskColumnData(false)
  }

  useEffect(() => {
    if (projectData) {
      getProjectMates()
    }
  }, [projectData])

  useEffect(() => {
    if (updateTaskColumnData) {
      getTaskColumnData()
    }
  }, [updateTaskColumnData])

  useEffect(() => {
    if (state.isAuthenticated && customerData?.projectsId) {
      getProjectList()
    }
  }, [state.isAuthenticated, customerData, getProjectList])

  useEffect(() => {
    if (state.isAuthenticated && !isLoading && customerData) {
      navigate("/home")
      getProjectDataOnLogin()
    }
  }, [
    state.isAuthenticated,
    isLoading,
    customerData,
    navigate,
    getProjectDataOnLogin,
  ])

  useEffect(() => {
    if (state.isAuthenticated) {
      getCustomerData()
    }
  }, [state.isAuthenticated, getCustomerData])

  useEffect(() => {
    if (updateCustomer) {
      getCustomerData()
    }
  }, [updateCustomer, getCustomerData])

  useEffect(() => {
    if (updateProject) {
      getProjectData()
    }
  }, [updateProject, getProjectData])

  useEffect(() => {
    if (updateProjectList) {
      getProjectList()
    }
  }, [updateProjectList, getProjectList])

  const setDragTrue = () => {
    setEnableDrag(true)
  }
  const setDragFalse = () => {
    setEnableDrag(false)
  }

  const handlerOnChangeEmailInput = (e) => {
    dispatch({ type: "LOGIN_EMAIL_INPUT", value: e.target.value })
  }

  const handlerOnChangePasswordInput = (e) => {
    dispatch({ type: "LOGIN_PASSWORD_INPUT", value: e.target.value })
  }

  const handlerLoginSubmit = async (e) => {
    e.preventDefault()
    console.log("Logging in")

    try {
      const customers = await apiGetCustomers(state.loginEmailInput)
      let foundCustomer = null

      if (customers.length > 0) {
        const customer = customers[0]
        if (customer.password === state.loginPasswordInput) {
          const customerDataRetrieved = await apiGetCustomer(customer.id)
          foundCustomer = customerDataRetrieved
        } else {
          dispatch({ type: "LOGIN_FAILURE", error: "Incorrect Password" })
          return
        }
      }

      if (foundCustomer) {
        dispatch({ type: "LOGIN_SUCCESS", customer: foundCustomer })
      } else {
        dispatch({ type: "LOGIN_FAILURE", error: "Email Not Registered" })
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAILURE",
        error: "Login failed. Please try again.",
      })
      console.error(error)
    }
  }

  const handlerLogout = () => {
    setProjectData(null)
    setCustomerData(null)
    setProjectList(null)
    setProjectMates(null)
    setTaskColumnData(null)
    navigate("/")
    dispatch({ type: "LOGOUT" })
  }

  const handlerSelectProject = async (value) => {
    try {
      const data = await apiGetCustomer(state.customerId)

      await apiUpdateCustomer(state.customerId, {
        ...data,
        lastAccessedId: value,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setUpdateProject(true)
      setUpdateTaskColumnData(true)
    }
    setProjectId(value)
    // dispatch({ type: "SELECT_PROJECT", value })
  }
  const handlerCreateCustomer = async (props) => {
    try {
      await apiCreateCustomer(props)
    } catch (error) {
      console.log(error.message)
    } finally {
      navigate("/")
    }
  }

  const handlerResetPassword = async (props) => {
    try {
      const data = await apiGetCustomers(props.email)

      await apiUpdateCustomer(data[0].id, {
        ...data[0],
        password: props.password,
      })

      setMsgForgetPassword(
        "Password has been changed, please sign in with new password."
      )
    } catch (error) {
      console.log(error.message)
    }
  }

  const handlerCreateProject = async (project_name) => {
    try {
      const data = await apiCreateProject({
        name: project_name,
        hidden: false,
        authorId: customerData.id,
        teammatesId: [customerData.id],
        taskTotalId: 0,
      })
      // console.log(data)
      await apiUpdateCustomer(state.customerId, {
        ...customerData,
        projectsId: [...(customerData?.projectsId || []), data.id],
      })

      await apiCreateTaskColumn(data.id, {
        name: "Not Started",
        position: 0,
      })
      await apiCreateTaskColumn(data.id, {
        name: "In Progress",
        position: 1,
      })
      await apiCreateTaskColumn(data.id, {
        name: "Done",
        position: 2,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProjectList(true)
      setUpdateCustomer(true)
    }
  }

  const handlerDeleteProject = async (id) => {
    try {
      const project = await apiGetProject(id)
      await Promise.all(
        project.teammatesId.map(async (mateId) => {
          const mate = await apiGetCustomer(mateId)
          await apiUpdateCustomer(mateId, {
            ...mate,
            projectsId: mate.projectsId.filter((projectId) => projectId !== id),
          })
        })
      )

      // Delete the project itself
      await apiDeleteProject(id)

      // If the deleted project was the currently selected one, clear it
      if (customerData?.lastAccessedId === id) {
        await apiUpdateCustomer(state.customerId, {
          ...customerData,
          lastAccessedId: null,
        })
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setProjectData(null)
    }
  }

  const handlerEditProject = async ({ id, projectName, hideProject }) => {
    try {
      await apiPatchProject(id, {
        ...projectData,
        name: projectName,
        hidden: hideProject,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      // setUpdateCustomer(true)
      setUpdateProjectList(true)
      setUpdateProject(true)
      // setProjectData(null)
    }
  }

  const handlerCreateColumn = async ({ id, columnName }) => {
    try {
      await apiCreateTaskColumn(id, {
        name: columnName,
        position: projectData.taskColumns.length + 1,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(true)
    }
  }

  const handlerEditColumn = async ({ id, columnName }) => {
    try {
      await apiPatchTaskColumn(id, {
        ...taskColumnData.find((col) => col.id === id),
        name: columnName,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(true)
    }
  }

  const handlerDeleteTaskColumn = async (id) => {
    try {
      await apiDeleteTaskColumn(id)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setUpdateProject(true)
    }
  }

  const handlerCreateTask = async (props) => {
    const codeHeader = projectData.name.slice(0, 3).toUpperCase()

    const codeNumber = projectData.taskTotalId + 1

    const codeNumberPadding = codeNumber.toString().padStart(4, "0")

    console.log(codeHeader + "_" + codeNumberPadding)

    try {
      const data = {
        name: props.taskName,
        code: codeHeader + "_" + codeNumberPadding,
        priority: props.priority,
        statusId: props.status,
        description: props.description,
        position: props.position,
        assigneesId: props.assigneesId,
      }
      console.log(data)

      await apiCreateTask(props.id, data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(true)
    }

    try {
      await apiPatchProject(props.id, {
        taskTotalId: codeNumber,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setUpdateProject(true)
    }
  }

  const handlerEditTask = async (props) => {
    try {
      await apiPatchTask(props.id, {
        name: props.taskName,
        priority: props.priority,
        statusId: props.status,
        description: props.description,
        assigneesId: props.assigneesId,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(true)
      // setProjectData(null)
    }
  }

  const handlerDeleteTask = async (id) => {
    try {
      await apiDeleteTask(id)
    } catch (error) {
      console.log(error.message)
    } finally {
      // setUpdateCustomer(true)
      setUpdateProject(true)
    }
  }
  const handlerInviteProjectmate = async ({ id, projectMateEmail }) => {
    try {
      const projectmate = await apiGetCustomers(
        projectMateEmail.toLowerCase().trim()
      )

      if (!projectmate || projectmate.length === 0) {
        throw new Error("User with this email not found")
      }

      const mate = projectmate[0]

      // 1. Add project to mate's projectsId array (if not already present)
      const updatedMateProjects = mate.projectsId
        ? [...mate.projectsId, id]
        : [id]

      await apiUpdateCustomer(mate.id, {
        ...mate,
        projectsId: updatedMateProjects,
      })

      // 2. Add mate to project's teammatesId array
      const updatedProjectTeammates = projectData.teammatesId
        ? [...projectData.teammatesId, mate.id]
        : [mate.id]

      await apiPatchProject(id, {
        ...projectData,
        teammatesId: updatedProjectTeammates,
      })

      // Refresh data
      setUpdateCustomer(true)
      setUpdateProject(true)
    } catch (error) {
      console.error("Failed to invite project mate:", error.message)
      throw error // Re-throw to handle in the component
    }
  }

  const handlerRemoveProjectmate = async (projectmateId) => {
    try {
      const projectId = projectData.id

      // 1. Get the project mate's data
      const mate = await apiGetCustomer(projectmateId)

      // 2. Remove project from mate's projectsId array
      const updatedMateProjects =
        mate.projectsId?.filter((id) => id !== projectId) || []
      await apiUpdateCustomer(mate.id, {
        ...mate,
        projectsId: updatedMateProjects,
        lastAccessedId:
          mate.lastAccessedId === projectId ? null : mate.lastAccessedId,
      })

      // 3. Remove mate from project's teammatesId array
      const updatedProjectTeammates =
        projectData.teammatesId?.filter((id) => id !== projectmateId) || []
      await apiPatchProject(projectId, {
        ...projectData,
        teammatesId: updatedProjectTeammates,
      })

      // Special case: if the removed mate is the current user
      if (projectmateId === state.customerId) {
        await apiUpdateCustomer(state.customerId, {
          ...customerData,
          lastAccessedId: null,
          projectsId:
            customerData.projectsId?.filter((id) => id !== projectId) || [],
        })
        setProjectId(null)
        setProjectData(null)
      }

      // Refresh data
      setUpdateCustomer(true)
      // setUpdateProject(true)

      return true // Indicate success
    } catch (error) {
      console.error("Failed to remove project mate:", error.message)
      throw error // Re-throw to handle in the component
    }
  }

  const handlerTaskDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    // drag task
    if (active.id.startsWith("task-")) {
      const taskId = active.id.replace("task-", "")
      const activeTask = projectData.tasks.find(
        (task) => task.id === parseInt(taskId)
      )

      // If moving between columns
      if (active.data.current?.statusId !== over.id) {
        try {
          // Get all tasks in the target column to calculate new position
          const targetColumnTasks = projectData.tasks
            .filter((task) => task.statusId === over.id)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

          const newPosition =
            targetColumnTasks.length > 0
              ? targetColumnTasks[targetColumnTasks.length - 1].position + 1
              : 0

          const updatedProjectData = {
            ...projectData,
            tasks: projectData.tasks.map((task) =>
              task.id === parseInt(taskId)
                ? { ...task, statusId: over.id, position: newPosition }
                : task
            ),
          }
          setProjectData(updatedProjectData)
          await apiPatchTask(parseInt(taskId), {
            statusId: over.id,
            position: newPosition,
            sortedTimeStamp: new Date(),
          })
        } catch (error) {
          console.error("Failed to update task:", error)
          setProjectData(projectData)
        } finally {
          setUpdateCustomer(true)
          setUpdateProject(true)
        }
      }
      // If moving within the same column
      else {
        try {
          // Get all tasks in the current column, sorted by position
          const columnTasks = projectData.tasks
            .filter((task) => task.statusId === over.id)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

          // Remove the active task from the array temporarily
          const filteredTasks = columnTasks.filter(
            (task) => task.id !== parseInt(taskId)
          )

          // Find the index where the task should be inserted
          const overIndex = filteredTasks.findIndex(
            (task) => `task-${task.id}` === over.id
          )

          // Calculate new position
          let newPosition
          if (overIndex === -1) {
            // Dropped at the end
            newPosition =
              filteredTasks.length > 0
                ? filteredTasks[filteredTasks.length - 1].position + 1
                : 0
          } else if (overIndex === 0) {
            // Dropped at the beginning
            newPosition = filteredTasks[0].position - 1
          } else {
            // Dropped between two tasks
            const prevTask = filteredTasks[overIndex - 1]
            const nextTask = filteredTasks[overIndex]
            newPosition = (prevTask.position + nextTask.position) / 2
          }

          // Update the task's position
          const updatedProjectData = {
            ...projectData,
            tasks: projectData.tasks.map((task) =>
              task.id === parseInt(taskId)
                ? { ...task, position: newPosition }
                : task
            ),
          }
          setProjectData(updatedProjectData)

          await apiPatchTask(parseInt(taskId), {
            position: newPosition,
            sortedTimeStamp: new Date(),
          })
        } catch (error) {
          console.error("Failed to update task position:", error)
          setProjectData(projectData)
        } finally {
          setUpdateProject(true)
        }
      }
    }
    // drag column
    else if (active.id.startsWith("column-")) {
      const draggedColumnId = active.id.replace("column-", "")
      const targetColumnId = over.id

      if (draggedColumnId === targetColumnId) return

      const currentColumns = [...projectData.taskColumns]
      const draggedIndex = currentColumns.findIndex(
        (col) => col.id == draggedColumnId
      )
      const targetIndex = currentColumns.findIndex(
        (col) => col.id == targetColumnId
      )

      if (draggedIndex === -1 || targetIndex === -1) return

      const [removed] = currentColumns.splice(draggedIndex, 1)
      currentColumns.splice(targetIndex, 0, removed)

      const updatedColumns = currentColumns.map((col, index) => ({
        ...col,
        position: index,
      }))

      const updatedProjectData = {
        ...projectData,
        taskColumns: updatedColumns,
      }
      setProjectData(updatedProjectData)
      setUpdateTaskColumnData(true)
      setUpdateCustomer(true)

      try {
        await Promise.all(
          updatedColumns.map((col) =>
            apiPatchTaskColumn(col.id, { position: col.position })
          )
        )
      } catch (error) {
        console.error("Failed to update column positions:", error)
        setProjectData(projectData)
      }
    }
  }

  const data = {
    loginEmailInput: state.loginEmailInput,
    loginPasswordInput: state.loginPasswordInput,
    loginErrorMsg: state.loginErrorMsg,
    isAuthenticated: state.isAuthenticated,
    customerId: state.customerId,
    activeProject: state.activeProject,
    projectId,
    customerData,
    projectData,
    projectList,
    enableDrag,
    setDragTrue,
    setDragFalse,
    taskColumnData,
    msgForgetPassword,
    setMsgForgetPassword,
    handlerOnChangeEmailInput,
    handlerOnChangePasswordInput,
    handlerLoginSubmit,
    handlerSelectProject,
    handlerLogout,
    handlerCreateProject,
    handlerDeleteProject,
    handlerTaskDragEnd,
    handlerEditProject,
    handlerCreateColumn,
    handlerDeleteTaskColumn,
    handlerEditColumn,
    handlerCreateTask,
    handlerEditTask,
    handlerDeleteTask,
    setEnableDrag,
    handlerCreateCustomer,
    projectMates,
    handlerInviteProjectmate,
    handlerRemoveProjectmate,
    handlerResetPassword,
  }

  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext
