import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Simple email sending function
async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  console.log('📧 Creating email transporter...');

  // Create transporter with hardcoded credentials (for immediate functionality)
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mispriaks@gmail.com',
      pass: 'kgbw bcef kbhr mlwf'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Email content
  const emailContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}

Message:
${data.message}

---
Submitted from Mispri website
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
  `.trim();

  console.log('📧 Sending email to mispriaks@gmail.com...');

  // Send email
  await transporter.sendMail({
    from: '"Mispri Website" <mispriaks@gmail.com>',
    to: 'mispriaks@gmail.com',
    subject: `Contact Form: ${data.subject}`,
    text: emailContent
  });

  console.log('✅ Email sent successfully!');
}

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Contact form submission received');

    const { name, email, phone, subject, message } = await request.json();
    console.log('📝 Form data:', { name, email, phone, subject, message });

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Send email directly
    await sendContactEmail({
      name,
      email,
      phone: phone || 'Not provided',
      subject: subject || 'General Inquiry',
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('❌ Error sending email:', error);

    return NextResponse.json({
      error: 'Failed to send message. Please try again later.'
    }, { status: 500, headers: corsHeaders });
  }
}