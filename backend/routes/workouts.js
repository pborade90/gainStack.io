import express from 'express';
import {
    getWorkouts,
    getWorkout,
    createWorkout,
    deleteWorkout,
    updateWorkout,
    getImbalanceAnalysis
} from '../controllers/workoutController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get('/', getWorkouts);
router.get('/analysis/imbalance', getImbalanceAnalysis);
router.get('/:id', getWorkout);
router.post('/', createWorkout);
router.delete('/:id', deleteWorkout);
router.patch('/:id', updateWorkout);

export default router;