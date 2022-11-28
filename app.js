const express = require("express");
const data = require("./data.json");
const app = express();
app.set("view engine", "pug");
app.use("/static", express.static(__dirname + "/public"));

const PORT = 3000;

// home page.
app.get("/", (req, res) => {
  try {
    return res.render("index", { projects: data.projects });
  } catch (error) {
    return res.send(globalErrorHandler(error));
  }
});

// about page.
app.get("/about", (req, res) => {
  try {
    return res.render("about");
  } catch (error) {
    return res.send(globalErrorHandler(error));
  }
});

// single project page.
app.get("/project/:id", (req, res) => {
  try {
    // show an error if the project doesn't exits.
    if (req.params.id >= data.projects.length) {
      return res.send(fourOfourErrorHandler(req.url));
    }

    // get the project and render it on project page.
    let selectedProject;
    data.projects.forEach((project) => {
      if (project.id == req.params.id) selectedProject = project;
    });
    return res.render("project", { project: selectedProject });
  } catch (error) {
    res.render(globalErrorHandler(error));
  }
});

// last route if none of the above routes are reached this will show a 404 (not found) error.
app.get("*", (req, res) => {
  try {
    return res.send(fourOfourErrorHandler(req.url));
  } catch (error) {
    return res.send(globalErrorHandler(error));
  }
});

// last middleware if none of the above routes are reached somehow this will fire up and print 500 (internal server) error.
app.use(() => {
  try {
    throw new Error();
  } catch (error) {
    globalErrorHandler();
  }
});

app.listen(PORT, () =>
  console.log(`Server is listening on http://localhost:${PORT}`)
);

// 404 error handler.
function fourOfourErrorHandler(url) {
  try {
    const error = new Error();
    error.status = 404;
    error.message =
      "(" +
      url +
      ") This resource doesn't exist on this site. Try going to home page.";
    throw error;
  } catch (error) {
    console.log(error.status + " " + error.message);
    return error;
  }
}

// 500 internal server Error handler.
function globalErrorHandler(error) {
  if (!error.status) error.status = 500;
  error.message = `Something went wrong. ${error.message}. Internal server error. Please bear with us.`;
  console.log(error.status + " " + error.message);
  return {
    status: error.status,
    message: error.message,
  };
}
