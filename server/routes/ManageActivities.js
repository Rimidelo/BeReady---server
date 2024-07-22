const { Router } = require('express');
const { getActivities, b, c } = require('../controllers/ManageActivitiesController');

const manageActivitiesRouter = new Router();

manageActivitiesRouter.get('/', getAllActivities);
manageActivitiesRouter.get('/getInstitudeActivities', getInstitudeActivities);
manageActivitiesRouter.get('/getActivity/:id', getActivity);
manageActivitiesRouter.post('/createActivity', createActivity);
manageActivitiesRouter.post('/editActivity/:id', editActivity);
manageActivitiesRouter.post('/deleteActivity/:id', deleteActivity);
manageActivitiesRouter.post('/scheduleActivity/:id', scheduleActivity);

module.exports = { manageActivitiesRouter };