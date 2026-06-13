import { z } from "zod";

export const tableStatusEnum = z.enum([
  "available",
  "occupied",
  "reserved",
  "cleaning",
  "out-of-service",
]);

export const createTableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().min(1),
  status: tableStatusEnum.optional(),
  section: z.string().trim().min(1),
  sectionId: z.string().optional(),
});

export const tableSchema = z.object({
  _id: z.string(),
  name: z.string().min(1),
  capacity: z.number(),
  status: tableStatusEnum,
  section: z.string(),
  sectionId: z.string().optional(),
});

export const getTableByIdSchema = tableSchema;

export const getAllTablesSchema = z.array(tableSchema);

export const updateTableSchema = z.object({
  name: z.string().min(1).optional(),
  capacity: z.number().min(1).optional(),
  status: tableStatusEnum.optional(),
  section: z.string().optional(),
  sectionId: z.string().optional(),
});