export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.error('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { messages } = req.body;

  if (!messages) {
    console.error('Missing messages in request body');
    return res.status(400).json({ error: 'Missing messages in request body' });
  }

  try {
    console.log('Environment API_KEY:', process.env.API_KEY ? 'Exists' : 'Missing');

    if (!process.env.API_KEY) {
      return res.status(500).json({ error: 'API_KEY environment variable not set' });
    }

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-tput",
        messages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('API response data:', data);
    return res.status(200).json(data);

  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
