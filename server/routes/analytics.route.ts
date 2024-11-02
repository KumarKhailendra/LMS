import express from 'express'
import { authorizeRoles, isAutheticated } from '../middleware/auth';
import { getCourseAnalytics, getOrderAnalytics, getUserAnalytics } from '../controllers/analytics.controller';
import { updateAccessToken } from '../controllers/user.controller';
const analyticsRouter = express.Router();

analyticsRouter.get("/get-users-analytics", updateAccessToken, isAutheticated, authorizeRoles("admin"), getUserAnalytics);

analyticsRouter.get("/get-courses-analytics", updateAccessToken, isAutheticated, authorizeRoles("admin"), getCourseAnalytics);

analyticsRouter.get("/get-orders-analytics", updateAccessToken, isAutheticated, authorizeRoles("admin"), getOrderAnalytics);


export default analyticsRouter;