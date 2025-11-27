// worker.js - Cloudflare Worker OpenAI proxy
export default {
  async fetch(request, env) {
    try {
      // Nur POST erlauben
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      // Weiterleiten an OpenAI
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const body = await request.text(); // weiterleiten ohne Modifikation

      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // SECRET in wrangler/env als OPENAI_KEY setzen
          "Authorization": `Bearer ${env.OPENAI_KEY || env.OPENAI_API_KEY || ""}`,
        },
        body,
      });

      // Response passt so durch
      const text = await resp.text();
      return new Response(text, {
        status: resp.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message || String(err) }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
};

