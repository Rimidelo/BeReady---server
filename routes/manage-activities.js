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

activitiesRouter.get('getAllActivities/', getAllActivities);
activitiesRouter.get('getActivity/:id', getActivity);
activitiesRouter.post('createActivity/', createActivity);
activitiesRouter.put('editActivity/:id', editActivity);
activitiesRouter.delete('deleteActivity/:id', deleteActivity);
activitiesRouter.post('scheduleActivity/:id', scheduleActivity);

module.exports = { activitiesRouter };
