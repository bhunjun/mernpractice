import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {

    // Function used for sending the review to the database
    // If it didnt work send and error message instead 
    static async apiPostReview(req, res, next) {
        try {
            // Get information from the body 
            const restaurantsId = req.body.restaurants_id
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            const date = new Date()
            
            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantsId,
                userInfo,
                review,
                date,
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    // Function used to send updated review information from the body and 
    // send to DAO
    // If it didnt work send and error message instead
    static async apiUpdateReview(req, res, next) {
        try {
            // Get only required data from body 
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date() 

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id, // Needed to make sure its the same user
                text,
                date,
            )

            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error })
            }

            // If review was not able to update post error 
            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "Unable to update review - May not be the original poster",
                )
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    // Function used to delete a review from the body and 
    // send to DAO
    // If it didnt work send and error message instead
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id
            // Not standard to get user_id from body when delete
            const userId = req.body.user_id 
            console.log(reviewId)
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}