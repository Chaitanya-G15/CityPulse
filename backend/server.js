
// // Start server
// app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // replaces bodyParser

// Setup multer (for handling images/videos)
const upload = multer({ storage: multer.memoryStorage() });

// MongoDB Connection (Atlas or Local)
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/roadIssues", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const issueSchema = new mongoose.Schema({
  country: String,
  state: String,
  city: String,
  roadType: String,
  roadNo: String,
  description: String,
  lat: Number,
  lng: Number,
  timestamp: { type: Date, default: Date.now },
  file: Buffer,
  fileType: String,
});

const Issue = mongoose.model("Issue", issueSchema);

// POST route (citizen submits report)
app.post("/api/report", upload.single("file"), async (req, res) => {
  try {
    const { country, state, city, roadType, roadNo, description, lat, lng } = req.body;

    const issue = new Issue({
      country,
      state,
      city,
      roadType,
      roadNo,
      description,
      lat,
      lng,
      file: req.file ? req.file.buffer : null,
      fileType: req.file ? req.file.mimetype : null,
    });

    await issue.save();
    res.status(201).json({ message: "✅ Report saved successfully" });
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).json({ message: "❌ Error saving report", error: err.message });
  }
});

// GET route (for showing reports on map)
app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Issue.find().select("-file"); // exclude file data
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "❌ Error fetching reports", error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
