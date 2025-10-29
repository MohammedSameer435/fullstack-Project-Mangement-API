import { Note } from "../models/noteModel.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

// Get all notes for a project
export const getProjectNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const notes = await Note.find({ projectId }).sort({ createdAt: -1 });

  // don't throw 404 — return empty array if none
  return res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully"));
});
// Create a note (Admins only)
export const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  // accept title optional, but prefer frontend to send it
  const { title = "", content } = req.body;
  const userId = req.user._id;

  if (!content) throw new ApiError(400, "Content is required");

  const note = await Note.create({
    projectId,
    title: title || (content.length > 50 ? content.slice(0, 47) + "..." : content),
    content,
    createdBy: userId,
  });

  // return created note in data
  return res.status(201).json(new ApiResponse(201, note, "Note created successfully"));
});

// Get a specific note
export const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params
  const note = await Note.findById(noteId)

  if (!note) {
    throw new ApiError(404, "Note not found")
  }

  res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"))
})

// Update a note
export const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params
  const { title, content } = req.body

  const note = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { new: true, runValidators: true }
  )

  if (!note) {
    throw new ApiError(404, "Note not found")
  }

  res.status(200).json(new ApiResponse(200, note, "Note updated successfully"))
})

// Delete a note
export const deleteNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  // ensure note belongs to project (optional but safer)
  const note = await Note.findOneAndDelete({ _id: noteId, projectId });

  if (!note) throw new ApiError(404, "Note not found");

  return res.status(200).json(new ApiResponse(200, null, "Note deleted successfully"));
});