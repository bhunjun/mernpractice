import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    // Allows users to pass in query strings in the url 
    static async apiGetRestaurants(req, res, next) {
        // Get resturants per page query. If not present defaut to 20 
        const restaurantsPerPage = req.query.restaurantstsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        // Get page number query. If not present default to 0 
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        let filters = {}

        // Check for querys set by user and assign proper filters
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        // Return restaurants list and total number of restaurants 
        const [ restaurantsLists, totalNumRestaurants ] = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage,
        })
        
        // Create response to respond when api is called
        let response = {
            restaurants: restaurantsLists,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)
    }
}