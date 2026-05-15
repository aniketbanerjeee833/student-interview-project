import { decryptStudentPayload, encryptField, encryptStudentPayload } from './encryption';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:5000/api';

export interface StudentData {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentCreatePayload {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
}

export interface StudentUpdatePayload {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password?: string;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || 'Request failed');
  }

  return json as T;
}

async function decryptStudent(student: StudentData): Promise<StudentData> {
  const decrypted = await decryptStudentPayload(student as unknown as Record<string, unknown>);
  return decrypted as unknown as StudentData;
}

export async function loginStudent(payload: { email: string; password: string }) {
  const body = {
    email: await encryptField(payload.email),
    password: await encryptField(payload.password),
  };

  return request<{
    success: boolean;
    message: string;
    student: { id: string; fullName: string; email: string; courseEnrolled: string };
  }>('/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function registerStudent(payload: StudentCreatePayload) {
  const body = await encryptStudentPayload(payload as unknown as unknown as Record<string, unknown>);

  return request<{ success: boolean; message: string; id: string }>('/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getStudents(): Promise<StudentData[]> {
  const response = await request<{ success: boolean; data: StudentData[] }>('/students', {
    method: 'GET',
  });

  return Promise.all(response.data.map((student) => decryptStudent(student)));
}

export async function updateStudent(id: string, payload: StudentUpdatePayload) {
  const body = await encryptStudentPayload(payload as unknown as unknown as Record<string, unknown>);

  return request<{ success: boolean; data: StudentData }>(`/student/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function deleteStudent(id: string) {
  return request<{ success: boolean; message: string }>(`/student/${id}`, {
    method: 'DELETE',
  });
}
