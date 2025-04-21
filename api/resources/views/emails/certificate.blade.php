<!DOCTYPE html>
<html>

<head>
    <title>Medical Certificate</title>
    <style>
        @page {
            margin: 0;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }

        .certificate-container {
            width: 800px;
            height: 1050px;
            margin: 50px auto;
            background: #fff;
            border: 10px solid #1e3a8a;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            position: relative;
            padding: 40px;
            box-sizing: border-box;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
        }

        .header img {
            width: 150px;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 36px;
            color: #1e3a8a;
            margin: 0;
            font-weight: bold;
        }

        .content {
            font-size: 18px;
            color: #333;
            line-height: 1.6;
            text-align: left;
        }

        .content p {
            margin: 15px 0;
        }

        .content strong {
            color: #1e3a8a;
        }

        .signature {
            margin-top: 60px;
            text-align: right;
        }

        .signature p {
            font-style: italic;
            font-size: 16px;
            color: #555;
        }

        .footer {
            position: absolute;
            bottom: 40px;
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #777;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 80px;
            color: rgba(0, 0, 0, 0.1);
            z-index: 0;
        }
    </style>
</head>

<body>
    <div class="certificate-container">
        <div class="watermark">Official</div>
        <div class="header">
            <div style='display:flex;gap:10px'>
                <img src="{{ public_path('images/logo.png') }}" style="width:50px;height:50px border-radius: 20%;"
                    alt="Logo">
                <h3>CarPortal</h3>
            </div>
            <h1>Medical Certificate</h1>
        </div>
        <div class="content">
            <p><strong>Patient Name:</strong> {{ $patient_name }}</p>
            <p><strong>Appointment Date:</strong> {{ $appointment_date }}</p>
            <p><strong>Issued by:</strong> Dr. {{ $doctor_name }}</p>
            <p><strong>Issued Date:</strong> Dr. {{ $issue_date }}</p>
            <p><strong>Expiry Date:</strong> Dr. {{ $expiration_date }}</p>
            <p>This is to certify that the above-named patient has been examined and is advised to follow the prescribed
                medical advice.</p>
            <h3>Diagnosis:</h3>
            <p>{{ $diagnosis }}</p>
            <h3>Recommendations:</h3>
            <p> {{ $recommendations }}</p>
        </div>
        <div class="signature">
            <p>Signature: ______________________</p>
            <p>Dr. {{ $doctor_name }}</p>
        </div>
        <div class="footer">
            <p>Issued by {{ $doctor_name }}| Contact: {{ $cabinet_email }}</p>
        </div>
    </div>
</body>

</html>
