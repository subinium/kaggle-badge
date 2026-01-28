import images from "./images.js";
import axios from "axios";

async function get_info(userId, category) {
  const categoryTypeMap = {
    competition: "USER_ACHIEVEMENT_TYPE_COMPETITIONS",
    dataset: "USER_ACHIEVEMENT_TYPE_DATASETS",
    notebook: "USER_ACHIEVEMENT_TYPE_NOTEBOOKS",
  };

  const achievementType = categoryTypeMap[category] || categoryTypeMap.competition;

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
    if (data.userProfile && data.userProfile.achievementSummaries) {
      const summary = data.userProfile.achievementSummaries.find(
        (s) => s.summaryType === achievementType
      );

      if (summary) {
        return {
          userName: data.userProfile.userName || userId,
          tier: summary.legacyTier || summary.tier || "NOVICE",
          rankCurrent: summary.rankCurrent || null,
          rankHighest: summary.rankHighest || null,
          totalGoldMedals: summary.totalGoldMedals || 0,
          totalSilverMedals: summary.totalSilverMedals || 0,
          totalBronzeMedals: summary.totalBronzeMedals || 0,
        };
      }
    }

    return {
      userName: userId,
      tier: "NOVICE",
      rankCurrent: null,
      rankHighest: null,
      totalGoldMedals: 0,
      totalSilverMedals: 0,
      totalBronzeMedals: 0,
    };
  } catch (error) {
    console.error("Error fetching Kaggle data:", error.message);
    return {
      userName: userId,
      tier: "NOVICE",
      rankCurrent: null,
      rankHighest: null,
      totalGoldMedals: 0,
      totalSilverMedals: 0,
      totalBronzeMedals: 0,
    };
  }
}

export default async function handler(req, res) {
  const { userId } = req.query;

  const category = userId[1] || "competition";
  const info = await get_info(userId[0], category);

  const tier_image = {
    GRANDMASTER: images["grandmaster"],
    MASTER: images["master"],
    EXPERT: images["expert"],
    CONTRIBUTOR: images["contributor"],
    NOVICE: images["novice"],
  };

  let type = category;
  type = type.charAt(0).toUpperCase() + type.slice(1) + "s";

  let tier = info["tier"] || "NOVICE";
  let tierDisplay = tier.charAt(0) + tier.slice(1).toLowerCase();

  let rank_current = info["rankCurrent"];
  let rank_highest = info["rankHighest"];
  let rank_text = "None";
  if (rank_current === null) rank_text = "Unranked";
  else if (rank_current === rank_highest) rank_text = rank_current;
  else if (rank_current !== rank_highest) rank_text = rank_current;

  let background = "background";
  let part = "part";

  if (userId.length >= 3) {
    background += "_" + userId[2];
    part += "_" + userId[2];
  }

  res.status(200);
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  res.send(
    `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg
        height="195"
        width="144"
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
        </style>

        <rect width="144" height="195" rx="8" ry="8" class="${background}" />
        <text x="72" y="25" class="${part}" text-anchor="middle">${type} </text>
        <text x="72" y="43" class="${part}" text-anchor="middle">${tierDisplay} </text>
        <image
          x="40"
          y="52"
          width="64"
          height="64"
          xlink:href="${tier_image[tier] || tier_image["NOVICE"]}"
        />
        <text x="72" y="138" class="rank ${tier.toLowerCase()}" text-anchor="middle">${rank_text}</text>
        <image x="22" y="149" width="20" height="20" xlink:href="${images["gold"]}" />
        <text x="32" y="184" class="medal_num gold" text-anchor="middle">${info["totalGoldMedals"] || 0}</text>
        <image
          x="62"
          y="149"
          width="20"
          height="20"
          xlink:href="${images["silver"]}"
        />
        <text x="72" y="184" class="medal_num silver" text-anchor="middle">${info["totalSilverMedals"] || 0}</text>
        <image
          x="102"
          y="148"
          width="20"
          height="20"
          xlink:href="${images["bronze"]}"
        />
        <text x="112" y="184" class="medal_num bronze" text-anchor="middle">${info["totalBronzeMedals"] || 0}</text>
      </svg>
        `
  );
}
