import express from 'express';
import cors from 'cors';
import { getScore } from './score.mjs';

const app = express();
app.use(express.json());

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  }));
const PORT = 8000;
const DEFAULT_PRICE1 = 50;
const DEFAULT_PRICE2 = 30;
const C = 1.5;
const D = 5.0;

let price1 = DEFAULT_PRICE1;
let price2 = DEFAULT_PRICE2;

const updatePrice = (currentPrice, score, multiplier) => {
    const newPrice = currentPrice + score * multiplier;
    return newPrice < 0 ? 0 : newPrice;
};

app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running on port 8000.');
});

app.get('/price', (req, res) => {
    res.json(price1.toString());
});

app.get('/price1', (req, res) => {
    res.json({ price: price1 });
});

app.get('/price2', (req, res) => {
    res.json({ price: price2 });
});

app.post('/getScore', async (req, res) => {
    const { username, multiplier } = req.body;

    if (!username || typeof multiplier !== 'number') {
        return res.status(400).json({ error: 'Invalid request body. Provide "username" and "multiplier".' });
    }

    try {
        const score = await getScore(username, C, D);
        if (username === 'manan') {
            price1 = updatePrice(price1, score, multiplier);
            return res.json({ score, price: price1 });
        } else {
            price2 = updatePrice(price2, score, multiplier);
            return res.json({ score, price: price2 });
        }
    } catch (error) {
        console.error('Error fetching score:', error);
        res.status(500).json({ error: 'Failed to calculate score.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
