import Student from "../models/student.js";

export async function createStudents(req, res) {

    if(!isAdmin(req)){
        res.status(403).json({ message: "Only admins can add students!" })
        return
    }

    const student = new Student(req.body)

    student.save().then(
        ()=>{
            res.json({ message: "Student saved successfully" })
        }
    )

}
