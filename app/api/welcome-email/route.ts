import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { templates } from '@/lib/email-templates'

export async function POST(req: Request) {
  const { email, name, role } = await req.json()

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
  }

  if (!role || (role !== 'student' && role !== 'alumni')) {
    return NextResponse.json({ error: 'Valid role is required' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'CPSS Connect <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to CPSS Connect',
      html: templates.welcome(name, role),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error sending welcome email:', err)
    // Don't fail the request if email fails - just log it
    return NextResponse.json({ 
      success: false, 
      error: err.message || 'Failed to send welcome email',
      emailSent: false 
    }, { status: 500 })
  }
}

