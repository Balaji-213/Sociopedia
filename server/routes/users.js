import express from "express";
import multer from "multer";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersByName,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  limits: {
    fieldNameSize: 100, // Max field name size in bytes
    fieldSize: 10 * 1024 * 1024, // Max field value size in bytes (here set to 2MB)
  }
});

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/search/:name",verifyToken,getUsersByName);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/:id/updateId",verifyToken, upload.any(), updateUser);

export default router;
