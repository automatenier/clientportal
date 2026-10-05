// codebases/internal/discovery-web/api/submit.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { businessName, type, trackName, currentPillar, totalPillars, answersSummary, auditSummary, tierRecommendation } = req.body || {};

    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8908744012:AAH50Nn-830YBqJ7JOK-IzZEx0Ep68gofQc';
    const chatId = process.env.TELEGRAM_CHAT_ID || '6228081299';

    let header = '📋 DISCOVERY UPDATE';
    if (type === 'pillar_complete') {
      header = `✅ PILAR ${currentPillar}/${totalPillars} SELESAI: ${trackName?.toUpperCase() || ''}`;
    } else if (type === 'discovery_complete') {
      header = '🎉 DISCOVERY & AUDIT SELESAI LENGKAP';
    }

    const name = businessName || 'Usaha Klien';
    let text = `<b>${header}</b>\n🏢 <b>Klien:</b> ${escapeHtml(name)}\n`;

    if (trackName) {
      text += `📌 <b>Pilar:</b> ${escapeHtml(trackName)}\n`;
    }
    if (tierRecommendation) {
      text += `🎯 <b>Rekomendasi Paket:</b> Tier ${tierRecommendation}\n`;
    }
    if (answersSummary) {
      text += `\n<b>Detail Jawaban Lengkap:</b>\n${answersSummary}\n`;
    }
    if (auditSummary) {
      text += `\n<b>Ringkasan Audit Aset Digital:</b>\n${escapeHtml(auditSummary)}\n`;
    }

    text += `\n<i>Waktu: ${new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</i>`;

    // Send using HTML mode with chunking if > 3900 chars
    await sendTelegramChunks(botToken, chatId, text);

    return res.status(200).json({ ok: true, telegram: true });
  } catch (err) {
    console.error('Error submitting discovery update:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function sendTelegramChunks(token, chatId, fullText) {
  const MAX_LEN = 3800;
  if (fullText.length <= MAX_LEN) {
    return sendSingle(token, chatId, fullText);
  }

  // Split by double newline or single newline
  const lines = fullText.split('\n');
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + '\n' + line).length > MAX_LEN) {
      if (currentChunk.trim()) {
        await sendSingle(token, chatId, currentChunk);
        currentChunk = '';
      }
    }
    currentChunk += (currentChunk ? '\n' : '') + line;
  }

  if (currentChunk.trim()) {
    await sendSingle(token, chatId, currentChunk);
  }
}

async function sendSingle(token, chatId, text) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    })
  });

  const data = await res.json();
  if (!data.ok) {
    // Retry as plain text if HTML parsing failed
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.replace(/<[^>]+>/g, '')
      })
    });
  }
}
