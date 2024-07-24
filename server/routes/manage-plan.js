const { Router } = require('express');
const {
    addActivityToPlan,
    removeActivityFromPlan,
    addJobToPlan,
    removeJobFromPlan,
    getPlan
} = require('../controllers/plans-controller');

const plansRouter = new Router();

plansRouter.post('addActivityToPlan/:userid', addActivityToPlan);
plansRouter.delete('removeActivityFromPlan/:userid', removeActivityFromPlan);
plansRouter.post('addJobToPlan/:userid', addJobToPlan);
plansRouter.delete('removeJobFromPlan/:userid', removeJobFromPlan);
plansRouter.get('getPlan/:userid', getPlan);
module.exports = { plansRouter };
