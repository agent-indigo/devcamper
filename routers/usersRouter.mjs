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
usersRouter.get('/logout', isLoggedIn, logout)
usersRouter.post('/profile', isLoggedIn, showProfile)
usersRouter.post('/register', register)
usersRouter.put('/profile', isLoggedIn, editProfile)
usersRouter.put('/changePassword', isLoggedIn, changePassword)
usersRouter.post('/forgotPassword', forgotPassword)
usersRouter.put('/resetPassword/:passwordResetToken', resetPassword)
usersRouter.route('/').get(isLoggedIn, isAdmin, searchFilter(userModel), showUsers).post(isLoggedIn, isAdmin, addUser)
usersRouter.route('/:id').get(isLoggedIn, isAdmin, showUser).put(isLoggedIn, isAdmin, editUser).delete(isLoggedIn, isAdmin, deleteUser)
export default usersRouter
