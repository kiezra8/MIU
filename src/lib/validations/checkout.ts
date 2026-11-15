import { z } from "zod";

// Ugandan Phone Number regex: supports +2567..., 07..., 2567...
export const ugandanPhoneRegex = /^(?:\+256|0)?(7[0-9]{8}|20[0-9]{7}|39[0-9]{7})$/;

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Full name must be at least 2 characters"),
  customer_phone: z
    .string()
    .min(9, "Phone number is too short")
    .regex(ugandanPhoneRegex, "Enter a valid Ugandan telephone number (e.g. +256 772 123456 or 0701234567)"),
  customer_email: z.string().email("Please enter a valid email address"),
  delivery_address: z.string().min(5, "Delivery address must be at least 5 characters"),
  district: z.string().min(2, "Please select your district"),
  city_town: z.string().min(2, "City or town is required"),
  delivery_instructions: z.string().optional(),
  payment_method: z.enum(["mtn_momo", "airtel_money", "cash_on_delivery", "card"], {
    message: "Please select a payment method",
  }),
  momo_phone_number: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
