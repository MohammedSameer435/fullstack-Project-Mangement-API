import express from "express"
const app= express()
import cors from "cors"
import cookieParser from "cookie-parser"

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods: ["Get", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

import healthcheckrouter from "./routes/healthCheckRoutes.js"
import authrouter from "./routes/authRoutes.js"
import noterouter from "./routes/noteRoutes.js"
import projectrouter from "./routes/projectRoutes.js"
import taskrouter from "./routes/taskRoutes.js"
app.use("/api/v1/healthcheck", healthcheckrouter)
app.use('/api/v1/users', authrouter)
app.use('/api/v1/notes', noterouter)
app.use('/api/v1/projects', projectrouter)
app.use('/api/v1/tasks', taskrouter)


app.get("/" ,(req,res) =>{
    res.send("welcome to basecamp")
})
export default app
