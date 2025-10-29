import express from "express"
import {
  getProjectNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js"
import { verifyJWT } from "../middlewares/authMiddleware.js"
import { isAdmin, isProjectMember } from "../middlewares/roleMiddleware.js"

const router = express.Router()

//  Apply JWT verification for all note routes
router.use(verifyJWT)

//  Get all notes for a project (Members + Admins)
router.get("/:projectId", isProjectMember, getProjectNotes)

//  Create a note (Admins only)
router.post("/:projectId", isAdmin, createNote)

// Get single note by ID (Members + Admins)
router.get("/:projectId/n/:noteId", isProjectMember, getNoteById)

// Update a note (Admins only)
router.put("/:projectId/n/:noteId", isAdmin, updateNote)

//  Delete a note (Admins only)
router.delete("/:projectId/n/:noteId", isAdmin, deleteNote)

export default router
