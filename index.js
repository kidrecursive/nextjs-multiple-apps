// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";

const appOne = next({ dev, dir: "./next-one", conf: {}, quiet: false });
const oneHandle = appOne.getRequestHandler();

const appTwo = next({ dev, dir: "./next-two", conf: {}, quiet: false });
const twoHandle = appTwo.getRequestHandler();

// setup the next apps
// commenting one out will allow the server 
// to start
const nextAppPromises = Promise.all([
  appOne.prepare(),
  appTwo.prepare()
]);

// start the express server
nextAppPromises.then((started) => {
  console.log(started);
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    if (pathname === "/next-one") {
      oneHandle(req, res, parsedUrl);
    } else if (pathname === "/next-two") {
      twoHandle(req, res, parsedUrl);
    } else {
      oneHandle(req, res, parsedUrl);
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
