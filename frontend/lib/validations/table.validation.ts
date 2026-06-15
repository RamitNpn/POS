import { z } from "zod";

export const createTableSchema = z.object({
  name: z.string().trim().min(1).max(100),
  capacity: z.number().min(1),
  status: z.enum(["available", "occupied", "reserved"]),
  sectionId: z.string(),
});

export type TCreateTableSchema = z.infer<typeof createTableSchema>;

export const tableSchema = z.object({
  _id: z.string(),
  name: z.string(),
  capacity: z.number(),
  status: z.string(),
  section: z.string(),
  sectionId: z.string().optional(),
});

export const getAllTablesSchema = z.array(tableSchema);

export type TGetAllTableSchema = z.infer<typeof getAllTablesSchema>;

export const getTableByIdSchema = tableSchema;

export type TGetTableByIdSchema = z.infer<typeof getTableByIdSchema>;

export const updateTableSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  capacity: z.number().min(1).optional(),
  status: z.enum(["available", "occupied", "reserved"]).optional(),
  sectionId: z.string(),
});

export type TUpdateTableSchema = z.infer<typeof updateTableSchema>;

export const deleteTableSchema = z.object({
  _id: z.string(),
});

export type TDeleteTableSchema = z.infer<typeof deleteTableSchema>;
