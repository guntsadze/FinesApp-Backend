// import { fetchPoliceFines } from "../services/policeFinesService.js";

// const getPoliceFines = async (req, res) => {
//   try {
//     const fines = await fetchPoliceFines();
//     res.status(200).json(fines);
//   } catch (error) {
//     console.error("Error fetching fines:", error.message);
//     res
//       .status(500)
//       .json({ message: "Error fetching fines", error: error.message });
//   }
// };

// export default getPoliceFines;

import { fetchPoliceFines } from "../services/policeFinesService.js";

const getPoliceFines = async (req, res) => {
  const { vehicles } = req.body; // vehicles მონაცემები, რომლებიც მიიღება Frontend-იდან

  if (!vehicles || vehicles.length === 0) {
    return res.status(400).json({ message: "Vehicles data is required" });
  }

  try {
    const fines = await fetchPoliceFines(vehicles); // გადაეცემა vehicles
    res.json(fines); // მიეწოდება ჯარიმების მონაცემები
  } catch (error) {
    console.error("Error fetching fines:", error);
    res.status(500).json({ message: "Error fetching fines" });
  }
};

export default getPoliceFines;
