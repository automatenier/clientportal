# AGentZ Client Progress Portal (`clientportal`)

Interactive client delivery & progress portal for AGentZ workforce rollouts.

## 🚀 Live Deployments
- **Cloudflare Pages (Primary / Live)**: [https://clientportal-2jc.pages.dev](https://clientportal-2jc.pages.dev)
- **Vercel**: [https://clientportal-omega-six.vercel.app](https://clientportal-omega-six.vercel.app)
- **GitHub Pages**: [https://automatenier.github.io/clientportal/](https://automatenier.github.io/clientportal/)
- **GitHub Repository**: [https://github.com/automatenier/clientportal](https://github.com/automatenier/clientportal)

## 🛠 Tech Stack
- Standalone HTML5 / CSS3 / Vanilla JS
- Fully responsive layout (desktop & mobile)
- Zero external build dependencies

## Profile Studio
Setup & Build → Profile (setelah Konten draf) memuat `profile.html` di kedua entri portal. Menyediakan mockup visual untuk **Instagram** dan **YouTube Channel** (serta TikTok, Google Business, dan Website). Dilengkapi properties inspector live, penggantian foto langsung (avatar, banner YouTube, thumbnail video, feed posts), pengaturan pan/zoom, serta ekspor/impor draft JSON yang disimpan di local storage browser (`agentz-profile-studio-v1`). Terdapat tombol **Mode Presentasi** untuk menyembunyikan inspector saat presentasi langsung di depan klien.

## Hasil Konten (Katalog Reels & Shorts 9:16)
Setup & Build → Hasil konten (setelah Profile) memuat `hasil-konten.html`. Menampilkan katalog vertikal (9:16) dari video-video yang telah selesai diedit (color graded dengan 3D LUT, subtitle dinamis, clean audio).
- **Video Preview Interaktif**: Klik kartu atau tombol play untuk membuka Cinema Lightbox Modal dengan pemutar video responsif berbingkai smartphone.
- **Konsol Approval Klien**: Menampilkan hook 3 detik pembuka, spesifikasi teknis (1080×1920 60FPS Rec.709), status persetujuan (Approved, Siap Review, Butuh Revisi), serta kotak catatan revisi klien yang tersimpan di browser.
- **Upload & Ganti Video Mandiri**: Pengguna atau klien dapat mengunggah file video MP4 baru dari komputer atau menempelkan tautan video URL langsung.
- **Kategori & Filter**: Dilengkapi filter format (Hook & Edukasi, Fast-Cut Showcase, Screencast & Alur, Review & Listicle), pencarian instan, dan penambahan video baru via formulir modal.
