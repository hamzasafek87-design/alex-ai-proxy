export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST kabul edilir" });
  }

  const { messages, system } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY tanımlı değil" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: system || "Sen Alex AI adlı yardımcı bir yapay zekasın."
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json(data);
    }

    const text = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}