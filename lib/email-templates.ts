const baseWrapper = (content: string) => `
  <div style="margin:0;padding:0;background-color:#f5f5f7;width:100%;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width:560px;margin:40px auto;background:white;border-radius:28px;
      padding:40px;box-shadow:0 6px 30px rgba(0,0,0,0.08);">
      ${content}
    </div>
    <p style="margin-top:20px;text-align:center;font-size:13px;color:#a0a0a5;">
      CPSS Connect — built by alumni, for students
    </p>
  </div>
`

export const templates = {
  welcome: (name: string, role: 'student' | 'alumni' | 'mentor') =>
    baseWrapper(`
      <h1 style="margin:0;font-size:32px;font-weight:600;color:#1d1d1f;text-align:center;">
        Welcome to CPSS Connect
      </h1>
      <p style="margin-top:24px;font-size:17px;line-height:1.6;color:#515154;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        You're now part of a community where ${role === 'student'
          ? 'current students can learn directly from alumni and mentors.'
          : role === 'alumni'
          ? 'alumni can share real stories, honest advice, and support current students.'
          : 'mentors can guide students with real-world experience and practical tips.'}
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        Start exploring conversations, sending messages, and building connections:
      </p>
      <div style="text-align:center;margin:40px 0;">
        <a href="https://cpss-connect.vercel.app"
          style="background:#0071e3;padding:14px 28px;border-radius:12px;color:white;
                 text-decoration:none;font-size:17px;font-weight:500;display:inline-block;">
          Open CPSS Connect
        </a>
      </div>
    `),

  messageNotification: (toName: string, fromName: string, messagePreview: string) =>
    baseWrapper(`
      <h1 style="margin:0;font-size:26px;font-weight:600;color:#1d1d1f;">
        New message from ${fromName}
      </h1>
      <p style="margin-top:20px;font-size:17px;line-height:1.6;color:#515154;">
        Hi <strong>${toName}</strong>, you received a new message on CPSS Connect:
      </p>
      <blockquote style="margin:20px 0;font-size:16px;line-height:1.6;color:#6e6e73;
        padding:16px 20px;border-radius:18px;background:#f5f5f7;">
        ${messagePreview}
      </blockquote>
      <div style="text-align:left;margin:30px 0;">
        <a href="https://cpss-connect.vercel.app"
          style="background:#0071e3;padding:12px 24px;border-radius:12px;color:white;
                 text-decoration:none;font-size:16px;font-weight:500;display:inline-block;">
          View conversation
        </a>
      </div>
    `),

  digest: (name: string, count: number) =>
    baseWrapper(`
      <h1 style="margin:0;font-size:26px;font-weight:600;color:#1d1d1f;">
        You have ${count} new ${count === 1 ? 'message' : 'messages'}
      </h1>
      <p style="margin-top:20px;font-size:17px;line-height:1.6;color:#515154;">
        Hi <strong>${name}</strong>, you've missed some activity on CPSS Connect since you last checked in.
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        Jump back in to reply, ask follow-up questions, or continue your conversations.
      </p>
      <div style="text-align:left;margin:30px 0;">
        <a href="https://cpss-connect.vercel.app"
          style="background:#0071e3;padding:12px 24px;border-radius:12px;color:white;
                 text-decoration:none;font-size:16px;font-weight:500;display:inline-block;">
          Go to CPSS Connect
        </a>
      </div>
    `),

  mentorInvite: (name: string) =>
    baseWrapper(`
      <h1 style="margin:0;font-size:26px;font-weight:600;color:#1d1d1f;">
        Join CPSS Connect as a mentor
      </h1>
      <p style="margin-top:20px;font-size:17px;line-height:1.6;color:#515154;">
        Hi <strong>${name}</strong>, we're building a private space where Central Peel students can learn directly from alumni like you.
      </p>
      <p style="font-size:17px;line-height:1.6;color:#515154;">
        As a mentor, you can answer questions, share your pathway, and give the kind of advice you wish you had in high school.
      </p>
      <div style="text-align:left;margin:30px 0;">
        <a href="https://cpss-connect.vercel.app/mentor"
          style="background:#0071e3;padding:12px 24px;border-radius:12px;color:white;
                 text-decoration:none;font-size:16px;font-weight:500;display:inline-block;">
          Become a mentor
        </a>
      </div>
    `),

  adminAlert: (subject: string, body: string) =>
    baseWrapper(`
      <h1 style="margin:0;font-size:24px;font-weight:600;color:#1d1d1f;">
        Admin alert
      </h1>
      <p style="margin-top:20px;font-size:16px;line-height:1.6;color:#515154;">
        ${body}
      </p>
    `),
}

