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

export const fetchParkingFines = async (vehicle) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://parking.tbilisi.gov.ge/fines?isTransit=false");
    await page.waitForTimeout(7000); // Wait to ensure the page loads

    // Wait for the element to be available before filling the inputs
    await page.waitForSelector("#mat-input-0", { visible: true });

    await page.fill("#mat-input-0", vehicle.vehicleNo);
    await page.fill("#mat-input-1", vehicle.companyCode);

    // Wait for the submit button to be clickable and then click it
    await page.waitForSelector("button.mat-raised-button:not([disabled])", {
      timeout: 3000,
    });
    await page.click("button.mat-raised-button:not([disabled])");

    // Wait for the fines table to load
    try {
      await page.waitForSelector(".mat-cell.cdk-column-fineNo", {
        timeout: 5000,
      });

      const fines = await page.locator(".mat-cell.cdk-column-fineNo").all();

      const finesInfo = [];
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

      await browser.close();
      return finesInfo;
    } catch (innerError) {
      console.warn(`No fines found for vehicle ${vehicle.vehicleNo}.`);
    }
  } catch (error) {
    console.error("Error fetching parking fines:", error);
    await browser.close();
    throw error;
  }
};
