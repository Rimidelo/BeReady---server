import { Router } from 'express';
import {
    getAllActivities,
    createActivity,
    editActivity,
    deleteActivity,
    scheduleActivity,
    getActivitiesByInstitute
} from '../controllers/activities-controller.js';

const activitiesRouter = new Router();

activitiesRouter.get('/getAllActivities/', getAllActivities);
activitiesRouter.get('/getActivitiesByInstitute/:instituteID', getActivitiesByInstitute);
activitiesRouter.post('/createActivity/', createActivity);
activitiesRouter.put('/editActivity/:activityID', editActivity);
activitiesRouter.delete('/deleteActivity/:ActivityID', deleteActivity);
activitiesRouter.post('/scheduleActivity/:activityID', scheduleActivity);

export { activitiesRouter };
