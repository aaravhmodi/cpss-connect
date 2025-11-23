import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  const { email, name } = await req.json()

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'CPSS Connect <onboarding@cpssconnect.xyz>',
      to: email,
      subject: 'Welcome to CPSS Connect 🎓',
      html: `
  <div style="margin:0;padding:0;background-color:#f5f5f7;width:100%;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:white;border-radius:28px;padding:40px;box-shadow:0 6px 30px rgba(0,0,0,0.08);">
      <h1 style="margin:0;font-size:32px;font-weight:600;color:#1d1d1f;text-align:center;">
        Welcome to CPSS Connect
      </h1>
      <p style="margin-top:24px;font-size:17px;line-height:1.6;color:#515154;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        You are now officially part of the CPSS Connect community — a place where students and alumni can support each other, share real experiences, and help the next generation succeed.
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        You can now connect with alumni, ask questions about pathways, get study advice, and explore real stories from students who have been in your shoes.
      </p>
      <div style="text-align:center;margin:40px 0;">
        <a href="https://cpss-connect.vercel.app"
          style="background:#0071e3;padding:14px 28px;border-radius:12px;color:white;
                 text-decoration:none;font-size:17px;font-weight:500;display:inline-block;">
          Open CPSS Connect
        </a>
      </div>
      <p style="font-size:15px;line-height:1.6;color:#8e8e93;text-align:center;">
        Let's build a stronger CPSS community — together.
      </p>
    </div>
    <p style="margin-top:20px;text-align:center;font-size:13px;color:#a0a0a5;">
      CPSS Connect — built by alumni, for students
    </p>
  </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error sending welcome email:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

