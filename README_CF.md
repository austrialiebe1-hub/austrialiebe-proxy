Cloudflare Worker OpenAI Proxy

1) Dateien in GitHub repo hochladen: worker.js + wrangler.toml
2) Lokales Deploy mit wrangler (wenn Admin):
   - npm i -g wrangler
   - wrangler login
   - wrangler publish
3) Secret setzen (wenn wrangler publish):
   - wrangler secret put OPENAI_KEY
4) Worker-URL verwenden: https://<dein-worker-subdomain>.workers.dev
5) Frontend macht POSTs an: https://.../openai  (Konfigurierbar)

