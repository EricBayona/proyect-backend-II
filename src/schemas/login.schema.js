import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("debe ser un formato valido"),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[\W_]).{8,20}$/),
})