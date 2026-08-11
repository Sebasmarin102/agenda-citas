export const getTodayDateString = () => {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' });
}