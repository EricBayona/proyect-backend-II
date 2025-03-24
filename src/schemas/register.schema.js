import { z } from "zod";

export const registerSchema = z.object({
    first_name: z.string().nonempty().min(3),
    last_name: z.string().nonempty().min(3),
    email: z.string().email(),
    age: z.number(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[\W_]).{8,20}$/),
    role: z.enum(["user", "admin"]).optional(),
});