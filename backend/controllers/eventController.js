const Event = require("../models/Event");

const APP_STATUSES = ["Pending", "Approved", "Rejected"];

const normalizeLegacyApplicationStatuses = (event) => {
  if (!event?.applications) return;
  event.applications.forEach((application) => {
    if (application.applicationStatus === "Cancelled") {
      application.applicationStatus = "Rejected";
      if (!application.remarks) {
        application.remarks = "Converted from legacy cancelled status";
      }
    }
  });
};

const populateEvent = (query) =>
  query
    .populate("participants", "userId name email role")
    .populate("applications.user", "userId name email role")
    .populate("applications.reviewedBy", "userId name email role");

const getEvents = async (req, res) => {
  try {
    const events = await populateEvent(Event.find().sort({ createdAt: -1 }));
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await populateEvent(Event.findById(req.params.id));
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create({
      ...req.body,
      participants: req.body.participants || [],
      applications: req.body.applications || [],
    });
    const populated = await newEvent.populate([
      { path: "participants", select: "userId name email role" },
      { path: "applications.user", select: "userId name email role" },
      { path: "applications.reviewedBy", select: "userId name email role" },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    await updatedEvent.populate([
      { path: "participants", select: "userId name email role" },
      { path: "applications.user", select: "userId name email role" },
      { path: "applications.reviewedBy", select: "userId name email role" },
    ]);
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const applyForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    normalizeLegacyApplicationStatuses(event);

    const existingApp = event.applications.find((app) => String(app.user) === String(req.user._id));

    if (existingApp) {
      if (existingApp.applicationStatus === "Pending") {
        return res.status(400).json({ message: "Application is already pending" });
      }
      if (existingApp.applicationStatus === "Approved") {
        return res.status(400).json({ message: "Already approved for this event" });
      }

      existingApp.applicationStatus = "Pending";
      existingApp.applicationDate = new Date();
      existingApp.reviewedBy = null;
      existingApp.reviewDate = null;
      existingApp.remarks = "";
    } else {
      event.applications.push({
        user: req.user._id,
        applicationStatus: "Pending",
        role: "Participant",
      });
    }

    await event.save();
    await event.populate([
      { path: "participants", select: "userId name email role" },
      { path: "applications.user", select: "userId name email role" },
      { path: "applications.reviewedBy", select: "userId name email role" },
    ]);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const cancelEventApplication = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    normalizeLegacyApplicationStatuses(event);

    const application = event.applications.find((app) => String(app.user) === String(req.user._id));
    if (!application) {
      return res.status(400).json({ message: "No application found for this event" });
    }

    application.applicationStatus = "Rejected";
    application.reviewedBy = null;
    application.reviewDate = null;
    application.remarks = "Withdrawn by student";

    event.participants = event.participants.filter((participantId) => String(participantId) !== String(req.user._id));

    await event.save();
    await event.populate([
      { path: "participants", select: "userId name email role" },
      { path: "applications.user", select: "userId name email role" },
      { path: "applications.reviewedBy", select: "userId name email role" },
    ]);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const reviewEventApplication = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!APP_STATUSES.includes(status) || status === "Pending") {
      return res.status(400).json({ message: "Invalid review status" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    normalizeLegacyApplicationStatuses(event);

    const application = event.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.applicationStatus = status;
    application.reviewedBy = req.user._id;
    application.reviewDate = new Date();
    application.remarks = remarks || "";

    if (status === "Approved") {
      const alreadyParticipant = event.participants.some((participantId) => String(participantId) === String(application.user));
      if (!alreadyParticipant) {
        if (event.participants.length >= event.maxParticipants) {
          return res.status(400).json({ message: "Event is full" });
        }
        event.participants.push(application.user);
      }
    }

    if (status === "Rejected") {
      event.participants = event.participants.filter((participantId) => String(participantId) !== String(application.user));
    }

    await event.save();
    await event.populate([
      { path: "participants", select: "userId name email role" },
      { path: "applications.user", select: "userId name email role" },
      { path: "applications.reviewedBy", select: "userId name email role" },
    ]);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  applyForEvent,
  cancelEventApplication,
  reviewEventApplication,
};