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
import { apiCheckEmailExists } from "@/api/customerAPI"

function SignupForm({ className, ...props }) {
  const ctx = useContext(GlobalContext)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    date: null,
  })
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)

  const [errors, setErrors] = useState({})

  const baseSchema = {
    firstName: Joi.string().min(2).required().label("First Name"),
    lastName: Joi.string().min(2).required().label("Last Name"),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),
    password: Joi.string().min(8).required().label("Password"),
    date: Joi.date().required().label("Date of Birth"),
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
      try {
        const exists = await apiCheckEmailExists(user.email)
        if (exists) {
          return { email: "Email is already in use" }
        }
      } catch (error) {
        console.error("Error checking email:", error)
        return { email: "Error checking email availability" }
      } finally {
        setIsCheckingEmail(false)
      }
    }

    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prev) => ({ ...prev, [name]: value }))
    // console.log(user)
  }

  const handleDateSelect = (date) => {
    setUser((prev) => ({ ...prev, date }))
    // console.log(user)
    setOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = await validate()

    if (errors) {
      setErrors(errors)
      return
    }

    setErrors({})
    // eslint-disable-next-line no-unused-vars
    let { date, ...newUserData } = user
    newUserData = {
      ...newUserData,
      birthYear: date.getFullYear(),
      birthMonth: date.getMonth() + 1,
      birthDay: date.getDate(),
    }
    ctx.handlerCreateCustomer(newUserData)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Please fill in this form to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>
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
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleChange}
                  disabled={isCheckingEmail}
                />
                {isCheckingEmail ? (
                  <p className="mt-1 text-xs text-blue-500">
                    Checking email availability...
                  </p>
                ) : errors.email ? (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupForm
