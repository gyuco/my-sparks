import { ChatOpenAI } from '@langchain/openai';

export default async ({ req, res, log, error }) => {
  try {
    // Verifica che la richiesta sia POST
    if (req.method !== 'POST') {
      return res.json({ error: 'Method not allowed' }, 405);
    }

    // Estrai i parametri dalla richiesta
    const {
      prompt,
      model = 'openai/gpt-3.5-turbo',
      temperature = 0.7,
    } = req.body;

    if (!prompt) {
      return res.json({ error: 'Prompt is required' }, 400);
    }

    // Verifica che la chiave API sia configurata
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      error('OPENROUTER_API_KEY not configured');
      return res.json({ error: 'API key not configured' }, 500);
    }

    log(`Processing request with model: ${model}`);

    // Configura il modello LangChain per OpenRouter
    const llm = new ChatOpenAI({
      modelName: model,
      temperature: temperature,
      openAIApiKey: apiKey,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:8081',
          'X-Title': process.env.APP_NAME || 'Sparks App',
        },
      },
      streaming: true,
    });

    // Imposta gli headers per lo streaming
    res.setHeaders({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    // Stream della risposta
    const stream = await llm.stream(prompt);

    for await (const chunk of stream) {
      const content = chunk.content;
      if (content) {
        res.send(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Invia evento di completamento
    res.send(`data: ${JSON.stringify({ done: true })}\n\n`);

    log('Stream completed successfully');
    return res.empty();
  } catch (err) {
    error(`Error processing request: ${err.message}`);
    return res.json({ error: err.message }, 500);
  }
};
