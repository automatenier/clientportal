# Profile editor
Acceptance: Profile tab after personal brand assets in both portal entrypoints; independent Instagram and TikTok mockups; live properties inspector, image uploads and framing, editable highlights/posts, durable browser drafts, JSON export/import; responsive layout.
Scope: profile planning mockups, no real social-account changes. Preserve existing portal workflows.
Decision: isolated same-origin iframe editor follows local carousel preview/inspector pattern. Browser-local persistence clearly labelled; exported JSON allows draft transfer.
Verification: syntax, portal integration, interactive browser checks, Cloudflare deployment when available.

Verified: JS syntax; both portal entrypoints; independent platform state; reload persistence; live text and pan edits; saved filtering; post add/remove; upload; JSON export/import roundtrip; invalid import preserves current state; 390px responsive width; no browser exceptions; git diff --check.
Deployment blocked: Wrangler has no authenticated Cloudflare session; GitHub stored token fails authentication. Local preview: http://localhost:5099/?mode=setup (Profile tab). No production deployment performed.

Follow-up: added per-post [[filename]] references with 400ms debounced resolution through the existing carousel endpoint; bulk insertion with one reference per line; embedded resolved images; race protection and missing-image preservation. Verified in Chromium against the real localhost:5001 resolver with keyframe1.jpg and keyframe2.jpg: resolution, reload persistence, missing-file preservation, bulk insertion, independent platform feeds, image-field references, syntax and diff checks. Production authentication blocker unchanged.

Avatar follow-up: explicit avatar reference field and Render filename into profile button; also accepts wikilinks pasted in Avatar. Verified real resolver success, explicit render behavior, embedded avatar reload persistence, missing-file preservation, and independent Instagram/TikTok avatars. Syntax and diff checks passed.

Google Business and Website follow-up: added two selectable profile mockups, editable listing data/photos and an editable business website with WhatsApp CTA. Based Google profile content on the live map listing. Verified in the local browser: Google Business preview displays 4.6/10, listing name/category/address/hours/phone, photos, and an editable properties pane; Website preview displays editable storefront copy, products, and WhatsApp CTA. Google website field is empty because the linked listing has no website.

Vercel site investigation: the browser displays `ERR_ADDRESS_UNREACHABLE` for `paksiswoko.vercel.app`; a CLI inspect also could not fetch the Vercel API. DNS resolves the hostname to Vercel edge IPs, and other Vercel endpoints are likewise unreachable from this environment. The PakSiswoko Git repository is clean on `main` at commit 0fd7ce0 (2026-10-04); local cached Vercel build output is dated 2026-10-02. Evidence confirms the current request cannot reach Vercel, but cannot establish whether the external project deployment itself is suspended or an edge/network issue. Do not claim the Vercel deployment was fixed.
