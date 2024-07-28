const { Router } = require('express');
const {
    getProfile,
    createProfile,
    editProfile,
    deleteProfile,
} = require('../controllers/profile-controller');

const profileRouter = new Router();

profileRouter.get('/:id', getProfile);
profileRouter.post('/', createProfile);
profileRouter.put('/:id', editProfile);
profileRouter.delete('/:id', deleteProfile);

module.exports = { profileRouter };
