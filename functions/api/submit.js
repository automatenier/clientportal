export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const { businessName, type, trackName, currentPillar, totalPillars, answersSummary, auditSummary, tierRecommendation } = body || {};

    const botToken = env?.TELEGRAM_BOT_TOKEN || '8908744012:AAH50Nn-830YBqJ7JOK-IzZEx0Ep68gofQc';
    const chatId = env?.TELEGRAM_CHAT_ID || '6228081299';

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

    await sendTelegramChunks(botToken, chatId, text);

    return new Response(JSON.stringify({ ok: true, telegram: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    }
  });
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

  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
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
