import * as z from "zod";

export type UserType = {
  id: number;
  username: string;
  image: string | undefined;
  email: string;
  hasCabinet?: boolean;
  is_payed?: boolean;
  role: "patient" | "manager";
  phone: string;
};

export const cabinetSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "name must at least contain 3 charachter"),
  email: z.string().email(),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
      "invalid phone number"
    ),
  speciality: z.string(),
  speciality_description: z
    .string()
    .min(10, "speciality description must at least contain 10 charachter"),
  address: z.string().min(5, "address  must at least contain 5 charachter"),
  city: z.string().min(2, "city is required"),
  location_url: z.string().optional(),
});

export const appointmentSchema = z.object({
  cabinet_id: z.string(),
  patient_name: z
    .string()
    .min(5, "full name must at least contain 5 charachter."),
  patient_phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9]\d{1,14}$/.test(phone),
      "invalid phone number"
    ),
  patient_CNIE: z.string().min(4, "CNIE must at least contain 4 charachter"),
  appointment_reason: z
    .string()
    .min(5, "appointment reson must at least contain 5 characheter"),
  Date: z.date(),
});

export interface Certificate {
  id: string;
  cabinet: {
    id: number;
    doctor_name: string;
  };
  appointment: {
    appointment_date: Date,
    patient: {
      id: number;
      username: string;
    };
  };
  issue_date: string;
  expiration_date: string;
  recieved: boolean;
  diagnosis: string;
  recommendations: string;
}
