import Workout from '../models/Workout.js';
import mongoose from 'mongoose';

export const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ user_id: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(workouts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    try {
        const workout = await Workout.findOne({ _id: id, user_id: req.user._id });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createWorkout = async (req, res) => {
    const { title, load, reps, sets, notes, unilateral, leftLoad, rightLoad, leftReps, rightReps } = req.body;

    let emptyFields = [];
    if (!title) emptyFields.push('title');
    if (!load && !unilateral) emptyFields.push('load');
    if (!reps && !unilateral) emptyFields.push('reps');
    if (unilateral && (!leftLoad || !rightLoad || !leftReps || !rightReps)) {
        emptyFields.push('unilateralFields');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({
            error: 'Please fill in all required fields',
            emptyFields
        });
    }

    try {
        const workoutData = {
            title,
            load: unilateral ? null : load,
            reps: unilateral ? null : reps,
            sets: sets || 1,
            notes,
            unilateral: unilateral || false,
            user_id: req.user._id
        };

        if (unilateral) {
            workoutData.leftLoad = leftLoad;
            workoutData.rightLoad = rightLoad;
            workoutData.leftReps = leftReps;
            workoutData.rightReps = rightReps;
        }

        const workout = await Workout.create(workoutData);
        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    try {
        const workout = await Workout.findOneAndDelete({
            _id: id,
            user_id: req.user._id
        });

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateWorkout = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Workout not found' });
    }

    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            { ...req.body },
            { new: true, runValidators: true }
        );

        if (!workout) {
            return res.status(404).json({ error: 'Workout not found' });
        }

        res.status(200).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get imbalance analysis
export const getImbalanceAnalysis = async (req, res) => {
    try {
        const unilateralWorkouts = await Workout.find({
            user_id: req.user._id,
            unilateral: true
        });

        const analysis = {};

        unilateralWorkouts.forEach(workout => {
            if (!analysis[workout.title]) {
                analysis[workout.title] = {
                    leftTotal: 0,
                    rightTotal: 0,
                    leftReps: 0,
                    rightReps: 0,
                    count: 0
                };
            }

            analysis[workout.title].leftTotal += workout.leftLoad * workout.leftReps;
            analysis[workout.title].rightTotal += workout.rightLoad * workout.rightReps;
            analysis[workout.title].leftReps += workout.leftReps;
            analysis[workout.title].rightReps += workout.rightReps;
            analysis[workout.title].count += 1;
        });

        // Calculate averages and imbalances
        const result = Object.keys(analysis).map(exercise => {
            const data = analysis[exercise];
            const leftAvg = data.leftTotal / data.count;
            const rightAvg = data.rightTotal / data.count;
            const imbalance = ((leftAvg - rightAvg) / Math.max(leftAvg, rightAvg)) * 100;

            return {
                exercise,
                leftAvg: Math.round(leftAvg * 100) / 100,
                rightAvg: Math.round(rightAvg * 100) / 100,
                imbalance: Math.round(imbalance * 100) / 100,
                strongerSide: imbalance > 0 ? 'left' : 'right'
            };
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};