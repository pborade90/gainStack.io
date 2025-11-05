import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    load: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    sets: {
        type: Number,
        default: 1
    },
    notes: {
        type: String,
        maxlength: 500
    },
    unilateral: {
        type: Boolean,
        default: false
    },
    leftLoad: Number,
    rightLoad: Number,
    leftReps: Number,
    rightReps: Number,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
workoutSchema.index({ user_id: 1, createdAt: -1 });

export default mongoose.model('Workout', workoutSchema);