import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }, // Ensures this is for admins only
},

);


const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
