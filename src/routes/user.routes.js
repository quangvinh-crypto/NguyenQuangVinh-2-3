const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.softDeleteUser);

router.post("/enable", userController.enableUser);
router.post("/disable", userController.disableUser);

module.exports = router;
