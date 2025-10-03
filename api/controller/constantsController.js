const { allConstants } = require('../utils');

const getConstants = async (req, res, next) => res.json(allConstants[req.params.reqConstant]);

module.exports = { getConstants };
