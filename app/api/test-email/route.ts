import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { templates } from '@/lib/email-templates'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: 'CPSS Connect <onboarding@resend.dev>',
      to: 'aaravmodi20@gmail.com', // Sandbox mode - only your own email
      subject: 'Welcome to CPSS Connect 🎓',
      html: templates.welcome('Aarav', 'student'),
    })

    console.log('RESEND RESPONSE:', data)
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    console.error('RESEND ERROR:', err)
    return NextResponse.json({ ok: false, error: String(err), details: err })
  }
}

