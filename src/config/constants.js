module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  PORT: process.env.PORT || 3000,
  JWT_EXPIRES_IN: '1h',
  DEPOSIT_AMOUNT: 50.00
};

