const express = require('express');
const router = express.Router();
const TeamMember = require('../models/models').TeamMember;

// Create a new team member
router.post('/team-members', async (req, res) => {
    try {
        const teamMember = new TeamMember(req.body);
        await teamMember.save();
        res.status(201).send(teamMember);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all team members
router.get('/team-members', async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({});
        res.send(teamMembers);
    } catch (error) {
        res.status(500).send();
    }
});

// Update a team member
router.patch('/team-members/:id', async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!teamMember) {
            return res.status(404).send();
        }
        res.send(teamMember);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a team member
router.delete('/team-members/:id', async (req, res) => {
    try {
        const teamMember = await TeamMember.findByIdAndDelete(req.params.id);
        if (!teamMember) {
            return res.status(404).send();
        }
        res.send(teamMember);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
