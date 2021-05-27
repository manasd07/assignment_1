// importing express Router
import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  inviteUser,
  listDescendants,
  getTopMostAncestor,
} from "../controllers/user.controller";

import auth from "../middlewares/auth";

/**
 * Route for Getting Users
 * @route GET/users
 * @desc GET Users list from database
 * @access PRIVATE
 */
router.get("/", auth, (req, res) => {
  findAllUsers(req, res);
});

/**
 * Route for Register user
 * @route POST /users
 * @desc CREATE or add user
 * @access PUBLIC
 */
router.post("/register", (req, res) => {
  const userDetails = { ...req.body };
  registerUser(userDetails, res);
});

/** Route for Login user
 * @route POST /users/login
 * @desc AUTH USER, JWT sign token
 * @access PUBLIC
 */
router.post("/login", (req, res) => {
  const userDetails = { ...req.body };
  loginUser(userDetails, res);
});
/** Route for Getting users by id
 * @route GET /users/:id
 * @desc GET user by id
 * @access PRIVATE
 */
router.get("/:id", auth, (req, res) => {
  findUserById(req.params.id, res);
});
/** Route for Updating user
 * @route PUT /users/:id
 * @desc PUT | update user by id
 * @access PRIVATE
 */
router.put("/:id", auth, (req, res) => {
  const userDetails = { ...req.body };
  updateUser(req.params.id, userDetails, res);
});
/** Route for deleting users
 * @route DELETE /users/:id
 * @desc Delete user
 * @access PRIVATE
 */
router.delete("/:id", auth, (req, res) => {
  deleteUser(req.params.id, res);
});
/** Route for invting Users
 * @route POST /users/invite
 * @desc Send email invite to user
 * @access PRIVATE
 */
router.post("/invite", auth, (req, res) => {
  inviteUser(req, res);
});
/** Route for getting descendants
 * @route GET /users/descendants/:id
 * @desc Gets list of all descendants
 * @access PRIVATE
 */
router.get("/descendants/:id", auth, (req, res) => {
  listDescendants(req, res);
});
/**
 * Route for getting topMostAncestor
 * @route GET /users/top-most ancestor/:id
 * @desc Gets the top most ancestor of the user (if any)
 * @access PRIVATE
 */
router.get("/top-most-ancestor/:id", auth, (req, res) => {
  getTopMostAncestor(req, res);
});

export default router;
