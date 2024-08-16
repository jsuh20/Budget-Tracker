const express = require('express');
const app = express()
require('dotenv').config();
const Transaction = require('./models/Transactions.js')
const mongoose = require("mongoose")
const cors = require('cors')

app.use(cors());
app.use(express.json());
app.get('/api/test', (req,res) => {
    res.json('test ok3'); 
});


app.post('/api/transaction', async (req,res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const {plusMinus, name, price, description, datetime} = req.body
    const transaction = await Transaction.create({plusMinus, name, price, description, datetime})
    res.json(transaction)
});

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(process.env.MONGO_URL)
    const transactions = await Transaction.find();
    res.json(transactions)
})

// DELETE route to delete a transaction by ID
app.delete('/api/deleteTransaction/:name', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const { name } = req.params;
    console.log('req ' + name)
    try {
        const deletedTransaction = await Transaction.findOneAndDelete(name);

        if (deletedTransaction) {
            res.json({ message: 'Transaction deleted successfully', deletedTransaction });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
});

app.listen(4000)
