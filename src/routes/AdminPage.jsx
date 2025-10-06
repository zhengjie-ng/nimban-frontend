import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Key,
  Loader2,
  Home,
} from "lucide-react"
import AdminContext from "@/context/AdminContext"
import GlobalContext from "@/context/GlobalContext"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function AdminPage() {
  const adminCtx = useContext(AdminContext)
  const globalCtx = useContext(GlobalContext)
  const navigate = useNavigate()
  const [passwordDialog, setPasswordDialog] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [newPassword, setNewPassword] = useState("")

  console.log("AdminPage rendered!", { adminCtx, loading: adminCtx?.loading, error: adminCtx?.error })

  useEffect(() => {
    console.log("AdminPage useEffect - fetching customers")
    if (adminCtx?.fetchCustomers) {
      adminCtx.fetchCustomers()
    }
  }, [])

  const handleStatusToggle = async (customer) => {
    const result = await adminCtx.updateCustomerStatus(
      customer.id,
      !customer.enabled
    )
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleRoleToggle = async (customer) => {
    const currentRole = customer.role?.roleName || "ROLE_USER"
    const newRole = currentRole === "ROLE_ADMIN" ? "USER" : "ADMIN"

    const result = await adminCtx.updateCustomerRole(customer.id, newRole)
    if (!result.success) {
      alert(result.error)
    }
  }

  const handleLockToggle = async (customer) => {
    const result = await adminCtx.updateCustomerLock(
      customer.id,
      customer.accountNonLocked
    )
    if (!result.success) {
      alert(result.error)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 8) {
      alert("Password must be at least 8 characters")
      return
    }

    const result = await adminCtx.updateCustomerPassword(
      selectedCustomer.id,
      newPassword
    )

    if (result.success) {
      alert("Password updated successfully")
      setPasswordDialog(false)
      setNewPassword("")
      setSelectedCustomer(null)
    } else {
      alert(result.error)
    }
  }

  const getRoleBadge = (customer) => {
    const isAdmin = customer.role?.roleName === "ROLE_ADMIN"
    return (
      <Badge variant={isAdmin ? "destructive" : "default"}>
        {isAdmin ? "Admin" : "User"}
      </Badge>
    )
  }

  const isCurrentUser = (customer) => {
    return customer.id === globalCtx?.customerId
  }

  if (adminCtx?.loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex h-64 flex-col items-center justify-center">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    )
  }

  if (adminCtx?.error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{adminCtx.error}</p>
            <Button
              onClick={adminCtx.fetchCustomers}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage customer accounts and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/home")}
              variant="outline"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button onClick={adminCtx?.fetchCustomers} variant="outline">
              {adminCtx?.loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {adminCtx?.customers?.length || 0}
                </p>
                <p className="text-muted-foreground text-sm">
                  Total Customers
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {adminCtx?.customers?.filter((c) => c.enabled).length || 0}
                </p>
                <p className="text-muted-foreground text-sm">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {adminCtx?.customers?.filter((c) => !c.enabled).length || 0}
                </p>
                <p className="text-muted-foreground text-sm">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>
              View and manage all registered customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminCtx?.customers?.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No customers found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminCtx?.customers?.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-sm">
                        {customer.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{getRoleBadge(customer)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={customer.enabled ? "default" : "secondary"}
                        >
                          {customer.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.accountNonLocked ? "default" : "destructive"
                          }
                        >
                          {customer.accountNonLocked ? "Unlocked" : "Locked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {/* Enable/Disable */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusToggle(customer)}
                            disabled={
                              adminCtx?.loading || isCurrentUser(customer)
                            }
                            title={
                              isCurrentUser(customer)
                                ? "Cannot modify own status"
                                : customer.enabled
                                  ? "Disable User"
                                  : "Enable User"
                            }
                          >
                            {customer.enabled ? (
                              <UserX className="h-4 w-4 text-orange-600" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600" />
                            )}
                          </Button>

                          {/* Toggle Role */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRoleToggle(customer)}
                            disabled={
                              adminCtx?.loading || isCurrentUser(customer)
                            }
                            title={
                              isCurrentUser(customer)
                                ? "Cannot modify own role"
                                : customer.role?.roleName === "ROLE_ADMIN"
                                  ? "Remove Admin"
                                  : "Make Admin"
                            }
                          >
                            {customer.role?.roleName === "ROLE_ADMIN" ? (
                              <Shield className="h-4 w-4 text-red-600" />
                            ) : (
                              <ShieldCheck className="h-4 w-4 text-blue-600" />
                            )}
                          </Button>

                          {/* Lock/Unlock */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLockToggle(customer)}
                            disabled={
                              adminCtx?.loading || isCurrentUser(customer)
                            }
                            title={
                              isCurrentUser(customer)
                                ? "Cannot lock own account"
                                : customer.accountNonLocked
                                  ? "Lock Account"
                                  : "Unlock Account"
                            }
                          >
                            {customer.accountNonLocked ? (
                              <Unlock className="h-4 w-4 text-green-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-red-600" />
                            )}
                          </Button>

                          {/* Change Password */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setPasswordDialog(true)
                            }}
                            disabled={adminCtx?.loading}
                            title="Change Password"
                          >
                            <Key className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Password Update Dialog */}
        <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Password</DialogTitle>
              <DialogDescription>
                Set a new password for {selectedCustomer?.firstName}{" "}
                {selectedCustomer?.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setPasswordDialog(false)
                  setNewPassword("")
                  setSelectedCustomer(null)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handlePasswordUpdate}>Update Password</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminPage
