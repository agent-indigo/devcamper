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
usersRouter.post('/register', register)
usersRouter.post('/forgotPassword', forgotPassword)
usersRouter.put('/resetPassword/:passwordResetToken', resetPassword)
usersRouter.use(isLoggedIn)
usersRouter.get('/logout', logout)
usersRouter.post('/profile', showProfile)
usersRouter.put('/profile', editProfile)
usersRouter.put('/changePassword', changePassword)
usersRouter.use(isAdmin('admin'))
usersRouter.get('/', searchFilter(userModel), showUsers)
usersRouter.post('/', addUser)
usersRouter.get('/:id', showUser)
usersRouter.put('/:id', editUser)
usersRouter.delete('/:id', deleteUser)
export default usersRouter
