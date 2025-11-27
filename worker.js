export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Weiterleitung aller Anfragen an die OpenAI API
    const apiUrl = "https://api.openai.com/v1" + url.pathname;

    const response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        "Authorization": `Bearer ${env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: request.method !== "GET" ? await request.text() : null
    });

    return response;
  }
};
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Weiterleitung aller Anfragen an die OpenAI API
    const apiUrl = "https://api.openai.com/v1" + url.pathname;

    const response = await fetch(apiUrl, {
      method: request.method,
      headers: {
        "Authorization": `Bearer ${env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: request.method !== "GET" ? await request.text() : null
    });

    return response;
  }
};
