"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUpdateUserSchema,
  updateUserSchema,
} from "@/lib/validations/user.validation";
import { userApi } from "@/lib/api/user.api";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { useUserById } from "@/hooks/admin/users/getUserById";
import { useEffect } from "react";
import FormHeader from "@/components/shared/formHeader";
import clsx from "clsx";

type Props = {
  userId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

function UserEditForm({ userId, onClose, size = "lg" }: Props) {
  const { data: userData } = useUserById(userId);
  const users = userData?.data ?? userData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      profile: "",
      role: "waiter",
      status: "active",
    },
  });

  useEffect(() => {
    if (!users) return;

    reset({
      name: users.name ?? "",
      email: users.email ?? "",
      phone: users.phone ?? "",
      role: users.role ?? "waiter",
      profile: "",
      status: users.status ?? "active",
    });
  }, [
    users?._id,
    users?.name,
    users?.email,
    users?.phone,
    users?.role,
    users?.status,
  ]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      userId,
      formData,
    }: {
      userId: string;
      formData: FormData;
    }) => userApi.updateUserApi(userId, formData),
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "The user was added successfully.",
      });
      reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add user.",
      });
    },
  });

  const onSubmit = (data: TUpdateUserSchema) => {
    const formData = new FormData();

    formData.append("name", data.name || "");
    formData.append("email", data.email || "");
    formData.append("phone", data.phone || "");

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }

    formData.append("role", data.role || "");
    formData.append("status", data.status || "active");

    mutate({ userId, formData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          "w-full bg-card border border-border rounded-lg shadow-2xl overflow-hidden",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        <FormHeader
          title="Edit User"
          subtitle="Update user information and permissions"
          onClose={onClose}
        />

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <Label htmlFor="new-user-name">Name</Label>
              <Input
                id="new-user-name"
                {...register("name")}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="new-user-email">Email</Label>
              <Input
                id="new-user-email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="new-user-phone">Phone</Label>
              <Input
                id="new-user-phone"
                {...register("phone")}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="new-user-role">Role</Label>
              <select
                id="new-user-role"
                {...register("role")}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="admin">Administrator</option>
                <option value="waiter">Server</option>
                <option value="kitchen">Kitchen Staff</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="new-user-status">Status</Label>
              <select
                id="new-user-status"
                {...register("status")}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Profile Upload */}
            <div>
              <Label htmlFor="new-user-profile">Profile Image</Label>
              <Input
                id="new-user-profile"
                type="file"
                {...register("profile")}
              />
              {users?.profile && (
                <Image
                  src={users.profile}
                  width={80}
                  height={100}
                  alt="Profile"
                  onClick={() =>
                    window.open(users.profile, "_blank", "noopener,noreferrer")
                  }
                  className="mt-2 mb-3 rounded border border-border object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              )}
            </div>
          </div>
        </div>

        <CardFooter className="border-t border-border bg-muted/20 px-6 py-4 justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Updating..." : "Update User"}
          </Button>
        </CardFooter>
      </form>
    </div>
  );
}

export default UserEditForm;
