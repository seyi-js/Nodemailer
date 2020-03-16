const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
var nodemailer = require("nodemailer");
const PORT = process.env.PORT || 8000;

//BODY PARSER CONFIG
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//EJS CONFIG
app.use(expressLayouts);
app.set("veiws", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//SERVING STATIC FILES
app.use(express.static("static"));
app.use("/static", express.static("static"));
app.use(express.static(__dirname + "/static"));

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/contact", (req, res) => {
  const output = `
<p> You have a messgae</p>
<h3> Contact Details</h3>
<ul>
<li>Name: ${req.body.name}</li>
<li>phone: ${req.body.contact}</li>
<li>Email: ${req.body.email}</li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>
`;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    port:587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    },
    tls:{
        rejectUnauthorized: false
    }
  });

  var mailOptions = {
    from: 'Nodemailer Contact process.env.GMAIL_USERNAME',
    to: "adebayosamueljahsmine30@gmail.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
    html: output
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.render('contact', {msg: 'Email sent'})
    }
  });

//   console.log(output);
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
