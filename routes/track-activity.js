const { Router } = require('express');
const {

} = require('../controllers/plans-controller');

const trackRouter = new Router();

trackRouter.post('addActivityToPlan/:userid', addActivityToPlan);
trackRouter.delete('removeActivityFromPlan/:userid', removeActivityFromPlan);
trackRouter.post('addJobToPlan/:userid', addJobToPlan);
trackRouter.delete('removeJobFromPlan/:userid', removeJobFromPlan);
trackRouter.get('getPlan/:userid', getPlan);
module.exports = { trackRouter };

//not finishedddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd