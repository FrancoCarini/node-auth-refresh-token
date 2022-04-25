const express = require("express")
const router = express.Router()

const {
  login,
  refresh,
  create,
  logout,
} = require("../controllers/userController")

router.post("/", create)
router.post("/login", login)
router.get("/refresh", refresh)
router.get("/logout", logout)

module.exports = router
