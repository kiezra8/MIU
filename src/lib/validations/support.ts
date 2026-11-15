import { z } from "zod";
import { ugandanPhoneRegex } from "./checkout";

export const supportTicketSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_email: z.string().email("Valid email is required"),
  customer_phone: z
    .string()
    .regex(ugandanPhoneRegex, "Enter a valid Ugandan phone number"),
  category: z.enum(["order", "payment", "delivery", "returns", "seller", "general"]),
  order_number: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(15, "Please explain your issue in at least 15 characters"),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
