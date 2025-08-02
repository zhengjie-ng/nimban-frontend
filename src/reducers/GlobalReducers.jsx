export const defaultProduct = {
  loginEmailInput: "alan@nimban.com",
  loginPasswordInput: "Alan@1234",
  loginErrorMsg: "",
  isAuthenticated: false,
  customerId: null,
  projectid: null,
  activeProject: null,
}

export function globalReducer(state, action) {
  switch (action.type) {
    case "LOGIN_EMAIL_INPUT":
      return { ...state, loginEmailInput: action.value }

    case "LOGIN_PASSWORD_INPUT":
      return { ...state, loginPasswordInput: action.value }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        customerId: action.customer.id,
        loginEmailInput: "",
        loginPasswordInput: "",
        loginErrorMsg: "",
      }

    case "LOGIN_FAILURE":
      return { ...state, loginErrorMsg: action.error }

    case "LOGOUT":
      return { ...state, isAuthenticated: false }

    case "SELECT_PROJECT":
      return { ...state, projectId: action.value }

    default:
      throw Error("globalReducer - unknown action:", action.type)
  }
}
