import images from "./images.js";
import axios from "axios";

async function get_info(userId) {
  try {
    // Step 1: Get cookies and XSRF token from main page
    const mainPage = await axios.get(`https://www.kaggle.com/${userId}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const cookies = mainPage.headers["set-cookie"] || [];
    const cookieStr = cookies.map((c) => c.split(";")[0]).join("; ");
    const xsrfCookie = cookies.find((c) => c.includes("XSRF-TOKEN"));
    const xsrfToken = xsrfCookie ? xsrfCookie.split("=")[1].split(";")[0] : "";

    // Step 2: Call the API with tokens
    const apiResponse = await axios.post(
      "https://www.kaggle.com/api/i/routing.RoutingService/GetPageDataByUrl",
      { relativeUrl: `/${userId}` },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Cookie: cookieStr,
          "X-XSRF-TOKEN": xsrfToken,
        },
      }
    );

    const data = apiResponse.data;
    if (data.userProfile) {
      // Get the highest tier
      let highestTier = data.userProfile.performanceTier || "NOVICE";

      // Check for legacy tiers (e.g., Legacy Grandmaster)
      if (data.userProfile.achievementSummaries) {
        for (const summary of data.userProfile.achievementSummaries) {
          const tier = summary.legacyTier || summary.tier;
          if (tier === "GRANDMASTER") {
            highestTier = "GRANDMASTER";
            break;
          }
        }
      }

      return {
        userName: data.userProfile.userName || userId,
        activePaneTier: highestTier.toLowerCase(),
      };
    }

    return {
      userName: userId,
      activePaneTier: "novice",
    };
  } catch (error) {
    console.error("Error fetching Kaggle data:", error.message);
    return {
      userName: userId,
      activePaneTier: "novice",
    };
  }
}

export default async function handler(req, res) {
  const { userId } = req.query;

  const result = await get_info(userId[0]);
  const userName = result["userName"];
  let tier = result["activePaneTier"].toLowerCase();
  const tier_image = {
    grandmaster: images["grandmaster"],
    master: images["master"],
    expert: images["expert"],
    contributor: images["contributor"],
    novice: images["novice"],
  };

  const kaggle_logo = images["kaggle"];

  const tier_offset = {
    novice: 0,
    expert: 1,
    contributor: 26,
    master: 5,
    grandmaster: 35,
  };

  res.status(200);
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  res.send(
    `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        height="20"
        width="${94 + tier_offset[tier]}"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xml:space="preserve"
      >
        <style type="text/css">
          .background {
            fill: #000120;
          }

          .background_light{
            fill: #fBfBfB;
            stroke: #333333;
            stroke-width: 0.5px;
          }

          text {
            color: black;
            font-family: "Noto Sans", sans-serif;
          }

          .part {
            font-size: 16px;
            fill: #d0d0d0;
            font-weight: 700;
          }

          .part_light{
            font-size: 16px;
            fill: #707070;
            font-weight: 700;
          }

          .grandmaster {
            fill: #ddaa17;
          }

          .master {
            fill: #f76d34;
          }

          .expert {
            fill: #96508e;
          }

          .contributor {
            fill: #20beff;
          }

          .novice {
            fill: #4fcb93;
          }

          .rank {
            font-size: 18px;
            font-weight: 700;
          }

          .gold {
            fill: #ad7615;
          }

          .silver {
            fill: #838280;
          }
          .bronze {
            fill: #8e5b3d;
          }

          .medal_num {
            font-size: 13px;
          }
          .logo{
            filter : grayscale(1) brightness(1000%);
            -webkit-filter : grayscale(1) brightness(1000%);
            -ms-filter : grayscale(1) brightness(1000%);
            -moz-filter : grayscale(1) brightness(1000%);
            -o-filter : grayscale(1) brightness(1000%);

          }
          .logo_shadow{
            filter : grayscale(1) brightness(0%);
            -webkit-filter : grayscale(1) brightness(0%);
            -ms-filter : grayscale(1) brightness(0%);
            -moz-filter : grayscale(1) brightness(0%);
            -o-filter : grayscale(1) brightness(0%);
            opacity: 0.3;
          }

        </style>
        <linearGradient id="smooth" x2="0" y2="100%">
          <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
          <stop offset="1" stop-opacity=".1"/>
        </linearGradient>
        <mask id="round">
          <rect width="${94 + tier_offset[tier]
    }" height="20" rx="3" ry="3" fill="#fff"/>
        </mask>
        <g mask="url(#round)">

          <rect width="38" height="20" fill="#555"/>
          <rect x="38" width="${56 + tier_offset[tier]
    }" height="20" class="${tier}"/>
          <rect width="${94 + tier_offset[tier]
    }" height="20" rx="3" ry="3"  fill="url(#smooth)"/>
        </g>
        <g fill="#fff" font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="11">
          <text x="42" y="15" fill="#010101" fill-opacity=".3"> ${tier} </text>
          <text x="42" y="14" fill="#fff"> ${tier} </text>
        </g>
        <image
          x="5"
          y="6"
          height="11"

          xlink:href="${kaggle_logo}"
        />
        <image
          class='logo_shadow'
          x="${77 + tier_offset[tier]}"
          y="5"
          width="12"
          height="12"
          xlink:href="${tier_image[tier]}"
        />
        <image
          class='logo'
          x="${77 + tier_offset[tier]}"
          y="4"
          width="12"
          height="12"
          xlink:href="${tier_image[tier]}"
        />


      </svg>
        `
  );
}
