import  Project  from "../models/projectModel.js";
import { ApiError } from "../utils/apiError.js";

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Access denied — Admins only"));
  }
  next();
};

export const isProjectMember = async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  const project = await Project.findById(projectId);

  if (!project) {
    return next(new ApiError(404, "Project not found"));
  }

  const isMember =
    project.members.some(member => member.user.toString() === userId.toString()) ||
    project.owner.toString() === userId.toString() ||
    req.user.role === "admin";

  if (!isMember) {
    return next(new ApiError(403, "Access denied — not a project member"));
  }

  next();
};
