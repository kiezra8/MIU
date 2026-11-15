import { z } from "zod";

export const addProductSchema = z.object({
  name: z.string().min(4, "Product name must be at least 4 characters"),
  category_id: z.string().min(1, "Please select a category"),
  subcategory_id: z.string().min(1, "Please select a subcategory"),
  short_description: z.string().min(10, "Short summary must be at least 10 characters"),
  full_description: z.string().min(20, "Detailed description must be at least 20 characters"),
  price_ugx: z.coerce.number().positive("Price must be a positive number in UGX"),
  compare_at_price_ugx: z.coerce.number().optional(),
  inventory_quantity: z.coerce.number().int().nonnegative("Inventory cannot be negative"),
  sku: z.string().min(3, "SKU is required"),
  verification_badge: z.enum([
    "verified_made_in_uganda",
    "locally_grown",
    "locally_manufactured",
    "handcrafted",
    "locally_assembled",
    "standard",
  ]),
  production_location: z.string().min(3, "Ugandan production location is required"),
  district: z.string().min(2, "Ugandan district is required"),
  image_url: z.string().url("Please provide a valid image URL"),
});

export type AddProductFormData = z.infer<typeof addProductSchema>;
