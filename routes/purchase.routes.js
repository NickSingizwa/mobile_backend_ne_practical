const express = require('express');
const {
    purchaseElectricity,
    validateToken,
    getAllTokensWithGivenMeterNumebr
} = require('../controllers/purchase.controller');
const router = express.Router();
router.post('/purchase', purchaseElectricity);
router.get('/tokens/:meter_number', getAllTokensWithGivenMeterNumebr);
router.get('/validate/:token', validateToken)
module.exports.router = router;