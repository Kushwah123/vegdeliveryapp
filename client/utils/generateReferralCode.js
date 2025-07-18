export const generateReferralCode = (name) => {
  const base = name.toLowerCase().replace(/\s+/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};
