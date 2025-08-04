import ForgetPasswordPageForm from "@/components/ForgetPasswordPageForm"
import { HiViewBoards } from "react-icons/hi"
import GlobalContext from "../context/GlobalContext"
import { useContext } from "react"

function ForgetPasswordPage() {
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

        {ctx.msgForgetPassword && (
          <div className="flex items-center justify-center gap-1 rounded-md border-1 border-green-500 bg-green-100 p-2 text-sm text-green-500">
            {ctx.msgForgetPassword}
          </div>
        )}

        <ForgetPasswordPageForm />
      </div>
    </div>
  )
}

export default ForgetPasswordPage
