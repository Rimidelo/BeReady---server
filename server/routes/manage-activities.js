const { Router } = require('express');
const {
    getAllActivities,
    getActivity,
    createActivity,
    editActivity,
    deleteActivity,
    scheduleActivity
} = require('../controllers/activities-controller');

const activitiesRouter = new Router();

activitiesRouter.get('/', getAllActivities);
activitiesRouter.get('/:id', getActivity);
activitiesRouter.post('/', createActivity);
activitiesRouter.put('/:id', editActivity);
activitiesRouter.delete('/:id', deleteActivity);
activitiesRouter.post('/schedule/:id', scheduleActivity);

module.exports = { activitiesRouter };
