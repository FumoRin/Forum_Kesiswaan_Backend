const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticate } = require("../middleware/auth");

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Protected routes (require authentication)
router.post(
  "/",
  authenticate,
  eventController.prepareFileUpload,
  eventController.createEvent
);
router.put(
  "/:id",
  authenticate,
  eventController.prepareFileUpload,
  eventController.updateEvent
);
router.delete("/:id", authenticate, eventController.deleteEvent);

module.exports = router;
