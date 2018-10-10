import { launch, LaunchOptions } from "puppeteer";
import * as Moment from "moment";
import "moment/locale/th";

import { TRACK_PATH, INPUT_HTML_ID, SLIDE_HTML_CLASS } from "./constant";

import { IsBarcode } from "./helper";

// const exec = require("child_process").exec;

export type TrackingResult = {
  date: string;
  time: {
    start: string;
    end: string;
  };
  location: string;
  description: string;
  result: string;
};

export const Tracking: (id: string, option?: LaunchOptions) => Promise<TrackingResult[]> = async (
  trackID: string,
  puppeteerOption?: LaunchOptions
) => {
  if (IsBarcode(trackID)) {
    // { headless: false, args: ["--proxy-server=socks5://127.0.0.1:9050"] }
    const browser = await launch(puppeteerOption);

    const page = await browser.newPage();
    // page.on("response", response => {
    //   if (response.ok() === false) {
    //     exec("(echo authenticate '\"\"'; echo signal newnym; echo quit) | nc localhost 9051", (error, stdout, stderr) => {
    //       console.log(stdout);
    //       console.log(stderr);
    //       console.log(error);

    //       if (stdout.match(/250/g).length === 3) {
    //         console.log("Success: The IP Address has been changed.");
    //       } else {
    //         console.log("Error: A problem occured while attempting to change the IP Address.");
    //       }
    //     });
    //   } else {
    //     console.log("Success: The Page Response was successful (no need to change the IP Address).");
    //   }
    // });

    await page.goto(TRACK_PATH, { waitUntil: "networkidle2" });
    // await page.waitForNavigation({ waitUntil: "networkidle2" });

    await page.type(INPUT_HTML_ID, trackID);

    const e = await page.$(SLIDE_HTML_CLASS);
    if (e) {
      const box = await e.boundingBox();
      if (box) {
        await page.mouse.move(box.x + 5, box.y + 5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width, box.y + 5); // slide
        await page.mouse.up();
      }
    }

    await page.waitForNavigation();

    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table:nth-child(3)"));
      return tds.map(td => (<HTMLElement>td).innerText.replace(/<a [^>]+>*<\/a>/g, "").trim());
    });

    const tracking = data[1].replace(/\n/g, "").split("\t");

    // shift 4 element out
    tracking.shift();
    tracking.shift();
    tracking.shift();
    tracking.shift();

    const status = [];
    for (let i = 0; i < tracking.length; i += 4) {
      const dateSplit = tracking[i].split(" ");
      if (dateSplit.length < 5) continue;

      const day = dateSplit[1];
      const month = dateSplit[2];
      const year = dateSplit[3];
      const time = dateSplit[4];

      let date = Moment(`${day}/${month}/${year}`, "D/MMMM/Y");

      let range = time.split("-");
      let start;
      let end;
      if (range.length > 1) {
        start = Moment(range[0], "HH:mm");
        end = Moment(range[1], "HH:mm");
      } else {
        start = Moment(time, "HH:mm:ss [น.]");
        end = start;
      }

      status.push({
        date: date.format("LL"),
        time: {
          start: start.format("HH:mm:ss"),
          end: end.format("HH:mm:ss")
        },
        location: tracking[i + 1] as string,
        description: tracking[i + 2] as string,
        result: tracking[i + 3] as string
      });
    }

    await browser.close();

    return status;
  }
  return [];
};
