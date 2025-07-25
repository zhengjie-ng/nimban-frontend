import {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from "react"
import { productReducer, defaultProduct } from "../reducers/ProductReducers"
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
} from "@/api/projectAPI"
import { apiPatchTask } from "@/api/taskAPI"

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, defaultProduct)
  const [isLoading, setIsLoading] = useState(false)
  const [updateCustomer, setUpdateCustomer] = useState(false)
  const [updateProject, setUpdateProject] = useState(false)
  const [customerData, setCustomerData] = useState(null)
  const [projectData, setProjectData] = useState(null)
  // const [tasks, setTasks] = useState(projectData?.tasks)
  const navigate = useNavigate()

  const getCustomerData = useCallback(async () => {
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

  const getProjectData = useCallback(async () => {
    try {
      const data = await apiGetProject(state.projectId)
      setProjectData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateProject(false)
    }
  }, [state.projectId])

  useEffect(() => {
    if (state.isAuthenticated && !isLoading && customerData) {
      navigate("/home")
    }
  }, [state.isAuthenticated, isLoading, customerData, navigate])

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
    // console.log("select project...")
    // console.log(data)
    // dispatch({ type: "SELECT_PROJECT", value })
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
      await apiCreateProject(state.customerId, {
        name: project_name,
        hidden: false,
      })
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
    }
  }

  const handlerDeleteProject = async (id) => {
    try {
      await apiDeleteProject(id)
    } catch (error) {
      console.log(error.message)
    } finally {
      setUpdateCustomer(true)
      setProjectData(null)
    }
  }

  // const handlerTaskDragEnd = (event) => {
  //   const { active, over } = event
  //   console.log(event)

  //   if (!over) return

  //   const taskId = active.id
  //   const newStatus = over.id

  //   setTasks(() =>
  //     tasks?.map((task) =>
  //       task.id === taskId ? { ...task, statusId: newStatus } : task
  //     )
  //   )
  // }

  const handlerTaskDragEnd = async (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    // Case 1: Dragging a TASK (active.id starts with "task-")
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
        await apiPatchTask(parseInt(taskId), { statusId: over.id })
      } catch (error) {
        console.error("Failed to update task:", error)
        setProjectData(projectData)
      }
    }

    // Case 2: Dragging a COLUMN (active.id starts with "column-")
    else if (active.id.startsWith("column-")) {
      const draggedColumnId = active.id.replace("column-", "")
      const targetColumnId = over.id

      if (draggedColumnId === targetColumnId) return // No change

      // Reorder columns in the projectData
      const currentColumns = [...projectData.taskColumns]
      const draggedIndex = currentColumns.findIndex(
        (col) => col.id == draggedColumnId
      )
      const targetIndex = currentColumns.findIndex(
        (col) => col.id == targetColumnId
      )

      if (draggedIndex === -1 || targetIndex === -1) return

      // Remove dragged column and insert at new position
      const [removed] = currentColumns.splice(draggedIndex, 1)
      currentColumns.splice(targetIndex, 0, removed)

      // Update state
      const updatedProjectData = {
        ...projectData,
        taskColumns: currentColumns,
      }
      setProjectData(updatedProjectData)

      // Optional: Call API to persist column order (if needed)
      // await apiPatchProject(projectData.id, { taskColumns: currentColumns });
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
    handlerOnChangeEmailInput,
    handlerOnChangePasswordInput,
    handlerLoginSubmit,
    handlerSelectProject,
    handlerLogout,
    handlerCreateProject,
    handlerDeleteProject,
    handlerTaskDragEnd,
  }

  return (
    <ProductContext.Provider value={data}>{children}</ProductContext.Provider>
  )
}

export default ProductContext
