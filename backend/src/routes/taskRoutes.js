
import { Router } from "express"
import { verifyJWT } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/roleMiddleware.js"
import {
    getProjectTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} from "../controllers/taskController.js"

const router = Router()


router.use(verifyJWT)


router.route("/:projectId")
    .get(getProjectTasks)
    .post(isAdmin,createTask)

router.route("/:projectId/t/:taskId")
    .get(getTaskById)
    .put(updateTask)
    .delete(isAdmin,deleteTask)


router.route("/:projectId/t/:taskId/subtasks")
    .post(isAdmin,createSubTask)

router.route("/:projectId/st/:subTaskId")
    .put(updateSubTask)
    .delete(isAdmin,deleteSubTask)

export default router
