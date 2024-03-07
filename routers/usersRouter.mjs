import {Router} from 'express'
import {
    register,
    login,
    logout,
    showProfile,
    forgotPassword,
    resetPassword,
    editProfile,
    changePassword,
    showUsers,
    showUser,
    addUser,
    editUser,
    deleteUser
} from '../controllers/usersController.mjs'
import userModel from '../models/userModel.mjs'
import searchFilter from '../middleware/searchFilter.mjs'
import {isLoggedIn, isAdmin} from '../middleware/securityHandler.mjs'
const usersRouter = Router({mergeParams: true})
usersRouter.post('/login', login)
usersRouter.get('/logout', logout)
usersRouter.post('/profile', isLoggedIn, showProfile)
usersRouter.post('/register', register)
usersRouter.put('/profile', isLoggedIn, editProfile)
usersRouter.put('/changePassword', isLoggedIn, changePassword)
usersRouter.post('/forgotPassword', forgotPassword)
usersRouter.put('/resetPassword/:passwordResetToken', resetPassword)
usersRouter.use(isAdmin('admin'))
usersRouter.route('/').get(searchFilter(userModel), showUsers).post(addUser)
usersRouter.route('/:id').get(showUser).put(editUser).delete(deleteUser)
export default usersRouter
