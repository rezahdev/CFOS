/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Nirajan Shah
 */

const express = require("express");
const nunjucks = require("nunjucks");
const mongodb = require("mongodb");

const app = express();
const port = 3000;

const employeeRoutes = require("./routes/employee");
const cafeRoutes = require("./routes/cafe");
const menuRoutes = require("./routes/menu");
const serveDirectoryRoutes = require("./routes/serveDirectory");
const userAccessRoutes = require("./routes/userAccess");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

app.use("/", employeeRoutes);
app.use("/", cafeRoutes);
app.use("/", menuRoutes);
app.use("/", serveDirectoryRoutes);
app.use("/", userAccessRoutes);

let csrf_token = generateCSRFToken(64); //TODO: This has to be replaced with cookie/session.

/**
 * GET route for the admin index page.
 * TODO: restrict to authenticated users only.
 */

app.get("/home", (req, res) => {
  getCafeList().then((cafeList) => {
    res.status(200).render("index.njk", {
      //appName: 'UWCFOS',
      // get username from database on login
      username: "admin",
      userLevel: 0, //This value should be dynamically assigned when authentication is implemented (0 = admin, 1 = staff, 2 = customer)
      cafeList: cafeList,
    });
  });
});

/**
 * Function to retrieve the entire collection of cafeterias from DB.
 * @returns { [Object] } the list of cafeterias.
 */
async function getCafeList() {
  await client.connect();
  const cafeListCol = await client.db("cafe's").collection("cafe_lists");
  const cursor = cafeListCol.find({});
  return await cursor.toArray();
}

/**
 * Function to generate a random string for csrf token.
 * @param { int } length Length of the random string.
 * @returns a string of random characters.
 */
function generateCSRFToken(length) {
  let token = "";
  let charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return token;
}

/**
 * 404 page not found error handler middleware.
 */
app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/public/404.html");
});

/**
 * 500 internal server error handler middleware.
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).sendFile(__dirname + "/public/500.html");
});

app.listen(port, () => {
  console.log("App listening on http://localhost:" + port);
});
