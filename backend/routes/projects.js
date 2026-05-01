const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @desc    Create a project
// @route   POST /api/projects
router.post('/', async (req, res) => {
  const { projectId, name, department, totalBudget, description } = req.body;
  try {
    const newProject = new Project({
      projectId,
      name,
      department,
      totalBudget,
      description,
    });
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
