// import { fetchParkingFines } from "../utils/puppeteerUtils.js";

// const vehicles = [
//   { vehicleNo: "TF659TF", orgCode: "202311738" },
//   { vehicleNo: "TR888DN", orgCode: "202311738" },
//   { vehicleNo: "TR200DN", orgCode: "202311738" },
// ];

// export const getParkingFinesData = async () => {
//   const fines = [];

//   for (let vehicle of vehicles) {
//     const parkingFines = await fetchParkingFines(vehicle);

//     fines.push({
//       vehicle: vehicle.vehicleNo,
//       parkingFines,
//     });

//     // შეგიძლიათ სხვა წყაროებისგან (მაგალითად police.ge) მონაცემებიც მიიღოთ აქ
//   }

//   return fines;
// };

import { fetchParkingFines } from "../utils/puppeteerUtils.js";

export const getParkingFinesData = async (vehicles) => {
  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    throw new Error("Vehicles data is required and should be an array.");
  }

  const fines = [];

  for (const vehicle of vehicles) {
    const parkingFines = await fetchParkingFines(vehicle);

    fines.push({
      vehicles: vehicle.vehicleNo,
      parkingFines,
    });
  }

  return fines;
};
