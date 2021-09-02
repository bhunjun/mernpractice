import mongodb, { AggregationCursor } from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    // Connect to database
    // Called as soon as connection stats and gets a reference to the database
    static async injectDB(conn) {
        if (reviews) {
            return
        }

        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        } catch (e) {
            console.error(
                `Unable to establish a connection handle in userDOA: ${e}`,
            )
        }
    }

    // Creates review document of new review and insert it into the database 
    static async addReview(restaurantId, user, review, date) {
        try { 
            const reviewDoc = { 
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: ObjectId(restaurantId), 
            }
            
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error(`Unable to post review: ${e}`)
            return {error: e }
        }
    }

    // Look for review with same object id and user id and set the new review 
    // text in the database 
    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: ObjectId(reviewId) },
                { $set: { text: text, date: date } },
            )
            
            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return {error: e }
        }
    }

    // Look for review with same object id and user id and remove the review
    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne ({
                _id: ObjectId(reviewId),
                user_id: userId,
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return {error: e }
        }
    }
}