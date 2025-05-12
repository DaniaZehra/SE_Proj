import { Property, Activity } from '../DBmodels/ServicesOfferedModel.js';
import { PropertyBooking, ActivityBooking } from '../DBmodels/bookingModel.js';

export const updatePropertyStatus = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { status } = req.body;

        if (!['approved', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const property = await propertyBooking.findByIdAndUpdate(
            propertyId,
            { 
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({ 
            message: `Property ${status} successfully`,
            property 
        });
    } catch (error) {
        console.error('Error updating property status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getPendingProperties = async (req, res) => {
    try {
        const pendingProperties = await PropertyBooking.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        
        res.status(200).json(pendingProperties);
    } catch (error) {
        console.error('Error fetching pending properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pending bookings with property details
export const getPendingBookings = async (req, res) => {
    try {
        const pendingBookings = await PropertyBooking.find({ status: 'pending' })
            .sort({ createdAt: -1 });

        // Fetch property details for each booking
        const bookingsWithPropertyDetails = await Promise.all(
            pendingBookings.map(async (booking) => {
                const property = await Property.findById(booking.propertyId);
                return {
                    ...booking.toObject(),
                    property: property ? {
                        name: property.name,
                        location: property.location,
                        propertyType: property.propertyType
                    } : null
                };
            })
        );

        res.status(200).json(bookingsWithPropertyDetails);
    } catch (error) {
        console.error('Error fetching pending bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update booking status (approve/reject)
export const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['approved', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await PropertyBooking.findByIdAndUpdate(
            bookingId,
            { 
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ 
            message: `Booking ${status} successfully`,
            booking 
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pending activity bookings with activity details
export const getPendingActivityBookings = async (req, res) => {
    try {
        const pendingBookings = await ActivityBooking.find({ bookingStatus: 'pending' })
            .sort({ createdAt: -1 });

        // Fetch activity details for each booking
        const bookingsWithActivityDetails = await Promise.all(
            pendingBookings.map(async (booking) => {
                const activity = await Activity.findById(booking.activityId);
                return {
                    ...booking.toObject(),
                    activity: activity ? {
                        title: activity.title,
                        location: activity.location,
                        price: activity.price,
                        type: activity.type
                    } : null
                };
            })
        );

        res.status(200).json(bookingsWithActivityDetails);
    } catch (error) {
        console.error('Error fetching pending activity bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update activity booking status (confirm/cancel)
export const updateActivityBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        if (!['confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await ActivityBookingctivityBooking.findByIdAndUpdate(
            bookingId,
            { 
                bookingStatus: status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Activity booking not found' });
        }

        res.status(200).json({ 
            message: `Activity booking ${status} successfully`,
            booking 
        });
    } catch (error) {
        console.error('Error updating activity booking status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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