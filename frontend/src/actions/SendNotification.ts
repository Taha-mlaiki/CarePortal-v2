"use server";
import { knockClient } from "@/lib/knockClient";

type notificationParams = {
  recipientId: string;
  patient_name: string;
  appointment_id: number;
  actorId: string;
  appointment_date: string;
};
export const sendNotification = async ({
  recipientId,
  actorId,
  patient_name,
  appointment_date,
  appointment_id,
}: notificationParams) => {
  try {
    const recipientIdString = String(recipientId);
    const actorIdString = String(actorId);
    const patient_nameString = String(patient_name);
    const appointment_dateString = new Date(
      appointment_date
    ).toLocaleDateString();
    
    const appointment_idString = String(appointment_id);

    await knockClient.workflows.trigger("appointment-notification", {
      actor: {
        id: actorIdString,
      },
      recipients: [
        {
          id: recipientIdString,
        },
      ],
      data: {
        patient_name: patient_nameString,
        appointment_date: appointment_dateString,
        view_url: `${process.env.FRONT_END__URL}/manager/appointments/${appointment_idString}`,
      },
    });
  } catch (error) {
    return error;
  }
};
