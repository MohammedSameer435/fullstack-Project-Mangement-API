import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: { type: String },
        localpath: { type: String },
      },
      default: {
        url: "https://placehold.co/600x400",
        localpath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
} )

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      _id: this._id,
      email:this.email,
      username:this.username,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  )
}
userSchema.methods.generateRefreshToken =function(){
  return jwt.sign({
    _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
)
  
}

userSchema.methods.generateTemporaryToken =function(){
  const unhashedToken= crypto.randomBytes(20).toString("hex")

  const hashedToken=crypto
  .createHash("sha256")
  .update(unhashedToken)
  .digest("hex")

  const tokenExpiry = Date.now() + (20*60*1000)
  return {unhashedToken,hashedToken,tokenExpiry}
}
export const User = mongoose.model("User", userSchema);
