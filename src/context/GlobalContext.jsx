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
  apiPatchCustomer,
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
  const [customerData, setCustomerData] = useState(null)
  const [projectData, setProjectData] = useState(null)
  const [projectList, setProjectList] = useState(null)
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
      const data = await apiGetProject(state.projectId)
      setProjectData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(false)
    }
  }, [state.projectId])

  const getProjectDataOnLogin = useCallback(async () => {
    console.log("Get project data on login")
    try {
      const data = await apiGetProject(customerData?.lastAccessedId)
      setProjectData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(false)
    }
  }, [customerData?.lastAccessedId])

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
      const customers = await apiGetCustomers()
      let foundCustomer = null

      for (const customer of customers) {
        if (customer.email === state.loginEmailInput) {
          if (customer.password === state.loginPasswordInput) {
            const customerDataRetrieved = await apiGetCustomer(customer.id)
            foundCustomer = customerDataRetrieved
            break
          } else {
            dispatch({ type: "LOGIN_FAILURE", error: "Incorrect Password" })
            return
          }
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
    navigate("/")
    dispatch({ type: "LOGOUT" })
  }

  const handlerSelectProject = async (value) => {
    try {
      await apiPatchCustomer(state.customerId, {
        lastAccessedId: value,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setUpdateProject(true)
    }
    dispatch({ type: "SELECT_PROJECT", value })
  }

  const handlerCreateProject = async (project_name) => {
    try {
      const data = await apiCreateProject({
        name: project_name,
        hidden: false,
      })
      // console.log(data)
      await apiPatchCustomer(state.customerId, {
        projectsId: [...customerData.projectsId, data.id],
      })

      await apiCreateTaskColumn(data.id, {
        name: "Not Started",
        position: 1,
      })
      await apiCreateTaskColumn(data.id, {
        name: "In Progress",
        position: 2,
      })
      await apiCreateTaskColumn(data.id, {
        name: "Done",
        position: 3,
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
      await apiPatchCustomer(state.customerId, {
        projectsId: customerData.projectsId.filter(
          (projectId) => projectId !== id
        ),
      })
      await apiDeleteProject(id)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      // setUpdateProjectList(true)
      setProjectData(null)
    }
  }

  const handlerEditProject = async ({ id, projectName }) => {
    try {
      await apiPatchProject(id, {
        name: projectName,
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
        name: columnName,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      // setUpdateCustomer(true)
      setUpdateProject(true)
      // setProjectData(null)
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
    console.log("id", props.id)
    console.log("task name", props.taskName)
    console.log("des", props.description)
    console.log("piror", props.priority)
    console.log("status", props.status)

    const codeHeader = projectData.name.slice(0, 3).toUpperCase()

    const codeNumber = projectData.taskTotalId + 1

    const codeNumberPadding = codeNumber.toString().padStart(4, "0")

    console.log(codeHeader + "_" + codeNumberPadding)

    try {
      await apiCreateTask(props.id, {
        name: props.taskName,
        code: codeHeader + "_" + codeNumberPadding,
        priority: props.priority,
        statusId: props.status,
        description: props.description,
      })
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

  const handlerTaskDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    // drag task
    if (active.id.startsWith("task-")) {
      const taskId = active.id.replace("task-", "")
      try {
        const updatedProjectData = {
          ...projectData,
          tasks: projectData.tasks.map((task) =>
            task.id === parseInt(taskId) ? { ...task, statusId: over.id } : task
          ),
        }
        setProjectData(updatedProjectData)
        await apiPatchTask(parseInt(taskId), {
          statusId: over.id,
          sortedTimeStamp: new Date(),
        })
      } catch (error) {
        console.error("Failed to update task:", error)
        setProjectData(projectData)
      } finally {
        setUpdateProject(true)
      }
    }
    // drag column
    else if (active.id.startsWith("column-")) {
      const draggedColumnId = active.id.replace("column-", "")
      const targetColumnId = over.id

      if (draggedColumnId === targetColumnId) return

      // reorder columns in the projectData
      const currentColumns = [...projectData.taskColumns]
      const draggedIndex = currentColumns.findIndex(
        (col) => col.id == draggedColumnId
      )
      const targetIndex = currentColumns.findIndex(
        (col) => col.id == targetColumnId
      )

      if (draggedIndex === -1 || targetIndex === -1) return

      // remove dragged column and insert at new position
      const [removed] = currentColumns.splice(draggedIndex, 1)
      currentColumns.splice(targetIndex, 0, removed)

      // Update positions based on new order
      const updatedColumns = currentColumns.map((col, index) => ({
        ...col,
        position: index,
      }))

      // update state
      const updatedProjectData = {
        ...projectData,
        taskColumns: updatedColumns,
      }
      setProjectData(updatedProjectData)

      // Update positions in backend
      try {
        // Batch update all columns' positions
        await Promise.all(
          updatedColumns.map((col) =>
            apiPatchTaskColumn(col.id, { position: col.position })
          )
        )
      } catch (error) {
        console.error("Failed to update column positions:", error)
        // Revert to previous state if update fails
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
    projectId: state.projectId,
    customerData,
    projectData,
    projectList,
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
  }

  return (
    <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext
