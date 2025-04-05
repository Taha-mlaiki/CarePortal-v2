import { Knock } from "@knocklabs/node";
export const knockClient = new Knock(process.env.KNOCK_API_SECRET);