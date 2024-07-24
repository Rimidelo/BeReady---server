const { Router } = require('express');
const {
    getPlan,
    createPlan,
    editPlan,
    editActivity,
    deleteActivity,
    scheduleActivity
} = require('../controllers/plans-controller');

const plansRouter = new Router();

plansRouter.get('/:id', getPlan);
plansRouter.post('/', createPlan);
plansRouter.put('/:id', editPlan);
module.exports = { plansRouter };
