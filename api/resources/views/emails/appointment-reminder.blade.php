<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Reminder</title>
</head>

<body
    style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
    <!-- Container -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #4a90e2; padding: 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Appointment Reminder</h1>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <h2 style="color: #333; font-size: 20px; margin: 0 0 10px;">Hello Dear,</h2>
                            <p style="color: #666; margin: 0 0 20px;">{{ $cabinetName }} are pleased to inform you that
                                your appointment 3 tickets away so Please arrive on time</p>

                            <p style="color: #666; margin: 0;">Best regards,<br><span style="color: #4a90e2;">Your
                                    Medical Team</span></p>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td
                            style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999; font-size: 12px; margin: 0;">&copy; {{ date('Y') }} Your Medical
                                App. All rights reserved.</p>
                            <p style="color: #999; font-size: 12px; margin: 5px 0 0;">
                                Need help? <a href="mailto:support@yourapp.com"
                                    style="color: #4a90e2; text-decoration: none;">Contact Us</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
