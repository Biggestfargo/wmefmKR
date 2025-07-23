import { z } from "zod"

export const bookingFormSchema = z.object({
  // Contact Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  title: z.string().max(100, "Title must be less than 100 characters").optional(),

  // Event Details
  eventName: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(200, "Event name must be less than 200 characters"),
  requestedArtist: z
    .string()
    .min(2, "Artist/Celebrity name must be at least 2 characters")
    .max(100, "Artist/Celebrity name must be less than 100 characters"),
  eventType: z.string().min(1, "Please select an event type"),
  eventDate: z.string().min(1, "Please select an event date"),
  eventTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time"),
  venue: z
    .string()
    .min(2, "Venue name must be at least 2 characters")
    .max(200, "Venue name must be less than 200 characters"),
  city: z.string().min(2, "City must be at least 2 characters").max(100, "City must be less than 100 characters"),
  state: z.string().min(2, "State must be at least 2 characters").max(100, "State must be less than 100 characters"),
  expectedAttendance: z
    .string()
    .min(1, "Please select expected attendance")
    .refine((val) => {
      const validOptions = [
        // VIP options
        "5-10",
        "10-25",
        "25-50",
        "50-75",
        "75-100",
        // Private event options
        "under-50",
        "50-100",
        "100-250",
        "250-500",
        "500-1000",
        "1000-2500",
        // Standard event options
        "under-500",
        "500-1000",
        "1000-5000",
        "5000-10000",
        "10000-25000",
        "25000-50000",
        "over-50000",
      ]
      return validOptions.includes(val)
    }, "Please select a valid attendance range"),

  // Performance Specifications
  performanceType: z.string().min(1, "Please select a performance type"),
  additionalServices: z.array(z.string()).optional(),
  technicalRequirements: z.string().max(2000, "Technical requirements must be less than 2000 characters").optional(),

  // Budget Information
  budgetRange: z.string().min(1, "Please select a budget range"),
  budgetNotes: z.string().max(1000, "Budget notes must be less than 1000 characters").optional(),
  budgetIncludes: z.array(z.string()).optional(),

  // Additional Information
  eventDescription: z.string().max(2000, "Event description must be less than 2000 characters").optional(),
  specialRequests: z.string().max(1000, "Special requests must be less than 1000 characters").optional(),
  bookingTimeline: z.string().optional(),
  termsAgreement: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
})

export type BookingFormData = z.infer<typeof bookingFormSchema>
