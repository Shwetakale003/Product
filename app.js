const express = require('express');
const mongoose = require('mongoose');
const Category = require('./models/category');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Category routes
app.get('/api/categories', function(req, res) {
    Category.find().sort('name').exec(function(err, categories) {
        if (err) return res.status(500).send(err);
        res.send(categories);
    });
});

app.post('/api/categories', function(req, res) {
    const category = new Category({ name: req.body.name });
    category.save(function(err, savedCategory) {
        if (err) return res.status(500).send(err);
        res.send(savedCategory);
    });
});

app.put('/api/categories/:id', function(req, res) {
    Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true }, function(err, updatedCategory) {
        if (err) return res.status(500).send(err);
        res.send(updatedCategory);
    });
});

app.delete('/api/categories/:id', function(req, res) {
    Category.findByIdAndDelete(req.params.id, function(err, deletedCategory) {
        if (err) return res.status(500).send(err);
        Product.deleteMany({ category: deletedCategory._id }, function(err) {
            if (err) return res.status(500).send(err);
            res.send(deletedCategory);
        });
    });
});

// Product routes
app.get('/api/products', function(req, res) {
    const pageSize = req.query.pageSize || 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * pageSize;
    Product.find().populate('category').sort('name').skip(skip).limit(pageSize).exec(function(err, products) {
        if (err) return res.status(500).send(err);
        Product.countDocuments().exec(function(err, count) {
            if (err) return res.status(500).send(err);
            res.send({
                products: products,
                totalPages: Math.ceil(count / pageSize),
                currentPage: page
            });
        });
    });
});

app.post('/api/products', function(req, res) {
    const product = new Product({ name: req.body.name, category: req.body.category });
    product.save(function(err, savedProduct) {
        if (err) return res.status(500).send(err);
        res.send(savedProduct);
    });
});

app
