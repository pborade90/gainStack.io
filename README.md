# GainStack — Smart Workout Tracker

<div align="center">

![GainStack Badge](https://img.shields.io/badge/GainStack-Smart%20Workout%20Tracker-blue?style=for-the-badge\&logo=dumbbell)

</div>

> A modern, intelligent workout tracking app with advanced analytics for serious fitness enthusiasts.

---

## Overview

**GainStack** helps you train smarter — not harder.
It’s more than a workout log — it’s a **smart PWA** that tracks your progress, detects muscle imbalances, and optimizes rest periods automatically.

---

## Key Features

| Feature                          | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| 🏋️ Smart Workout Logging        | Track exercises, weights, reps, and sets with notes |
| 🧮 Integrated Plate Calculator   | Auto-calculates barbell plates                      |
| ⏱ Context-Aware Rest Timer       | Intelligent rest times based on rep ranges          |
| ⚖️ Muscle Imbalance Analysis     | Analyze left/right strength differences             | 
| 📈 Progressive Overload Tracking | Visualize strength progression                      |
| 📊 Strength & Volume Analytics   | PR tracking, muscle group trends                    |
| 📱 Offline PWA Support           | Works seamlessly without internet                   |
| 🌙 Dark Mode                     | Custom color palette and responsive UI              |

---

## Tech Stack

**Frontend**

* React
* Tailwind CSS
* React Router
* Context API for global state
* PWA support + Heroicons + date-fns

**Backend**

* Node.js + Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcryptjs for password hashing

---

## Quick Start

### 1️⃣ Clone & Setup

```bash
git clone https://github.com/pborade90/gainstack.git
cd gainstack
npm run setup
```

### 2️⃣ Backend Setup

```bash
cd backend
# Add your credentials: in env
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:4000](http://localhost:4000)

---

## Example Models

### User

```js
{
  email: String,
  password: String,
  profile: { name, age, weight, height, fitnessLevel },
  createdAt: Date
}
```

### Workout

```js
{
  title, load, reps, sets, unilateral,
  leftLoad, rightLoad, notes,
  user_id, completedAt
}
```

---

## API Overview

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/api/user/signup`  | Register user      |
| POST   | `/api/user/login`   | User login         |
| PATCH  | `/api/user/profile` | Update profile     |
| GET    | `/api/workouts`     | Get all workouts   |
| POST   | `/api/workouts`     | Create new workout |
| PATCH  | `/api/workouts/:id` | Update workout     |
| DELETE | `/api/workouts/:id` | Delete workout     |

---

## Smart Features Deep Dive

### Plate Calculator

```js
calculatePlates(100, 20);
// → [20, 20, 5, 2.5] per side
```

No more math mid-workout. Supports multiple barbell weights.

### Context-Aware Rest Timer

```js
if (reps <= 5) restTime = 180;
else if (reps <= 12) restTime = 90;
else restTime = 60;
```

Scientifically backed rest logic with auto-countdown.

### Muscle Imbalance Detection

```js
const imbalance = ((leftAvg - rightAvg) / Math.max(leftAvg, rightAvg)) * 100;
```

> “Your left arm is 8% stronger than your right.”

---

## Contributing

We love contributions!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

Follow code style and use `async/await`.

---

## Future Plans

* Push notifications
* Advanced analytics dashboards
* Rate limiting & performance caching
* Mobile native wrapper (Capacitor)

---

<div align="center">

Made with 💪 by the **GainStack**

</div>
