import express from 'express'
import { authorizeRoles, isAutheticated } from '../middleware/auth';
import { getNotifications, updateNotifications } from '../controllers/notification.controllers';
import { updateAccessToken } from '../controllers/user.controller';
const notificationRouter = express.Router();

notificationRouter.get("/get-all-notifications", updateAccessToken, isAutheticated, authorizeRoles("admin"), getNotifications);

notificationRouter.put("/update-notification/:id", updateAccessToken, isAutheticated, authorizeRoles("admin"), updateNotifications);

export default notificationRouter;