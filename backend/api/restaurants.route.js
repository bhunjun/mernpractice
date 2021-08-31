import express from "express"
import RestaurantsCtrl from "./Restaurants.controller.js"

const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

export default router