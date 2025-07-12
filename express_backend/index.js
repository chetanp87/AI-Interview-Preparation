import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/ai', aiRoutes); // ✅ Our AI feedback route

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
