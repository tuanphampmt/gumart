const axios = require("axios");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello, Wourld!!!" });
});

const userAgents = [
  // Windows User Agents
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36",

  // macOS User Agents
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

  // Linux User Agents
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
  "Mozilla/5.0 (X11; Linux i686; rv:91.0) Gecko/20100101 Firefox/91.0",

  // Android User Agents
  "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G950F) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.0 Chrome/91.0.4472.77 Mobile Safari/537.36",

  // iPhone User Agents
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1",

  // iPad User Agents
  "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1",

  // Edge Browser User Agents
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",

  // Safari on iOS
  "Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Safari/604.1",
];

function randomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomPixelId() {
  return pixelIds[Math.floor(Math.random() * pixelIds.length)];
}

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function headers(auth) {
  return {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    origin: "https://d2kpeuq6fthlg5.cloudfront.net",
    referer: "https://d2kpeuq6fthlg5.cloudfront.net/",
    "user-agent": getRandomUserAgent(),
    Authorization: `Bearer ${auth}`,
  };
}

// Refactored HTTP request function using axios
async function httpRequest(method, url, data, auth) {
  try {
    const options = {
      method: method,
      url: url,
      headers: headers(auth),
    };

    if (method === "POST" && data) {
      options.data = data;
    }

    // Axios automatically throws an error for non-2xx responses, so no need to check manually
    const response = await axios(options);
    return response.data;
  } catch (error) {
    const errorMessage = `Không thể Call API ${method}:${url}:${
      error.response ? error.response.status : "Unknown Status"
    } || ${error.message}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

// Sleep function for delay
function sleep(ms) {
  console.info(`Bạn phải chờ ${ms / 1000} giây để tiếp tục`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Boot function
async function boot(auth) {
  try {
    const response = await httpRequest(
      "POST",
      "https://api.gumart.click/api/boost",
      {},
      auth
    );
    return response;
  } catch (error) {
    if (error.message.includes("401")) {
      return 401;
    }
    return 500;
  }
}

// Claim function
async function claim(auth) {
  try {
    const response = await httpRequest(
      "POST",
      "https://api.gumart.click/api/claim",
      {},
      auth
    );
    return response;
  } catch (error) {
    if (error.message.includes("401")) {
      return 401;
    }
    return 500;
  }
}

// Missions function
async function missions(auth) {
  try {
    const response = await httpRequest(
      "GET",
      "https://api.gumart.click/api/missions",
      {},
      auth
    );
    return response;
  } catch (error) {
    if (error.message.includes("401")) {
      return 401;
    }
    return 500;
  }
}

// Start mission function
async function startMissions(id, auth) {
  try {
    const response = await httpRequest(
      "POST",
      `https://api.gumart.click/api/missions/${id}/start`,
      {},
      auth
    );
    return response;
  } catch (error) {
    if (error.message.includes("401")) {
      return 401;
    }
    return 500;
  }
}

// Claim mission function
async function claimMissions(id, auth) {
  try {
    const response = await httpRequest(
      "POST",
      `https://api.gumart.click/api/missions/${id}/claim`,
      {},
      auth
    );
    return response;
  } catch (error) {
    if (error.message.includes("401")) {
      return 401;
    }
    return 500;
  }
}

async function main() {
  const dataFile = path.join(__dirname, "data.txt");
  const dataAuth = fs
    .readFileSync(dataFile, "utf8")
    .replace(/\r/g, "")
    .split("\n")
    .filter(Boolean);
  await Promise.all(
    dataAuth.map(async (data) => {
      const bootResult = await boot(data);
      if (bootResult.status_code === 200) {
        console.log("Boot: ", bootResult.data);
      }
      const claimResult = await claim(data);
      if (claimResult.status_code === 200) {
        console.log("Claim: ", claimResult.data);
      }

      const missionsResult = await missions(data);
      if (missionsResult.status_code === 200) {
        // const { missions, tasks } = missionsResult.data;
        const dataTasks = missionsResult.data;
        for (const key in dataTasks) {
          for (const key2 in dataTasks[key]) {
            const subtasks = dataTasks[key][key2].filter(
              (dai) => dai.status !== "finished"
            );
            for (const sub of subtasks) {
              const resultStartMissions = await startMissions(sub.id, data);
              if (resultStartMissions.status_code === 200) {
                console.log(
                  `Start Missions ${resultStartMissions.data.title} nhận được ${resultStartMissions.data.point} point: ${resultStartMissions.message}`
                );
              }

              const claimMissionsResult = await claimMissions(sub.id, data);
              if (claimMissionsResult.status_code === 200) {
                console.log(
                  `Claim Missions ${claimMissionsResult.data.title} nhận được ${claimMissionsResult.data.point} point: ${claimMissionsResult.message}`
                );
              }
            }
          }
        }
      }
    })
  );
}

// Thay thế setInterval bằng setTimeout để tự động điều chỉnh thời gian chờ
function schedule() {
  setTimeout(async () => {
    await main();
    schedule(); // Gọi lại để tiếp tục lặp
  }, 1000 * 60 * 2); // Lặp lại sau mỗi 2 phut
}
main();
schedule();

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/api`);
});
