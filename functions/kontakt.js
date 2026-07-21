export async function onRequestPost({ request, env }) {
  try {
    const { name, email, topic, message } = await request.json();
    if (!name || !email || !topic || !message)
      return new Response('Brak pól', { status: 400 });
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Fundacja Zdrowie z Pasją <kontakt@mvautoai.net>',
        to: ['fundacjazdrowiezpasja@gmail.com'],
        reply_to: email,
        subject: `[${topic}] Wiadomość od: ${name}`,
        text: `Imię: ${name}\nEmail: ${email}\nTemat: ${topic}\n\nWiadomość:\n${message}`
      })
    });
    return new Response(r.ok ? 'OK' : 'Resend error', { status: r.ok ? 200 : 502 });
  } catch (e) { return new Response('Error', { status: 500 }); }
}
