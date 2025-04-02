// // src/services/finesService.ts
// import { getFinesFromPoliceGe } from "../utils/puppeteerUtils.js";

// const vehicles = [
//   { vehicleNo: "DB542DD", documentNo: "DV4547212" },
//   { vehicleNo: "DD961DY", documentNo: "AQA0566435" },
//   { vehicleNo: "IJ903IJ", documentNo: "AJA0518868" },
//   // დაამატეთ სხვა მანქანები
// ];

// // ფუნქცია, რომელიც მიიღებს ყველა მანქანას და მათ ჯარიმებს
// export const fetchPoliceFines = async () => {
//   let allFines = [];

//   for (const vehicle of vehicles) {
//     const fines = await getFinesFromPoliceGe(
//       vehicle.vehicleNo,
//       vehicle.documentNo
//     );
//     allFines.push({
//       vehicleNo: vehicle.vehicleNo,
//       documentNo: vehicle.documentNo,
//       fines,
//     });
//   }

//   return allFines;
// };

// src/services/finesService.ts
import { getFinesFromPoliceGe } from "../utils/puppeteerUtils.js";

// ფუნქცია, რომელიც მიიღებს ყველა მანქანას და მათ ჯარიმებს
export const fetchPoliceFines = async (vehicles) => {
  // vehicles გადაეცემა როგორც არგუმენტი
  let allFines = [];

  for (const vehicle of vehicles) {
    const fines = await getFinesFromPoliceGe(
      vehicle.vehicleNo,
      vehicle.documentNo
    );
    allFines.push({
      vehicleNo: vehicle.vehicleNo,
      documentNo: vehicle.documentNo,
      fines,
    });
  }

  return allFines;
};
