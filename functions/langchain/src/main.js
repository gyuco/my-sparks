import { ChatOpenAI } from '@langchain/openai';

export default async ({ req, res, log, error }) => {
  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (_e) {
        log('Body is not JSON, using as is');
      }
    }

    const {
      prompt,
      model = 'openai/gpt-3.5-turbo',
      temperature = 0.7,
    } = body || {};

    if (!prompt) {
      return res.json({ error: 'Prompt is required' }, 400);
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      error('OPENROUTER_API_KEY not configured');
      return res.json({ error: 'API key not configured' }, 500);
    }

    log(`Processing request with model: ${model}`);

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
      streaming: false,
    });

    log('Invoking LLM...');
    const response = await llm.invoke(prompt);

    log('Response received');
    const content = response.content;

    return res.json({
      ok: true,
      content: content,
      model: model,
      temperature: temperature,
    });
  } catch (err) {
    error(`Error processing request: ${err.message}`);
    return res.json(
      {
        ok: false,
        error: err.message,
      },
      500
    );
  }
};
