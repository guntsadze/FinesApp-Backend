import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

// ფუნქცია Puppeteer-ის გაშვებისათვის და ჯარიმების წამოსაღებად
export const getFinesFromPoliceGe = async (vehicleNo, documentNo) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://videos.police.ge/", {
      waitUntil: "networkidle2",
    });

    // გაასუფთავეთ ველები და ჩაწერეთ ახალი მონაცემები
    await page.evaluate(() => {
      document.getElementById("vehicleNo2").value = "";
      document.getElementById("documentNo").value = "";
    });

    await page.type('input[id="vehicleNo2"]', vehicleNo);
    await page.type('input[id="documentNo"]', documentNo);

    await Promise.all([
      page.click('input[type="submit"][value="ძებნა"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    await delay(3000); // 3 წამიანი შეჩერება

    // მიიღეთ HTML კონტენტი
    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    // მოძებნეთ ყველა ჯარიმის ჩანაწერი
    const rows = $(".row");
    let fines = [];

    rows.each((index, element) => {
      const columns = $(element).find(".col");

      if (columns.length >= 6) {
        const receiptNumberFull = $(columns[1]).text().trim();
        const receiptNumber = receiptNumberFull.slice(0, -7).trim();
        const dates = $(columns[2]).html().split("<br>");
        const issueDate = dates[0] ? dates[0].trim() : "";
        const article = $(columns[3]).text().trim();
        const amount = $(columns[4]).text().trim();
        const status = $(columns[6]).text().trim();

        fines.push({
          receiptNumber,
          issueDate,
          article,
          amount,
          status,
        });
      }
    });

    if (fines.length === 0) {
      console.warn(`No fines found for vehicle ${vehicleNo}.`);
    }

    await browser.close();
    return fines;
  } catch (error) {
    console.error("Error fetching fines from police:", error);
    await browser.close();
    return []; // ვაბრუნებთ ცარიელ მასივს შეცდომის შემთხვევაში
  }
};

// ფუნქცია შეჩერებისათვის
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// import { chromium } from "playwright";

// export const fetchParkingFines = async (vehicle) => {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.goto("https://parking.tbilisi.gov.ge/fines?isTransit=false");
//     await page.waitForTimeout(7000);

//     const finesInfo = [];

//     await page.fill("#mat-input-0", vehicle.vehicleNo);
//     await page.fill("#mat-input-1", vehicle.companyCode);

//     await page.waitForSelector("button.mat-raised-button:not([disabled])", {
//       timeout: 3000,
//     });

//     await page.click("button.mat-raised-button:not([disabled])");

//     // ველოდებით ტაბლოს გამოჩენას, მაგრამ მივიტანთ try-catch, რომ გავაგრძელოთ მუშაობა
//     try {
//       await page.waitForSelector(".mat-cell.cdk-column-fineNo", {
//         timeout: 5000,
//       });

//       const fines = await page.locator(".mat-cell.cdk-column-fineNo").all();

//       for (let i = 0; i < fines.length; i++) {
//         const fineNumber = await fines[i].textContent();
//         const createDate = await page
//           .locator(".mat-cell.cdk-column-createDate")
//           .nth(i)
//           .textContent();
//         const payAmount = await page
//           .locator(".mat-cell.cdk-column-payAmount")
//           .nth(i)
//           .textContent();
//         const status = await page
//           .locator(".mat-cell.cdk-column-status")
//           .nth(i)
//           .textContent();

//         finesInfo.push({
//           fineNumber: fineNumber.trim(),
//           createDate: createDate.trim(),
//           payAmount: payAmount.trim(),
//           status: status.trim(),
//         });
//       }
//     } catch (innerError) {
//       console.warn(`No fines found for vehicle ${vehicle.vehicleNo}.`);
//     }

//     await browser.close();
//     return finesInfo;
//   } catch (error) {
//     console.error("Error fetching parking fines:", error);
//     await browser.close();
//     throw error;
//   }
// };

import { chromium } from "playwright";

const safeFill = async (
  page,
  selector,
  value,
  maxRetries = 3,
  timeout = 10000
) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.waitForSelector(selector, { timeout });
      await page.fill(selector, value);
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        console.warn(
          `❌ Failed to fill ${selector} after ${maxRetries} attempts`
        );
        throw err;
      } else {
        console.log(`⚠️ Retry ${attempt} for ${selector}...`);
        await page.waitForTimeout(2000);
      }
    }
  }
};

export const fetchParkingFines = async (vehicle) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://parking.tbilisi.gov.ge/fines?isTransit=false");
    await page.waitForTimeout(7000);

    const finesInfo = [];

    await safeFill(page, "#mat-input-0", vehicle.vehicleNo, 5, 10000);
    await safeFill(page, "#mat-input-1", vehicle.companyCode, 5, 10000);

    await page.waitForSelector("button.mat-raised-button:not([disabled])", {
      timeout: 5000,
    });

    await page.click("button.mat-raised-button:not([disabled])");

    try {
      await page.waitForSelector(".mat-cell.cdk-column-fineNo", {
        timeout: 5000,
      });

      const fines = await page.locator(".mat-cell.cdk-column-fineNo").all();

      for (let i = 0; i < fines.length; i++) {
        const fineNumber = await fines[i].textContent();
        const createDate = await page
          .locator(".mat-cell.cdk-column-createDate")
          .nth(i)
          .textContent();
        const payAmount = await page
          .locator(".mat-cell.cdk-column-payAmount")
          .nth(i)
          .textContent();
        const status = await page
          .locator(".mat-cell.cdk-column-status")
          .nth(i)
          .textContent();

        finesInfo.push({
          fineNumber: fineNumber.trim(),
          createDate: createDate.trim(),
          payAmount: payAmount.trim(),
          status: status.trim(),
        });
      }
    } catch (innerError) {
      console.warn(`No fines found for vehicle ${vehicle.vehicleNo}.`);
    }

    await browser.close();
    return finesInfo;
  } catch (error) {
    console.error("Error fetching parking fines:", error);
    await browser.close();
    throw error;
  }
};
