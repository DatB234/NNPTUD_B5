const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String
});

// Create the Category model
const Category = mongoose.model('Category', categorySchema);

// Create a new category
router.post('/categories', async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        });
        const savedCategory = await category.save();
        res.status(201).json(savedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single category by ID
router.get('/categories/:id', getCategory, (req, res) => {
    res.json(res.category);
});

// Update a category by ID
router.patch('/categories/:id', getCategory, async (req, res) => {
    if (req.body.name != null) {
        res.category.name = req.body.name;
    }
    if (req.body.description != null) {
        res.category.description = req.body.description;
    }
    try {
        const updatedCategory = await res.category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a category by ID
router.delete('/categories/:id', getCategory, async (req, res) => {
    try {
        await res.category.remove();
        res.json({ message: 'Deleted Category' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get category by ID
async function getCategory(req, res, next) {
    let category;
    try {
        category = await Category.findById(req.params.id);
        if (category == null) {
            return res.status(404).json({ message: 'Cannot find category' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.category = category;
    next();
}

module.exports = router;