import express from 'express'
import { login, logout, myRentedBooks, register } from '../controllers/userController.js';
import { deleteBook, getAllBooks, getMyBooks, publishBook, updateBook } from '../controllers/bookController.js';
import { isAdmin, isAuthor, verifyJwt } from '../middlewares/authMiddleware.js';
import { createGenre, deleteGenre, getBookByGenre } from '../controllers/genreController.js';
import { getRentDetails } from '../controllers/rentalController.js';
const router=express.Router()

//authentication routes
router.route("/signUp").post(register)
router.route("/login").post(login)

// user authorize routes
router.route("/logout").post(verifyJwt,logout)
router.route("/allBooks").get(verifyJwt,getAllBooks)
router.route("/myRentedBooks").get(verifyJwt,myRentedBooks)
router.route("/getGrenreBooks").get(verifyJwt,getBookByGenre)

//author authorize routes
router.route("/publishBook").post(verifyJwt,isAuthor,publishBook)
router.route("/updateBook").patch(verifyJwt,isAuthor,updateBook)
router.route("/deletBook").delete(verifyJwt,isAuthor,deleteBook)
router.route("/getMyBooks").get(verifyJwt,isAuthor,getMyBooks)

//admin authorize routes
router.route("/createGenre").post(verifyJwt,isAdmin,createGenre)
router.route("/deleteGenere").delete(verifyJwt,isAdmin,deleteGenre)
router.route("/getRentDetails").get(verifyJwt,isAdmin,getRentDetails)

export default router;