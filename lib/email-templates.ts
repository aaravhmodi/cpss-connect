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
  welcome: (name: string, role: 'student' | 'alumni' | 'teacher') =>
    baseWrapper(`
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="margin:0;font-size:32px;font-weight:600;color:#1d1d1f;letter-spacing:-0.5px;">
          Welcome to CPSS Connect
        </h1>
        <p style="margin-top:8px;font-size:16px;color:#86868b;font-weight:400;">
          Your profile is ready!
        </p>
      </div>
      
      <p style="margin-top:0;font-size:17px;line-height:1.6;color:#1d1d1f;">
        Hi <strong style="color:#1d1d1f;">${name}</strong>,
      </p>
      
      <p style="margin-top:20px;font-size:17px;line-height:1.6;color:#515154;">
        ${role === 'student'
          ? "Welcome to CPSS Connect! You're now part of a private community where current students can connect directly with alumni, ask questions about pathways and programs, get honest advice, and learn from real experiences."
          : role === 'alumni'
          ? "Welcome to CPSS Connect! You're now part of a community where alumni can support current students by sharing your experiences, answering questions about pathways and careers, and helping the next generation succeed."
          : "Welcome to CPSS Connect! As a teacher, you can support students, connect with alumni, and help build a stronger CPSS community."}
      </p>
      
      <p style="margin-top:20px;font-size:17px;line-height:1.6;color:#515154;">
        Here's what you can do now:
      </p>
      
      <ul style="margin-top:16px;margin-bottom:24px;padding-left:24px;font-size:17px;line-height:1.8;color:#515154;">
        <li style="margin-bottom:8px;">${role === 'student' ? 'Browse alumni profiles and learn about different pathways' : role === 'alumni' ? 'Share your journey and help students discover opportunities' : 'Connect with students and alumni in your subject area'}</li>
        <li style="margin-bottom:8px;">${role === 'student' ? 'Connect with alumni and ask questions' : role === 'alumni' ? 'Connect with students and share advice' : 'Support students with guidance and mentorship'}</li>
        <li style="margin-bottom:8px;">Build your network within the CPSS community</li>
      </ul>
      
      <div style="text-align:center;margin:40px 0;">
        <a href="https://cpss-connect.vercel.app"
          style="background:#0071e3;padding:16px 32px;border-radius:12px;color:white;
                 text-decoration:none;font-size:17px;font-weight:600;display:inline-block;
                 box-shadow:0 4px 14px rgba(0,113,227,0.25);transition:all 0.2s;">
          Get Started on CPSS Connect
        </a>
      </div>
      
      <p style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e5e7;font-size:15px;line-height:1.6;color:#86868b;text-align:center;">
        If you have any questions, feel free to reach out. We're here to help you make the most of your CPSS Connect experience.
      </p>
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

