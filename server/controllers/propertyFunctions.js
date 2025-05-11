import {Property} from '../DBmodels/ServicesOfferedModel.js'

const fetchById = async(req, res) => {
    const {id} = req.params;
    try {
        // Use findById instead of find for single documents
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        console.log('Property data:', property); // Debug log
        
        // Return the property directly, not wrapped in {result: property}
        res.status(200).json(property);

    } catch(error) {
        console.error('Database error:', error);
        res.status(400).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

export {fetchById}