import { getScore } from "./score";
const c = 1.5; 
const d = 5.0;

getScore('manan', c, d).then((score) => {
    console.log('Score:', score);
});