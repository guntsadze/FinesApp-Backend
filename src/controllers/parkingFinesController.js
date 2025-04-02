// import { getParkingFinesData } from "../services/parkingFinesService.js";

// export const getParkingFines = async (req, res) => {
//   try {
//     const fines = await getParkingFinesData();
//     res.send(fines);
//   } catch (error) {
//     console.error("Error in controller:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

import { getParkingFinesData } from "../services/parkingFinesService.js";

export const getParkingFines = async (req, res) => {
  const { vehicles } = req.body; // მიიღოს vehicles მონაცემები Frontend-იდან

  if (!vehicles || vehicles.length === 0) {
    return res.status(400).json({ message: "Vehicles data is required" });
  }

  try {
    const fines = await getParkingFinesData(vehicles); // გადაეცემა vehicles მონაცემები
    res.json(fines);
  } catch (error) {
    console.error("Error fetching parking fines:", error);
    res.status(500).json({ message: "Error fetching parking fines" });
  }
};
