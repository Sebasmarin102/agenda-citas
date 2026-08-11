import { getBusiestHours, getBusiestDays, getFrequentClients, getNoShowRate } from '../models/statsModel.js';

export const getDashboard = async (req, res) => {
  try {
    const [busiestHours, busiestDays, frequentClients, noShowStats] = await Promise.all([
      getBusiestHours(),
      getBusiestDays(),
      getFrequentClients(),
      getNoShowRate(),
    ]);

    const noShowRate = noShowStats.total > 0
      ? Math.round((noShowStats.no_shows / noShowStats.total) * 100)
      : 0;

    res.json({ busiestHours, busiestDays, frequentClients, noShowRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
};