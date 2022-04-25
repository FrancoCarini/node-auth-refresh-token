const express = require("express")
const router = express.Router()

const { login, refreshToken } = require("../controllers/userController")

router.post("login", login)
router.post("refresh-token", verifyJWT, refreshToken)

module.exports = router
