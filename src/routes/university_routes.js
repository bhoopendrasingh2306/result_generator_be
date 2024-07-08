const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const passwordValidator = require("password-validator");
const router = express.Router();
require("../db/config");
const universityDB = require("../db/university");
const studentDB = require("../db/student");
const jwt = require("jsonwebtoken");
const jwtKey = "my-key";

// const accessControl = require("../middlewares/jwt_verification");

// ------------------REGISTER NEW college---------------------------

//http://localhost:5000/university/signup
router.post("/signup", async (req, resp) => {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces();
  try {
    const passcode = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passcode, salt);
    const {institute_email, institute_address, institute_name } = req.body;
    const password = hashedPassword;
    const institute_code = parseInt(Math.floor(Math.random() * (199 - 101 + 1) ) + 101);
    const result = {
      institute_name: institute_name,
      institute_email: institute_email,
      institute_address: institute_address,
      institute_code: institute_code,
      password: password,
    };
    let Token;
    console.log(result);
    if (!validator.isEmail(institute_email)) {
      return resp.status(203).json({ message: "Invalid email address" });
    }
    //password validation check
    const isValid = schema.validate(passcode);
    if (!isValid) {
      return resp.status(203).json({ message: "Password is not valid" });
    }
    let instituteCheck = await universityDB.findOne({ institute_email: institute_email });
    console.log("college  chack:", instituteCheck);
    if (instituteCheck) {
      return resp.status(203).json({ message: "College with same credentials already exists" });
    } else {
      // this jwt token will be generated when we signup
      jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send({ message: "something went wrong or token expired" });
        } else {
          Token = token;
        }
      });
    }
    let valu = new universityDB(result);
    let data = await valu.save();
    data = data.toObject();
    resp.status(200).send({ data, auth: Token });
  } catch (err) {
    console.log("end Err", err);
    resp.status(203).json({ message: "something went wrongg" });
  }
});

//http://localhost:5000/university/login
router.post("/login", async (req, res) => {
  const { institute_name, institute_email } = req.body;
  const user = await universityDB.findOne({ institute_email: institute_email, institute_name: institute_name });
  try {
    console.log("institute information", user);
    if (user) {
      const payload = { user };
      if (await bcrypt.compare(req.body.password, user.password)) {
        //password resolution
        jwt.sign({ payload }, jwtKey, { expiresIn: "5h" }, (err, token) => {
          //jwt token generation
          if (err) {
            res.send({ message: "something went wrong or token expired" });
          } else {
            res.status(200).send({user, auth: token });
          }
        });
      } else {
        res.status(203).send({message:"wrong password"});
      }
    } else {
      return res.status(203).send({message:"institute doesn't exist"});
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});

// ---------------- GET INSTITUTE PROFILE -------------------
//localhost:5000/university/profile/:institute_name
router.get("/profile/:institute_name", async (req, res) => {
  try {
    const result = await universityDB.findOne({institute_name:req.params.institute_name});
    console.log("institute profile result", result);
    if (result) {
      res.status(200).send({ result: result });
    } else {
      res
        .status(203)
        .send({ message: "invalid roll_no or institute profile not available" });
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});

// --------------- get all student of institute ------------------------

//http://localhost:5000/university/studentlist/:institute_name

router.get("/studentlist/:institute_name", async (req, res) => {
  try {
    const result = await studentDB.find({institute_name:req.params.institute_name});
    console.log("student result", result);
    if (result) {
      res.status(200).send({ result: result });
    } else {
      res
        .status(203)
        .send({ message: "No student is Registered Yet" });
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});

module.exports = router;
