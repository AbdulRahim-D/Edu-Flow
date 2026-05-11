const Class = require("../models/Class.model");
const crypto = require("crypto");
const mongoose=require("mongoose")

const createClass = async (req, res) => {
  try {
    let classCode;
    let isUnique = false;
    while (!isUnique) {
      classCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      const existClass = await Class.findOne({ classCode: classCode });
      if (!existClass) isUnique = true;
    }
    const newClass = new Class({
      ...req.body,
      teacher: req.user.id,
      classCode: classCode,
    });
    const classCreated = await newClass.save();
    res
      .status(201)
      .json({ message: "class Created succcesfully", data: classCreated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal error", error: error.message });
  }
};

const joinClass = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res
        .status(403)
        .json({ message: "access Denied! only Student can join the Class" });
    }
    const { classCode } = req.body;

    const existClass = await Class.findOne({ classCode: classCode });
    if (!existClass)
      return res.status(404).json({ message: "Class not Found" });

    if (existClass.students.includes(req.user.id))
      return res.status(400).json({ message: "you already in this class" });

    const joinClass = await Class.findOneAndUpdate(
      { classCode: classCode },
      { $push: { students: req.user.id } },
      { new: true, runValidators: true },
    );
    if (joinClass) {
      req.io.to(joinClass._id.toString()).emit("student_joined", {
        message: `${req.user.name} has joined the class`,
        studentId: req.user.id,
      });
    }
    res
      .status(200)
      .json({ message: "joined Class successfully!", data: joinClass });
  } catch (error) {
    res.status(500).json({ message: "internal Error", error: error.message });
  }
};

const getAllClasses = async (req, res) => {
  try {
    let query;
    query =
      req.user.role === "Teacher"
        ? { teacher: req.user.id }
        : { students: { $in: [req.user.id] } };
    const allClasses = await Class.find(query).populate(
      "teacher",
      "name email",
    );
    if (!allClasses)
      return res.status(404).json({ message: "Class not Found!" });
    res
      .status(200)
      .json({
        message: "Classes Fetched Successfully",
        data: allClasses,
        count: allClasses.length,
      });
  } catch (error) {
    res.status(500).json({ message: "internal Error", error: error.message });
  }
};

const getClassById = async (req, res) => {
  try {
    const classId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(classId))
      return res.status(400).json({ message: "invalid class Format" });

    const singleClass = await Class.findOne({ _id: classId });
    if (!singleClass)
      return res.status(404).json({ message: "class not Found!" });

    return res
      .status(200)
      .json({ message: "fetched class successfully", data: singleClass });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};


module.exports = { createClass, joinClass, getClassById, getAllClasses };
