import express from "express"
import { requestSended, gotFriendRequests } from "../controllers/requests.controller.js";
import { arcjetProtection } from "../middileware/arcjet.middleware.js";
import { protectedRoute } from "../middileware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectedRoute);
// router.use(protectedRoute);

router.post('/sended', requestSended)
router.get('/getFriendRequest', gotFriendRequests)

export default router;
