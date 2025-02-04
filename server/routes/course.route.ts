import express from "express";
import { authorizeRoles, isAutheticated } from "../middleware/auth";
import { addAnswer, addQuestion, addReplyToReview, addReview, deleteCourse, editCourse, getAllCourse, getAllCourses, getCourseByUser, getSingleCourse, uploadCourse } from "../controllers/course.controller";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  editCourse
);

courseRouter.get(
  "/get-course/:id",
  getSingleCourse
);

courseRouter.get(
  "/get-course",
  // updateAccessToken,
  getAllCourse
);

courseRouter.get(
  "/get-course-content/:id",
  updateAccessToken,
  isAutheticated,
  getCourseByUser
);

courseRouter.put(
  "/add-question",
  updateAccessToken,
  isAutheticated,
  addQuestion
);

courseRouter.put(
  "/add-answer",
  updateAccessToken,
  isAutheticated,
  addAnswer
);

courseRouter.put(
  "/add-review/:id",
  updateAccessToken,
  isAutheticated,
  addReview
);

courseRouter.put(
  "/add-review-reply",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  addReplyToReview
);

courseRouter.get(
  "/get-courses",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  getAllCourses
);

courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAutheticated,
  authorizeRoles("admin"),
  deleteCourse
);

export default courseRouter;
