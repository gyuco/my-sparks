export default async ({ req, res, log }) => {
  log('Hello-world function invoked');

  return res.json({
    result: 'ok',
  });
};
