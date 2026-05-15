import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;      // stored as backend-encrypted(frontend-encrypted(plaintext))
  email: string;         // stored as backend-encrypted(frontend-encrypted(plaintext))
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;      // bcrypt hashed on top of encryption
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    fullName:       { type: String, required: true },
    email:          { type: String, required: true, unique: true },
    phone:          { type: String, required: true },
    dateOfBirth:    { type: String, required: true },
    gender:         { type: String, required: true },
    address:        { type: String, required: true },
    courseEnrolled: { type: String, required: true },
    password:       { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudent>('Student', StudentSchema);