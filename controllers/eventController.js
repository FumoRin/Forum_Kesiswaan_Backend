const db = require("../config/database");
const uploadService = require("../routes/uploadRoutes");

exports.getAllEvents = async (req, res) => {
  try {
    const [events] = await db.promise().query("SELECT * FROM events");
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const [event] = await db
      .promise()
      .query("SELECT * FROM events WHERE id = ?", [req.params.id]);
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    // Extract file URLs if files were uploaded
    let thumbnailUrl = null;
    let galleryUrls = [];

    if (req.files) {
      // Process thumbnail
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = uploadService.fileUtils.generateFileUrl(
          req.files.thumbnail[0].filename
        );
      }

      // Process gallery images
      if (req.files.gallery) {
        galleryUrls = req.files.gallery.map((file) =>
          uploadService.fileUtils.generateFileUrl(file.filename)
        );
      }
    }

    const {
      title,
      school,
      event,
      date,
      content,
      status = "pending",
    } = req.body;

    // Convert gallery array to JSON string for storage
    const galleryJson = JSON.stringify(galleryUrls);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO events (title, school, event, date, content, thumbnail, gallery, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
        [title, school, event, date, content, thumbnailUrl, galleryJson, status]
      );

    res.status(201).json({
      id: result.insertId,
      title,
      school,
      event,
      date,
      content,
      thumbnail: thumbnailUrl,
      gallery: galleryUrls,
      status,
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    // First get the existing event to handle file updates correctly
    const [existingEvent] = await db
      .promise()
      .query("SELECT * FROM events WHERE id = ?", [req.params.id]);

    if (existingEvent.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const currentEvent = existingEvent[0];

    // Process uploaded files
    let thumbnailUrl = currentEvent.thumbnail;
    let galleryUrls = currentEvent.gallery
      ? JSON.parse(currentEvent.gallery)
      : [];

    if (req.files) {
      // Process thumbnail
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        // Remove old thumbnail file if it exists
        if (currentEvent.thumbnail) {
          await uploadService.fileUtils.deleteFile(currentEvent.thumbnail);
        }
        thumbnailUrl = uploadService.fileUtils.generateFileUrl(
          req.files.thumbnail[0].filename
        );
      }

      // Process gallery images
      if (req.files.gallery) {
        // Add new gallery images
        const newGalleryUrls = req.files.gallery.map((file) =>
          uploadService.fileUtils.generateFileUrl(file.filename)
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }
    }

    // Extract body fields with fallbacks to current values
    const {
      title = currentEvent.title,
      school = currentEvent.school,
      event = currentEvent.event,
      date = currentEvent.date,
      content = currentEvent.content,
      status = currentEvent.status,
    } = req.body;

    // Handle gallery remove if specified in request
    if (
      req.body.removeGalleryItems &&
      Array.isArray(JSON.parse(req.body.removeGalleryItems))
    ) {
      const itemsToRemove = JSON.parse(req.body.removeGalleryItems);

      // Remove files from server
      for (const url of itemsToRemove) {
        await uploadService.fileUtils.deleteFile(url);
      }

      // Filter out removed items from gallery
      galleryUrls = galleryUrls.filter((url) => !itemsToRemove.includes(url));
    }

    // Convert gallery array to JSON string for storage
    const galleryJson = JSON.stringify(galleryUrls);

    await db
      .promise()
      .query(
        "UPDATE events SET title = ?, school = ?, event = ?, date = ?, content = ?, thumbnail = ?, gallery = ?, status = ?, updated_at = NOW() WHERE id = ?",
        [
          title,
          school,
          event,
          date,
          content,
          thumbnailUrl,
          galleryJson,
          status,
          req.params.id,
        ]
      );

    res.status(200).json({
      id: parseInt(req.params.id),
      title,
      school,
      event,
      date,
      content,
      thumbnail: thumbnailUrl,
      gallery: galleryUrls,
      status,
      updated_at: new Date(),
    });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    // Get the event to delete its files
    const [event] = await db
      .promise()
      .query("SELECT thumbnail, gallery FROM events WHERE id = ?", [
        req.params.id,
      ]);

    if (event.length > 0) {
      // Delete thumbnail if exists
      if (event[0].thumbnail) {
        await uploadService.fileUtils.deleteFile(event[0].thumbnail);
      }

      // Delete gallery images if exist
      if (event[0].gallery) {
        const galleryUrls = JSON.parse(event[0].gallery);
        for (const url of galleryUrls) {
          await uploadService.fileUtils.deleteFile(url);
        }
      }
    }

    // Delete the event from the database
    await db
      .promise()
      .query("DELETE FROM events WHERE id = ?", [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware to prepare for file uploads
exports.prepareFileUpload = uploadService.uploadMiddleware.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);
