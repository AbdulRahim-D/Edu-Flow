const Class = require("../models/Class.model")

const createClass= async (req, res) => {
    try {
        let classCode;
        let isUnique = false;
        while (!isUnique) {
            classCode = crypto.randomBytes(3).toString("hex").toUpperCase();
            const existClass = await Class.findOne({ classCode: classCode })
            if (!existClass) isUnique = true
        }
        const newClass = new Class({ ...req.body, teacher: req.user.id, classCode: classCode })
        const classCreated = await newClass.save();
        res.status(201).json({ message: "class Created succcesfully", data: classCreated })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal error", error: error.message });
    }
}

const joinClass=async (req, res) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({ message: "access Denied! only Student can join the Class" })
        }
        const { classCode } = req.body
        const joinClass = await Class
            .findOneAndUpdate(
                { classCode: classCode },
                { $addToSet: { students: req.user.id } },
                { new: true }
            )
        if (!joinClass) return res.status(404).json({ message: "Class not Found!" })
        res.status(200).json({ message: "joined Class successfully!", data: joinClass })
    }
    catch (error) {
        res.status(500).json({ message: "internal Error", error: error.message })
    }
}

const getAllClasses=async (req, res) => {
    try {
        let query;
        query = (req.user.role === "Teacher") ? { teacher: req.user.id } : { students: { $in: [req.user.id] } }
        const allClasses = await Class.find(query).populate("teacher", "name email")
        if (!allClasses) return res.status(404).json({ message: "Class not Found!" })
        res.status(200).json({ message: "Classes Fetched Successfully", data: allClasses, count: allClasses.length })
    }
    catch (error) {
        res.status(500).json({ message: "internal Error", error: error.message })
    }
}

module.exports={createClass,joinClass,getAllClasses}