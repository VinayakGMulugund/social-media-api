const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      min: 3,
      max: 20,
      unique: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      data: Buffer,
      contentType: String
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false
  },
},
  { timestamps: true }
);


const bcrypt = require('bcrypt')

//hash password
UserSchema.pre('save', async function() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
})


//comapre password for login
UserSchema.methods.comparePassword = async function(pass) {
  const isMatch = await bcrypt.compare(pass,this.password)
  return isMatch
}

//jwt
UserSchema.methods.createJWT = function() {
  return jwt.sign({userId: this._id, isAdmin: this.isAdmin}, process.env.jwt_secret, {expiresIn: process.env.jwt_expiry})
}


module.exports = mongoose.model("User", UserSchema)