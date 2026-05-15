import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import Student from '../models/Student';
import { backendEncrypt,backendDecrypt } from '../utils/crypto';


// Fields to apply double-encryption on (all except password which is bcrypt-hashed)
const ENCRYPTED_FIELDS = ['fullName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'courseEnrolled'] as const;

type EncryptedField = typeof ENCRYPTED_FIELDS[number];

interface StudentPayload {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

/**
 * POST /api/register
 * Receives: frontend-encrypted (Level 1) fields
 * Applies:  backend AES encryption (Level 2) on each field
 * Stores:   doubly-encrypted data in MongoDB
 */
export const registerStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: StudentPayload = req.body;

    // Apply backend (Level 2) encryption on top of frontend (Level 1) encrypted data
    const doubleEncrypted: Partial<Record<string, string>> = {};
    for (const field of ENCRYPTED_FIELDS) {
      if (body[field]) {
        doubleEncrypted[field] = backendEncrypt(body[field]);
      }
    }

    // Password: backend-encrypt the frontend-encrypted password, then bcrypt hash it
    const doubleEncryptedPassword = backendEncrypt(body.password);
    const hashedPassword = await bcrypt.hash(doubleEncryptedPassword, 12);

    const student = new Student({
      ...doubleEncrypted,
      password: hashedPassword,
    });

    const saved = await student.save();

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      id: saved._id,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    if (msg.includes('E11000')) {
      res.status(409).json({ success: false, message: 'Email already registered' });
    } else {
      res.status(500).json({ success: false, message: msg });
    }
  }
};

/**
 * GET /api/students
 * Fetches all students, strips backend Level 2 encryption,
 * returns Level 1 (frontend) encrypted data so frontend can decrypt.
 */
export const getStudents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const students = await Student.find({}, { password: 0, __v: 0 });

    const decryptedStudents = students.map((s) => {
      const obj: Record<string, unknown> = {
        _id: s._id,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      };

      // Strip backend (Level 2) → send still-Level-1-encrypted data to frontend
      for (const field of ENCRYPTED_FIELDS) {
        const val = s[field as EncryptedField] as string;
        if (val) {
          obj[field] = backendDecrypt(val);
        }
      }

      return obj;
    });

    res.status(200).json({ success: true, data: decryptedStudents });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * PUT /api/student/:id
 * Receives frontend-encrypted (Level 1) fields,
 * re-applies backend (Level 2) encryption before saving.
 */
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body: Partial<StudentPayload> = req.body;

    const updateData: Partial<Record<string, string>> = {};

    for (const field of ENCRYPTED_FIELDS) {
      if (body[field]) {
        updateData[field] = backendEncrypt(body[field] as string);
      }
    }

    if (body.password) {
      const doubleEncryptedPassword = backendEncrypt(body.password);
      updateData.password = await bcrypt.hash(doubleEncryptedPassword, 12);
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, select: '-password -__v' }
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    // Return Level 1 encrypted data (strip Level 2)
    const responseObj: Record<string, unknown> = {
      _id: updated._id,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
    for (const field of ENCRYPTED_FIELDS) {
      const val = updated[field as EncryptedField] as string;
      if (val) responseObj[field] = backendDecrypt(val);
    }

    res.status(200).json({ success: true, data: responseObj });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * DELETE /api/student/:id
 */
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: msg });
  }
};

/**
 * POST /api/login
 * Login: receives frontend-encrypted email + password
 * Backend: decrypts email to find user, verifies bcrypt password
 */
export const loginStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email: encryptedEmail, password: encryptedPassword } = req.body;

    // Get all students and find match by decrypting all emails
    // (In production, consider a separate hash index for lookup)
    const students = await Student.find({});

    let matchedStudent: typeof students[0] | null = null;

    for (const student of students) {
      // Strip Level 2 to get Level 1 encrypted email
      const level1Email = backendDecrypt(student.email);
      // Compare the encrypted values directly (both should be Level 1 encrypted of the same email)
      if (level1Email === encryptedEmail) {
        matchedStudent = student;
        break;
      }
    }

    if (!matchedStudent) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    // Compare password: backend-encrypt the incoming L1-encrypted password, then bcrypt check
    const doubleEncryptedPassword = backendEncrypt(encryptedPassword);
    const isMatch = await bcrypt.compare(doubleEncryptedPassword, matchedStudent.password);

    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      student: {
        id: matchedStudent._id,
        // Return Level 1 encrypted fields for frontend to decrypt
        fullName: backendDecrypt(matchedStudent.fullName),
        email: backendDecrypt(matchedStudent.email),
        courseEnrolled: backendDecrypt(matchedStudent.courseEnrolled),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ success: false, message: msg });
  }
};