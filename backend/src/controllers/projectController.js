
import Project from "../models/projectModel.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from "../models/usersModel.js"



export const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [
      { owner: req.user._id },
      { "members.user": req.user._id },
    ],
  })
    .populate("members.user", "name email username") // ✅ include this
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});




export const createProject = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { name, description } = req.body

    if (!name) throw new ApiError(400, "Project name is required")

    const project = await Project.create({
        name,
        description,
        owner: userId,
        members: [{ user: userId, role: "Admin" }]
    })

    return res.status(201).json(new ApiResponse(201, project, "Project created successfully"))
})



export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(projectId).populate("members.user", "name email")

    if (!project) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"))
})


export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { name, description },
        { new: true }
    )

    if (!updatedProject) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"))
})


export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const deleted = await Project.findByIdAndDelete(projectId)

    if (!deleted) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"))
})

export const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate("members.user", "name email username")
    .lean();

  if (!project) throw new ApiError(404, "Project not found");

  return res
    .status(200)
    .json(new ApiResponse(200, project.members, "Members fetched successfully"));
});


export const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email, role } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Find the user by email
  const userToAdd = await User.findOne({ email });
  if (!userToAdd) throw new ApiError(404, "User not found");

  // Check if already exists
  const exists = project.members.some(
    (m) => m.user.toString() === userToAdd._id.toString()
  );
  if (exists) throw new ApiError(400, "User already a member");

  // Add new member
  project.members.push({ user: userToAdd._id, role });
  await project.save();

  // Populate before sending response
  const updatedProject = await Project.findById(projectId)
    .populate("members.user", "name email username");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Member added successfully"));
});







export const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params
    const { role } = req.body

    const project = await Project.findById(projectId)
    if (!project) throw new ApiError(404, "Project not found")

    const member = project.members.find(m => m.user.toString() === userId)
    if (!member) throw new ApiError(404, "Member not found")

    member.role = role
    await project.save()

    return res.status(200).json(new ApiResponse(200, project, "Member role updated"))
})




export const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    // FIXED: correctly filter based on nested "member.user"
    project.members = project.members.filter(
      (member) => member.user.toString() !== userId
    );

    await project.save();

    const updatedProject = await Project.findById(projectId)
      .populate("members.user", "name email username");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
