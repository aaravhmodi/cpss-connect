import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'
import { templates } from '@/lib/email-templates'

export async function POST(req: Request) {
  const { email, name, role } = await req.json()

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'CPSS Connect <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to CPSS Connect 🎓',
      html: templates.welcome(name, role || 'student'),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error sending welcome email:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

