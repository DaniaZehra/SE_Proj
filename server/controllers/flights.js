import { Flight, FlightBooking, FlightBooker } from '../DBmodels/flightModels.js';
const searchFlights = async (req, res) => {
  try {
    const { departure, arrival, date, airline } = req.body;


    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    const searchDate = new Date(date);
    const offset = 5 * 60 * 60 * 1000; 
    const startOfDayPKT = new Date(searchDate.getTime() - offset);
    startOfDayPKT.setUTCHours(0, 0, 0, 0); 
    const endOfDayPKT = new Date(searchDate.getTime() - offset + 24 * 60 * 60 * 1000);
    endOfDayPKT.setUTCHours(23, 59, 59, 999); 
    const query = {
       from: { $regex: new RegExp(`^${departure}$`, 'i') },    
      to: { $regex: new RegExp(`^${arrival}$`, 'i') },           
      date: { 
        $gte: new Date(startOfDayPKT.getTime() + offset), 
        $lt: new Date(endOfDayPKT.getTime() + offset)     
      }
    };

    if (airline)  query.airline = { $regex: new RegExp(`^${airline}$`, 'i') };
    console.log("Search Query:", query);
    
    const flights = await Flight.find(query);
    res.status(200).json(flights);
  } catch (err) {
    res.status(500).json({ error: "Failed to search flights", details: err.message });
  }
};
// Book a flight
const bookFlight = async (req, res) => {
  try {
    const { flightId, firstName, lastName, contactNumber } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight || flight.seatsAvailable <= 0 || flight.status !== 'scheduled') {
      return res.status(400).json({ error: 'Flight unavailable' });
    }

    const booker = new FlightBooker({ firstName, lastName, contactNumber });
    await booker.save();

    const booking = new FlightBooking({
      flightId,
      customerId: booker._id, 
      bookerId: booker._id     
    });
    await booking.save();

    flight.seatsAvailable -= 1;
    await flight.save();

    res.status(201).json({ 
      message: 'Flight booked successfully',
      bookingId: booking._id,
      passengerId: booker._id  
    });

  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to book flight', 
      details: err.message 
    });
  }
};

// Cancel a flight booking
const cancelFlight = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await FlightBooking.findById(bookingId);
    if (!booking || booking.status !== 'booked') {
      return res.status(400).json({ error: 'Invalid booking' });
    }

    const flight = await Flight.findById(booking.flightId);
    if (flight) flight.seatsAvailable += 1;

    booking.status = 'cancelled';
    await booking.save();
    await flight.save();

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking', details: err });
  }
};


export {cancelFlight,bookFlight,searchFlights}
