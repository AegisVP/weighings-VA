const heathCheck = (_, res) => {
  return res.status(200).json({ message: 'OK' });
};

module.exports = heathCheck;
