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
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://parking.tbilisi.gov.ge/fines?isTransit=false", {
      waitUntil: "networkidle2", // Ensure the page is fully loaded before proceeding
    });

    await delay(15000);

    const finesInfo = [];

    // Fill in vehicle number and company code
    await page.type("#mat-input-0", vehicle.vehicleNo);
    await page.type("#mat-input-1", vehicle.companyCode);

    // Wait for the button to be enabled and click
    await page.waitForSelector("button.mat-raised-button:not([disabled])", {
      timeout: 5000,
    });
    await page.click("button.mat-raised-button:not([disabled])");

    // Wait for the fines table to appear
    await page.waitForSelector(".mat-cell.cdk-column-fineNo", {
      timeout: 5000,
    });

    // Log the page content to debug
    const htmlContent = await page.content();
    console.log(htmlContent); // Log the HTML content for debugging

    // Extract the fines data
    const fines = await page.$$eval(".mat-cell.cdk-column-fineNo", (elements) =>
      elements.map((el) => ({
        fineNumber: el.textContent.trim(),
        createDate: el
          .closest("tr")
          .querySelector(".mat-cell.cdk-column-createDate")
          ?.textContent.trim(),
        payAmount: el
          .closest("tr")
          .querySelector(".mat-cell.cdk-column-payAmount")
          ?.textContent.trim(),
        status: el
          .closest("tr")
          .querySelector(".mat-cell.cdk-column-status")
          ?.textContent.trim(),
      }))
    );

    // Filter out any empty or invalid fines
    fines.forEach((fine) => {
      if (fine.fineNumber && fine.createDate && fine.payAmount && fine.status) {
        finesInfo.push(fine);
      }
    });

    if (finesInfo.length === 0) {
      console.warn(`No fines found for vehicle ${vehicle.vehicleNo}.`);
    }

    await browser.close();
    return finesInfo;
  } catch (error) {
    console.error("Error fetching parking fines:", error);
    await browser.close();
    return []; // Return an empty array in case of error
  }
};
