let restaurants

export default class RestaurantsDAO {
    // Connect to database
    // Called as soon as connection stats and gets a reference to the database
    static async injectDB(conn) {
        // If there is a reference already return
        if (restaurants) {
            return
        }
        
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {
            console.error(
                `Unable to establish a connection handle: ${e}`,
            )
        }
    }

    // Gets list of all the restaurants in the database with specific options
    // Options include the filters, page number, and how many restaurants per
    // page
    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {

        let query 
        
        // Filters by name, cuisine, or zipcode of the restaurant 
        if (filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"] }}
            } else if ("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] }}
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] }}
            }
        }

        let cursor 

        // Find all restaurants in the database with the query chosen above and
        // if blank query return all restaurants. If there was an error return 
        // error meassage with empty restuarants list and 0 count
        try {
            cursor = await restaurants.find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
        
        // Limit the number of restaurants per page and get to a specific page
        // of the result based on filters 
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        
        // Convert restaurants to an array, count the number of restaurants
        // and return them. If there was an error return error meassage with 
        // empty restuarants list and 0 count 
        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)
            
            return [ restaurantsList, totalNumRestaurants ]
        } catch (e) {
            console.error (
                `Unable to convert cursor to array or problem counting documents, ${e}`,
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }
}