(() => {
  'use strict';
  const key = 'agentz-brand-asset-links-v1';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch {}
  const style = document.createElement('style');
  style.textContent = '.asset-link-editor{display:grid;gap:7px;margin-top:10px;font-size:12px}.asset-link-editor label{display:grid;gap:4px}.asset-link-editor input{box-sizing:border-box;width:100%;min-width:0;padding:8px;border:1px solid #ccd9cf;border-radius:7px;font:inherit}.asset-link-editor button{padding:8px;border:1px solid #ccd9cf;border-radius:7px;background:#eef7f0;color:#173a30;cursor:pointer}.asset-link-status{font-size:11px;line-height:1.5}.asset-link-editor summary{cursor:pointer;font-weight:700}.asset-link-editor form{display:grid;gap:7px;margin-top:8px}';
  document.head.append(style);
  document.querySelectorAll('#assets .build-card-side').forEach((side, index) => {
    const id = `asset-${index + 1}`;
    const preview = side.querySelector('.screenshot-wrap');
    const link = side.querySelector('a');
    const zoom = side.querySelector('.zoom-hint');
    if (!preview || !link) return;
    const original = preview.innerHTML;
    const editor = document.createElement('details');
    editor.className = 'asset-link-editor';
    editor.innerHTML = `<summary>Atur link & thumbnail</summary><form><label>Link file / folder Google Drive<input name="drive" type="url" placeholder="https://drive.google.com/drive/folders/…" aria-label="Link Google Drive aset ${index + 1}"></label><label>URL thumbnail (opsional)<input name="thumbnail" type="url" placeholder="https://…/thumbnail.jpg" aria-label="Thumbnail aset ${index + 1}"></label><button type="submit">Simpan referensi</button><small>Tersimpan di browser ini. Kosongkan link untuk kembali ke contoh.</small></form>`;
    const status = document.createElement('p');
    status.className = 'asset-link-status';
    status.setAttribute('role', 'status');
    side.append(status, editor);
    const form = editor.querySelector('form');
    function validUrl(value, drive = false) {
      if (!value) return '';
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password) throw Error('Gunakan URL HTTPS yang valid.');
      if (drive && (!['drive.google.com', 'docs.google.com'].includes(url.hostname) || url.pathname === '/')) throw Error('Tempel link file atau folder Google Drive yang lengkap.');
      return url.href;
    }
    function apply() {
      let entry = saved[id] || {};
      try { entry = { drive: validUrl(entry.drive, true), thumbnail: validUrl(entry.thumbnail) }; }
      catch { entry = {}; }
      form.elements.drive.value = entry.drive || '';
      form.elements.thumbnail.value = entry.thumbnail || '';
      preview.innerHTML = original;
      if (entry.thumbnail) {
        const img = document.createElement('img');
        img.src = entry.thumbnail;
        img.alt = 'Referensi aset brand';
        img.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;border-radius:8px';
        img.onerror = () => { preview.innerHTML = original; status.textContent = 'Thumbnail tidak dapat dimuat. Contoh ditampilkan; link Drive tetap tersimpan.'; };
        preview.replaceChildren(img);
      }
      const open = () => {
        if (entry.drive) window.open(entry.drive, '_blank', 'noopener,noreferrer');
        else { editor.open = true; form.elements.drive.focus(); }
      };
      preview.removeAttribute('onclick');
      preview.onclick = open;
      preview.setAttribute('role', 'button');
      preview.tabIndex = 0;
      preview.setAttribute('aria-label', entry.drive ? 'Buka referensi aset di Google Drive' : 'Atur referensi aset');
      preview.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
      link.removeAttribute('onclick');
      if (entry.drive) link.href = entry.drive;
      else link.removeAttribute('href');
      link.textContent = entry.drive ? '📁 Buka referensi di GDrive ↗' : '📁 Atur link Google Drive';
      link.onclick = e => { if (!entry.drive) { e.preventDefault(); open(); } };
      if (zoom) { zoom.removeAttribute('onclick'); zoom.onclick = open; }
      status.textContent = entry.drive ? 'Referensi tersimpan di browser ini.' : 'Contoh visual · Link Google Drive belum diatur.';
    }
    form.onsubmit = event => {
      event.preventDefault();
      try {
        const entry = { drive: validUrl(form.elements.drive.value.trim(), true), thumbnail: validUrl(form.elements.thumbnail.value.trim()) };
        const next = { ...saved, [id]: entry };
        localStorage.setItem(key, JSON.stringify(next));
        saved = next;
        apply();
        editor.open = false;
      } catch (error) { status.textContent = error.message; }
    };
    apply();
  });
})();
