import Review from "../models/review.js"
import User from "../models/user.js"


export async function createReview(req, res) {
    const email = req.body.email
    const user = User.findOne({ email: email })
    if (user == null) {
        return res.status(404).json({ message: "User not found" })
    }
    if (user.isBlocked) {
        return res.status(401).json({ message: "User is blocked" })
    }
    try {
        const commentId = "com_" + Date.now()
        const review = new Review({
            commentId: commentId,
            productId: req.body.productId,
            email: email,
            message: req.body.message,
            image: req.body.image,
            userImage:req.body.userImage,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            rate:req.body.rate

        })

        await review.save()
        res.json({ message: "Comment saved!" })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export async function getReview(req, res) {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }

}