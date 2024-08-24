import { Router } from 'express';
import {
    getAllActivities,
    getActivity,
    createActivity,
    editActivity,
    deleteActivity,
    scheduleActivity,
    getActivitiesByInstitute
} from '../controllers/activities-controller.js';

const activitiesRouter = new Router();

activitiesRouter.get('/getAllActivities/', getAllActivities);
activitiesRouter.get('/getActivitiesByInstitute/:instituteId', getActivitiesByInstitute);
activitiesRouter.get('/getActivity/:id', getActivity);
activitiesRouter.post('/createActivity/', createActivity);
activitiesRouter.put('/editActivity/:id', editActivity);
activitiesRouter.delete('/deleteActivity/:id', deleteActivity);
activitiesRouter.post('/scheduleActivity/:id', scheduleActivity);

export { activitiesRouter };
