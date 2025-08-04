import { RiErrorWarningLine } from "react-icons/ri"
import { CiWarning } from "react-icons/ci"
import LoginForm from "@/components/LoginForm"
import { HiViewBoards } from "react-icons/hi"
import GlobalContext from "../context/GlobalContext"
import { useContext } from "react"

function LoginPage() {
  const ctx = useContext(GlobalContext)
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <HiViewBoards />
          </div>
          Nimban
        </a>
        {ctx.loginErrorMsg && (
          <div className="flex items-center justify-center gap-1 rounded-sm border-1 border-red-300 bg-red-100 p-2 text-red-400">
            <RiErrorWarningLine className="size-6" />
            {ctx.loginErrorMsg}
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
