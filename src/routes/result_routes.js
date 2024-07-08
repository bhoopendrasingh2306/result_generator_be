const express = require("express");
const router = express.Router();
require("../db/config");
const student = require("../db/student");
const universityDb = require("../db/university");
const marksDb = require("../db/marks");

// http://localhost:5000/result/uploadresult
router.post("/uploadresult", async (req, resp) => {
  try {
    const {
      hindi,
      english,
      math,
      chemistry,
      physics,
      roll_no,
      name,
      cgpa,
      institute_name,
    } = req.body;
    const result = {
      hindi: hindi,
      english: english,
      math: math,
      chemistry: chemistry,
      physics: physics,
      roll_no: roll_no,
      name: name,
      cgpa: cgpa,
      institute_name: institute_name,
    };

    console.log(result);

    let valu = new marksDb(result);
    let data = await valu.save();
    data = data.toObject();
    resp.status(200).send({ data, message: "Result Successfully generated" });
  } catch (err) {
    console.log("end Err", err);
    resp.status(203).send({ message: "something went wrongg " });
  }
});


// http://localhost:5000/result/getresult/:roll_no
router.get("/getresult/:roll_no", async (req, res) => {
  try {
    const result = await marksDb.findOne({roll_no:req.params.roll_no});
    console.log("student-> result->", result);
    if (result) {
      res.status(200).send({ result: result, message:"Result is declared." });
    } else {
      res
        .status(203)
        .send({ message: "Result is not declared yet." });
    }
  } catch (err) {
    res.status(203).json(console.log(err));
  }
});

module.exports = router;
