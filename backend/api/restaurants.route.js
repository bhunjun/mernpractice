import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router()

// Get request for getting restuarnts data from database
router.route("/").get(RestaurantsCtrl.apiGetRestaurants)

// Requests for adding, modifying, and deleteing reviews
router
    .route("/reviews")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router