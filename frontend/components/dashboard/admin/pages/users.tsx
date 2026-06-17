"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardFooter } from "@/components/ui/card";
import {
  statusStyle,
  PageSection,
  SearchField,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useAllUsers } from "@/hooks/admin/users/getAllUsers";
import { TUser } from "@/lib/types/user.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  TCreateUserSchema,
} from "@/lib/validations/user.validation";
import { userApi } from "@/lib/api/user.api";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Download, Edit, Eye, Trash, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/shared/confirmDialog";
import { useDeleteUser } from "@/hooks/admin/users/removeUser";
import UserEditForm from "../editForm/user.edit";

export default function UsersPage() {
  const [filter, setFilter] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [formVisible, setFormVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const { data: userData } = useAllUsers({ role: selectedRole });
  const users = userData?.data ?? [];

  const { mutate: deleteUser } = useDeleteUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      profile: "",
      password: "",
      role: "waiter",
      status: "active",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "The user was added successfully.",
      });
      reset();
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add user.",
      });
    },
  });

  const onSubmit = (data: TCreateUserSchema) => {
    console.log("submitted data", data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }

    formData.append("password", data.password);
    formData.append("role", data.role);
    formData.append("status", data.status);

    mutate(formData as any);
  };

  const confirmDelete = () => {
    if (!itemToRemove) return;

    deleteUser(itemToRemove, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="User Management"
        description="Manage access, role assignments and employee details."
      ></DashboardHeader>

      {!formVisible && (
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="bg-yellow-400 rounded-lg"
            onClick={() => setFormVisible(true)}
          >
            Add User
          </Button>
        </div>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <PageSection title="Register New User">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="new-user-name">Name</Label>
                <Input
                  id="new-user-name"
                  {...register("name")}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-email">Email</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-password">Password</Label>
                <Input
                  id="new-user-password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-phone">Phone</Label>
                <Input
                  id="new-user-phone"
                  type="phone"
                  {...register("phone")}
                  placeholder="Enter phone"
                />
                {errors.phone && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-role">Role</Label>
                <select
                  id="new-user-role"
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("role")}
                >
                  <option value="admin">Administrator</option>
                  <option value="waiter">Server</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="cashier">Cashier</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-status">Status</Label>
                <select
                  id="new-user-status"
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  {...register("status")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-[12px] mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="new-user-email">Profile</Label>
                <Input
                  id="new-user-profile"
                  type="file"
                  {...register("profile")}
                />
              </div>
            </div>
            <CardFooter className="justify-end flex gap-3 pt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setFormVisible(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add User"}
              </Button>
            </CardFooter>
          </PageSection>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <div className="flex items-center justify-between gap-2">
          <SearchField
            id="user-search"
            value={filter}
            onChange={setFilter}
            className="w-full sm:w-auto flex-1"
            placeholder="Search by name, email, role or status"
          />
          <div className="flex items-center gap-3">
            <select
              id="user-role-filter"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
            >
              <option value="all">All roles</option>
              <option value="admin">Administrator</option>
              <option value="waiter">Server</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="cashier">Cashier</option>
            </select>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => setFilter("")}
            >
              Export
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <PageSection title="User Directory">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: TUser) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <a
                      href={user.profile || user.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Image
                        src={user.profile || user.name}
                        width={80}
                        height={100}
                        alt="Profile"
                        className="rounded border border-border cursor-zoom-in"
                      />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(user.status)}`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.createdAt ? formatDate(user.createdAt) : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <button className="flex items center text-primary/90 hover:text-primary/80 justify-center p-1 rounded">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setEditId(user._id)}
                        className="flex items center text-green-600 hover:text-green-700 p-1 rounded"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setItemToRemove(user._id)}
                        className="flex items center text-red-600 hover:text-red-700 p-1 rounded"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {editId && (
          <UserEditForm userId={editId} onClose={() => setEditId(null)} />
        )}
        <ConfirmDialog
          open={itemToRemove !== null}
          title="Remove User"
          message="Are you sure you want to remove this user?"
          onConfirm={confirmDelete}
          onCancel={() => setItemToRemove(null)}
        />
      </PageSection>
    </div>
  );
}
