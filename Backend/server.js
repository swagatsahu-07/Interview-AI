require('dotenv').config();

const app = require('./src/app');
const connectToDb = require('./src/config/db');



const PORT = process.env.PORT;
connectToDb();



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
})