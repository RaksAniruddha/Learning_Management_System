// import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Course } from '../model/course.model.js';
import { Lecture } from '../model/lecture.model.js';
import { User } from '../model/user.model.js'
import { CoursePurchase } from '../model/coursePurchase.model.js';


// export const createCheckoutSession = async (req, res) => {
//     try {
//         const userId = req.id;
//         const { courseId } = req.body;

//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.status(404).json({ massege: "Course Not Found" });
//         }

//         // create a new course
//         const newPurchase = new CoursePurchase({
//             courseId,
//             userId,
//             amount: course.coursePrice,
//             status: 'pending'
//         });

//         // Create a Stripe checkout session
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "inr",
//                         product_data: {
//                             name: course.courseTitle,
//                             images: [course.courseThumbnail],
//                         },
//                         unit_amount: course.coursePrice * 100, //Amount in paise (lowest denomination)
//                     },
//                     quantity: 1,
//                 }
//             ],
//             mode: "payment",
//             success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
//             cancel_url: `${process.env.FRONTEND_URL}/course-details/${courseId}`,
//             metaData: {
//                 courseId: courseId,
//                 userId: userId,
//             },
//             shipping_address_collection: {
//                 allowed_countries: ["IN"],//Optionally restrict allowed countries
//             },
//         });
//         if (!session.url) {
//             return res.status(400).json({
//                 success: false,
//                 massege: "Error while creating session"
//             });
//         }
//         // save the purchase record
//         newPurchase.paymentIntentId = session.id;
//         await newPurchase.save();

//         return res.status(200).json({
//             success: true,
//             url: session.url //Return the stripe checkout URL
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };
// export const stripewebhook = async (req, res) => {
//     let event;
//     try {
//         const payloadString = JSON.stringify(req.body, null, 2);
//         const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

//         const header = Stripe.webhooks.generateTestHeaderString({
//             payload: payloadString,
//             secret,
//         });
//         event = stripe.webhooks.constructEvent(payloadString, header, secret);
//     } catch (error) {
//         console.error("Webhook error:", error.messege);
//         return res.status(400).send(`webhook error : ${error.messege}`);
//     }

//     // handle checkout session completed event
//     if (event.type === "checkout.session.completed") {
//         try {
//             const session = event.data.project;

//             const purchase = await CoursePurchase.findOne({
//                 paymentIntentId: session.id,
//             }).populate({ path: "courseId" });

//             if (!purchase) {
//                 return res.status(404).json({ messege: "Purchase not found" });
//             }
//             if (session.amount_total) {
//                 purchase.amount = session.amount_total / 100;
//             }
//             purchase.status = "completed";
//             if (purchase.courseId && purchase.courseId.lectures.length > 0) {
//                 await Lecture.updateMany(
//                     { _id: { $in: purchase.courseId.lectures } },
//                     { $set: { $isPreviewFree: true } }
//                 );
//             }
//             await purchase.save();
//         } catch (error) {
//             console.log(error);
//         }
//     }
// };

// razorpay checkout
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export const createOrder = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ massege: "Course Not Found" });
        }

        // create a new course
        const newPurchase = new CoursePurchase({
            courseId,
            userId,
            amount: course.coursePrice,
            status: 'pending'
        });

        const options = {
            amount: Number(course.coursePrice * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };
        const order = await razorpayInstance.orders.create(options);
        newPurchase.paymentId = order.id;

        await newPurchase.save();

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.log(error);

    }
};

export const razorpayViewOrder = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const purchase = await CoursePurchase.findOne({
                paymentId: razorpay_order_id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                return res.status(404).json({ massege: "Purchase not found" });
            }
            purchase.status = "completed";
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { $isPreviewFree: true } }
                );
            }
            await purchase.save();

            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, { new: true }
            );

            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } },
                { new: true }
            );
            // Send Message 
            res.status(200).json({
                success: true,
                message: "Payement Successfull"
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
};
export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.id;
        
        const course = await Course.findById(courseId)
            .populate({ path: "creator" })
            .populate({ path: "lectures" });

        const purchased = await Course.findOne({ enrolledStudents:userId,_id:courseId});
        
        if (!course) {
            return res.status(404).json({
                massege: "Course not found"
            });
        }
        
        return res.status(200).json(
            {
                course,
                purchased: !!purchased
            }
        );

    } catch (error) {
        console.log(error);

    }
}

export const getAllPurchasedCourse = async (_, res) => {
    try {
        const purchasedCourse = await CoursePurchase.find(
            { status: "completed" }
        ).populate("courseId");
        if (!purchasedCourse) {
            return res.status(404).json({
                purchasedCourse: [],
            });
        }
        return res.status(200).json({
            purchasedCourse,
        })
    } catch (error) {
        console.log(error);
    }
}