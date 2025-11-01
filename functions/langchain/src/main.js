export default async ({ req, res, log }) => {
  log('Langchain function invoked');

  return res.json({
    result: 'langchain',
  });
};
