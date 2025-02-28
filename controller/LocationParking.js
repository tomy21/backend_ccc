import ParkingLocation from "../model/LocationParking.js";

export const getAllParkingLocations = async (req, res) => {
  try {
    const locations = await ParkingLocation.findAll();
    res.json({
      status: true,
      message: "Locations fetched successfully",
      locations,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error });
  }
};

// Get Location by ID
export const getParkingLocationById = async (req, res) => {
  try {
    const location = await ParkingLocation.findByPk(req.params.id);
    if (!location)
      return res.status(404).json({ message: "Location not found" });
    res.json({
      status: true,
      message: "Locations fetched successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error });
  }
};

// Create New Location
export const createParkingLocation = async (req, res) => {
  try {
    const location = await ParkingLocation.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error });
  }
};

// Update Location
export const updateParkingLocation = async (req, res) => {
  try {
    const location = await ParkingLocation.findByPk(req.params.id);
    if (!location)
      return res.status(404).json({ message: "Location not found" });

    await location.update(req.body);
    res.json({ message: "Location updated successfully", location });
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error });
  }
};

// Delete Location
export const deleteParkingLocation = async (req, res) => {
  try {
    const location = await ParkingLocation.findByPk(req.params.id);
    if (!location)
      return res.status(404).json({ message: "Location not found" });

    await location.destroy();
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};
