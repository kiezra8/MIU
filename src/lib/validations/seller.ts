import { z } from "zod";
import { ugandanPhoneRegex } from "./checkout";

export const sellerRegistrationSchema = z.object({
  business_name: z.string().min(3, "Business name must be at least 3 characters"),
  owner_name: z.string().min(2, "Owner/Director full name is required"),
  email: z.string().email("Valid business email is required"),
  phone: z
    .string()
    .regex(ugandanPhoneRegex, "Enter a valid Ugandan phone number (e.g. +256 772 123456)"),
  business_location: z.string().min(5, "Physical business address/location is required"),
  district: z.string().min(2, "District is required"),
  business_description: z
    .string()
    .min(20, "Please describe your business and Ugandan origin in at least 20 characters"),
  registration_number: z.string().optional(),
  origin_type: z.enum([
    "locally_manufactured",
    "locally_grown",
    "locally_processed",
    "handcrafted",
    "locally_assembled",
  ], {
    message: "Please specify how your products are made in Uganda",
  }),
  accept_terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the MIU Vendor Agreement and authentic Ugandan origin pledge",
  }),
});

export type SellerRegistrationFormData = z.infer<typeof sellerRegistrationSchema>;
