import express from 'express';
import {getScore} from './score.mjs';
const app = express();

app.use(express.json());

let price1 = 50;
let price2 = 30;



app.get('/', (req, res) => {
    res.send('Hello, World! Your server is running on port 8000.');
});
app.get('/price', (req, res) =>{
    res.send(price1.toString());
    
})
app.get('/price1', (req, res) =>{
    res.send({
        "price": price1,
    });
})
app.get('/price2', (req, res) =>{
    res.send({
        "price": "30"
    });
})
const c = 1.5; 
const d = 5.0;


app.post('/getScore', (req, res) =>{
    let username = req.params.username;
    let mutliplier = req.params.mutliplier;
    if(username=='manan'){
        getScore('manan', c, d).then((score) => {
            price1 += score * (mutliplier);
            if(price1 < 0)  price1 = 0;
            res.send({
                "score": score,
                "price": price1
            });
        });
    }
    else{

        getScore('xmusk', c, d).then((score) => {
            price2 += score * (mutliplier);
            if(price2 < 0) price2 = 0;
            res.send({
                "score": score,
                "price": price2
            });
        });
        
    }
})
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

