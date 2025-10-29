
import mongoose, { Schema } from "mongoose"

const memberSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Member","user"], // you can add more roles if needed
        default: "Member"
    },
}, { _id: false }) // no separate _id for each member object

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Project owner is required"]
    },
    members: {
      type: [memberSchema],
      default: [],
    },

    status: {
        type: String,
        enum: ["Active", "Completed", "On Hold"],
        default: "Active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

// automatically updates 'updatedAt' when project changes
projectSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})

const Project = mongoose.model("Project", projectSchema)

export default Project
