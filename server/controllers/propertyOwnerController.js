import { Property } from '../DBmodels/ServicesOfferedModel.js';

// Create a new property
export const createProperty = async (req, res) => {
    try {
        const {
            name,
            description,
            location,
            propertyType,
            pricePerNight,
            amenities,
            images,
            filters
        } = req.body;

        // Get the ownerId from the authenticated user
        const ownerId = req.user._id;

        const property = await Property.create({
            ownerId,
            name,
            description,
            location,
            propertyType,
            pricePerNight,
            amenities,
            images,
            filters,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'Property created successfully',
            property
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}; 