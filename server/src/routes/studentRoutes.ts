import { Router } from 'express';
import { deleteStudent, getStudents, loginStudent, registerStudent, updateStudent } from '../controllers/studentController';


const router = Router();

router.post('/login', loginStudent);
router.post('/register', registerStudent);
router.get('/students', getStudents);
router.put('/student/:id', updateStudent);
router.delete('/student/:id', deleteStudent);

export default router;