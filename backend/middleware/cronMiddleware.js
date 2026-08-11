export const requireCronSecret = (req, res, next) => {
  const secret = req.headers['x-cron-secret'];

  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};