import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import GlobalContext from "../context/GlobalContext"
import { useContext, useState } from "react"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Joi from "joi"
import { apiCheckEmailExists, apiGetCustomers } from "@/api/customerAPI"
import { useNavigate } from "react-router"

function ForgetPasswordPageForm({ className, ...props }) {
  const ctx = useContext(GlobalContext)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({
    email: "",
    password: "",
    date: null,
  })
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const [errors, setErrors] = useState({})

  const baseSchema = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    date: Joi.date().required().label("Date of Birth"),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
        )
      )
      .message(
        "Password must include upper and lower case letters, a number, and a special character (@$!%*?&)"
      )
      .label("Password"),
  }

  const validate = async () => {
    const syncSchema = Joi.object(baseSchema)
    const syncValidation = syncSchema.validate(user, { abortEarly: false })

    if (syncValidation.error) {
      const validationErrors = {}
      for (let item of syncValidation.error.details) {
        validationErrors[item.path[0]] = item.message
      }
      return validationErrors
    }

    if (user.email) {
      setIsCheckingEmail(true)
      console.log("check email")
      try {
        const exists = await apiCheckEmailExists(user.email)
        if (!exists) {
          return { email: "Email is not registered." }
        }
      } catch (error) {
        console.error("Error checking email:", error)
        return { email: "Error checking email availability" }
      } finally {
        setIsCheckingEmail(false)
      }

      if (user.date) {
        const inputDate = {
          birthYear: user.date.getFullYear(),
          birthMonth: user.date.getMonth() + 1,
          birthDay: user.date.getDate(),
        }
        // console.log(inputDate)
        try {
          const dbUser = await apiGetCustomers(user.email)
          const dbUserBirthDate = {
            birthYear: dbUser[0].birthYear,
            birthMonth: dbUser[0].birthMonth,
            birthDay: dbUser[0].birthDay,
          }
          if (
            inputDate.birthYear !== dbUserBirthDate.birthYear ||
            inputDate.birthMonth !== dbUserBirthDate.birthMonth ||
            inputDate.birthDay !== dbUserBirthDate.birthDay
          ) {
            return { date: "Birth date does not match our records" }
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    }

    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prev) => ({ ...prev, [name]: value }))
    // console.log(user)
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleDateSelect = (date) => {
    setUser((prev) => ({ ...prev, date }))
    // console.log(user)
    setOpen(false)
    if (errors.date) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.date
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("submit")
    const errors = await validate()

    if (errors) {
      setErrors(errors)
      return
    }

    setErrors({})
    // eslint-disable-next-line no-unused-vars
    // let { date, ...newUserData } = user
    const newUserData = {
      email: user.email.toLowerCase().trim(),
      password: user.password,
    }
    ctx.handlerResetPassword(newUserData)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter the email associated with your account, birth date for
            verification and new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleChange}
                  disabled={isCheckingEmail}
                />
                {isCheckingEmail ? (
                  <p className="mt-1 text-xs text-blue-500">Checking email</p>
                ) : errors.email ? (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                ) : null}
              </div>
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-full justify-between font-normal"
                    >
                      {user.date ? (
                        user.date.toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">
                          Date of Birth
                        </span>
                      )}
                      <ChevronDownIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={user.date}
                      onSelect={handleDateSelect}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear() - 13}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                )}
              </div>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New Password"
                  value={user.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Button type="submit" className="w-full">
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Return to Sign in
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgetPasswordPageForm
