import { Router } from 'express';
import {
    addActivityToPlan,
    removeActivityFromPlan,
    addJobToPlan,
    removeJobFromPlan,
    getPlan
} from '../controllers/plans-controller.js';

const plansRouter = new Router();

plansRouter.post('addActivityToPlan/:userid', addActivityToPlan);
plansRouter.delete('removeActivityFromPlan/:userid', removeActivityFromPlan);
plansRouter.post('addJobToPlan/:userid', addJobToPlan);
plansRouter.delete('removeJobFromPlan/:userid', removeJobFromPlan);
plansRouter.get('getPlan/:userid', getPlan);

export { plansRouter };
