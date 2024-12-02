const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running on port 8000.');
});
app.get('/price', (req, res) =>{
    res.send("50");
})
app.get('/price1', (req, res) =>{
    res.send({
        "price": "50"
    });
})
app.get('/price2', (req, res) =>{
    res.send({
        "price": "30"
    });
})
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
