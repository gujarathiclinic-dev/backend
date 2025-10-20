import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";
import Razorpay from 'razorpay';
import dotenv from "dotenv";
import crypto from 'crypto';
import serverless from 'serverless-http';

dotenv.config();


const prisma = new PrismaClient();
const router = express.Router();

const app = express();

app.use(express.json());
// app.use(cors());

app.use(cors({
    origin: ['https://gujrathi-clinic-website.vercel.app'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gujarathiclinic@gmail.com",
        // pass: "lmcv zbwq txiq rwho"  // tsuk
        pass: "igyg tcdk qwvc isty"     //drguj
    }
});



app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/start', (req, res) => {
    res.json({message:'Server is runasdning'});
});

app.post('/api/consultation', async (req, res) => {
    try {
        const consultationData = req.body.formData;
        console.log(consultationData);
        console.log(consultationData.name);


        const data = await prisma.patientForm.create({
            data: {
                name: consultationData.name,
                age: parseInt(consultationData.age),
                phone: consultationData.phone,
                symptoms: consultationData.symptoms,
                gender: consultationData.gender,
                email: consultationData.email
            },
        });
        console.log(data);

        // Email to Doctor
        await transporter.sendMail({
            from: "gujarathiclinic@gmail.com",
            to: "Shrutikamatte1999@gmail.com",
            subject: `New Appointment - ${data.name}`,
            html: `
            <!doctype html>
            <html>
            <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            </head>
                        <body style="margin:0;padding:0;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background:#f4f6f8;">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                        <td align="center" style="padding:24px 12px;">
                        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(20,20,20,0.08);">
                        <tr>
                        <td style="padding:20px 28px;background:linear-gradient(90deg,#10b981,#06b6d4);color:#fff;">
                        <h1 style="margin:0;font-size:20px;font-weight:700;">New Appointment Booked</h1>
                        <p style="margin:6px 0 0;font-size:13px;opacity:0.95;">A patient has requested an appointment — details below.</p>
                        </td>
                        </tr>
                        
                                    <tr>
                                    <td style="padding:20px 28px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                                    <tr>
                                    <td style="padding-bottom:12px;">
                                    <strong style="display:block;font-size:14px;color:#111827;">Patient</strong>
                                    <div style="font-size:15px;color:#374151;margin-top:6px;">${data.name} &nbsp; • &nbsp; ${data.age} yrs</div>
                                    </td>
                                    <td style="padding-bottom:12px;text-align:right;">
                                    <strong style="display:block;font-size:14px;color:#111827;">Booked At</strong>
                                            <div style="font-size:13px;color:#6b7280;margin-top:6px;">${new Date(data.createdAt).toLocaleTimeString()}</div>
                                            </td>
                                        </tr>

                                        <tr>
                                        <td colspan="2" style="padding:12px 0;">
                                        <table width="100%" cellpadding="8" cellspacing="0" role="presentation" style="border:1px solid #e6e9ee;border-radius:8px;">
                                        <tr>
                                        <td style="font-size:13px;color:#6b7280;width:28%;"><strong>Name</strong></td>
                                        <td style="font-size:14px;color:#111827;">${data.name}</td>
                                        </tr>
                                        <tr style="background:#f9fafb;">
                                        <td style="font-size:13px;color:#6b7280;"><strong>Email</strong></td>
                                        <td style="font-size:14px;color:#111827;">${data.email || "—"}</td>
                                        </tr>
                                                <tr>
                                                <td style="font-size:13px;color:#6b7280;"><strong>Phone</strong></td>
                                                <td style="font-size:14px;color:#111827;">${data.phone || "—"}</td>
                                                </tr>
                                                <tr style="background:#f9fafb;">
                                                <td style="font-size:13px;color:#6b7280;"><strong>Gender</strong></td>
                                                <td style="font-size:14px;color:#111827;">${data.gender || "—"}</td>
                                                </tr>
                                                <tr>
                                                <td style="font-size:13px;color:#6b7280;vertical-align:top;"><strong>Symptoms</strong></td>
                                                <td style="font-size:14px;color:#111827;white-space:pre-wrap;">${data.symptoms || "—"}</td>
                                                </tr>
                                                </table>
                                                </td>
                                                </tr>
                                                
                                                <tr>
                                                <td colspan="2" style="padding-top:14px;">
                                                <a href="mailto:${data.email}" style="display:inline-block;padding:10px 16px;border-radius:8px;background:#10b981;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">
                                                Reply to Patient
                                                </a>

                                            <span style="display:inline-block;margin-left:12px;color:#6b7280;font-size:13px;">or view all appointments in your dashboard.</span>
                                            </td>
                                            </tr>
                                            
                                            </table>
                                            </td>
                                            </tr>

                                    <tr>
                                    <td style="padding:16px 28px;background:#f8fafc;color:#6b7280;font-size:12px;">
                                    This email was sent by Gujarat Clinic. <br />
                                    <span style="color:#9ca3af">If you think this is a mistake, please contact the clinic admin.</span>
                                    </td>
                                    </tr>
                                    
                                    </table>
                                    </td>
                            </tr>
                            </table>
                            </body>
                            </html>
                            `
        });


        // Email to Patient
        await transporter.sendMail({
            from: "gujarathiclinic@gmail.com",
            to: data.email,
            subject: "Appointment Confirmation",
            html: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                            <style>
                            /* Basic Reset and Font Style */
                            body {
                                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                background-color: #f4f4f9;
                                margin: 0;
                                padding: 0;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 20px auto;
                                    background-color: #ffffff;
                                    border-radius: 8px;
                                    overflow: hidden;
                                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                                    }
                                    .header {
                                        background-color: #007bff; /* A clean, professional blue */
                                        color: white;
                                        padding: 30px 20px;
                                        text-align: center;
                                        }
                                        .header h1 {
                                            margin: 0;
                                            font-size: 28px;
                                            letter-spacing: 1px;
                                            }
                                            .content {
                                                padding: 30px 20px;
                                                }
                    .detail-box {
                        background-color: #e9f7ff; /* Light blue background for details */
                        border-left: 5px solid #007bff;
                        padding: 15px;
                        margin: 25px 0;
                        border-radius: 4px;
                        }
                        .detail-box p {
                            margin: 8px 0;
                            font-size: 16px;
                            }
                            .highlight {
                        font-weight: bold;
                        color: #007bff;
                        }
                        .footer {
                            background-color: #f1f1f1;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #888;
                            border-top: 1px solid #ddd;
                            }
                            </style>
                            </head>
                            <body>
                            <div class="container">
                    <div class="header">
                    <h1>Appointment Confirmed! 🎉</h1>
                    </div>
                    <div class="content">
                        <p style="font-size: 18px;">Dear <strong style="color: #007bff;">${data.name}</strong>,</p>
                        <p>We're thrilled to let you know that your appointment has been successfully booked!</p>

                        <h2>Your Appointment Details</h2>
                        
                        <div class="detail-box">
                        <p><strong>🧑‍⚕ Doctor:</strong> <span class="highlight">Dr. XYZ</span></p>
                            <p><strong>📅 Date:</strong> <span class="highlight">${new Date(data.createdAt).toLocaleDateString()}</span></p>
                            <p><strong>⏰ Booking Time:</strong> <span class="highlight">${new Date(data.createdAt).toLocaleTimeString()}</span></p>
                            </div>
                            
                            <p>Please arrive 10 minutes early to complete any necessary paperwork.</p>
                            
                            <p style="text-align: center; margin-top: 40px;">
                            <a href="https://www.google.com/maps/place/Dr.+Gujarathi's+Homoeopathic+Clinic/@18.5859389,73.8118751,19z/data=!4m16!1m7!3m6!1s0x3bc2b91dfab6ea5b:0x4fb8e90dfc8e5ea7!2sDr.+Gujarathi's+Homoeopathic+Clinic!8m2!3d18.5862446!4d73.8122205!16s%2Fg%2F11fkd_1l92!3m7!1s0x3bc2b91dfab6ea5b:0x4fb8e90dfc8e5ea7!8m2!3d18.5862446!4d73.8122205!9m1!1b1!16s%2Fg%2F11fkd_1l92?entry=ttu&g_ep=EgoyMDI1MDkzMC4wIKXMDSoASAFQAw%3D%3D" 
                            style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View Clinic Location</a>
                            </p>
                            
                            <p style="margin-top: 30px;">Thank you for choosing our clinic. We look forward to seeing you!</p>
                            </div>
                            <div class="footer">
                        Sent from gujarathiclinic@gmail.com | &copy; ${new Date().getFullYear()} Our Clinic Name
                        </div>
                        </div>
                        </body>
                        </html>
                        `

        });
        res.status(200).json({ message: 'Appointment Booked successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error booking appointment" });
    }
});

app.get('/api/consultations', async (req, res) => {
    const consultations = await prisma.patientForm.findMany();
    res.json(consultations);
});



app.post("/order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || !currency || !receipt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amount, // already in paise from frontend
      currency,
      receipt,
      payment_capture: 1, // auto capture payment
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
});

// ✅ Validate Payment
app.post("/order/validate", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    console.log("1");
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    console.log("2");
    
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign)
      .digest("hex");

    console.log("3");
    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Transaction verification failed" });
    }

    res.status(200).json({
      message: "success",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      success:true
    });
  } catch (error) {
    console.error("Payment validation error:", error);
    res.status(500).json({ message: "Error validating payment" });
  }
});

export const handler = serverless(app);



// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });