const express = require('express');
const router = express.Router();
const { Specification } = require('../models/Specification');
const aiService = require('../services/aiService');
const { validateSpecification, validateTaskUpdate } = require('../middleware/validation');

// Generate new specification with AI
router.post('/generate', validateSpecification, async (req, res) => {
  try {
    const { featureName, goal, targetUsers, constraints, template } = req.body;

    // Generate tasks using AI
    const generatedTasks = await aiService.generateTasks({
      featureName,
      goal,
      targetUsers,
      constraints,
      template: template || 'custom'
    });

    // Create specification document
    const specification = new Specification({
      featureName,
      goal,
      targetUsers,
      constraints,
      template: template || 'custom',
      userStories: generatedTasks.userStories || [],
      engineeringTasks: generatedTasks.engineeringTasks || [],
      risks: generatedTasks.risks || [],
      unknowns: generatedTasks.unknowns || []
    });

    await specification.save();

    res.status(201).json({
      success: true,
      data: specification
    });
  } catch (error) {
    console.error('Generate specification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate specification'
    });
  }
});

// Get recent specifications (last 5)
router.get('/recent', async (req, res) => {
  try {
    const specifications = await Specification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('featureName goal createdAt template');

    res.json({
      success: true,
      data: specifications
    });
  } catch (error) {
    console.error('Get recent specifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch specifications'
    });
  }
});

// Get single specification by ID
router.get('/:id', async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);

    if (!specification) {
      return res.status(404).json({
        success: false,
        error: 'Specification not found'
      });
    }

    res.json({
      success: true,
      data: specification
    });
  } catch (error) {
    console.error('Get specification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch specification'
    });
  }
});

// Update specification
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    const specification = await Specification.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!specification) {
      return res.status(404).json({
        success: false,
        error: 'Specification not found'
      });
    }

    res.json({
      success: true,
      data: specification
    });
  } catch (error) {
    console.error('Update specification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update specification'
    });
  }
});

// Update tasks order
router.put('/:id/tasks/reorder', validateTaskUpdate, async (req, res) => {
  try {
    const { tasks, type } = req.body;

    const specification = await Specification.findById(req.params.id);

    if (!specification) {
      return res.status(404).json({
        success: false,
        error: 'Specification not found'
      });
    }

    // Update the appropriate task array
    if (type === 'user-story') {
      specification.userStories = tasks;
    } else if (type === 'engineering-task') {
      specification.engineeringTasks = tasks;
    }

    specification.updatedAt = Date.now();
    await specification.save();

    res.json({
      success: true,
      data: specification
    });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder tasks'
    });
  }
});

// Delete specification
router.delete('/:id', async (req, res) => {
  try {
    const specification = await Specification.findByIdAndDelete(req.params.id);

    if (!specification) {
      return res.status(404).json({
        success: false,
        error: 'Specification not found'
      });
    }

    res.json({
      success: true,
      message: 'Specification deleted successfully'
    });
  } catch (error) {
    console.error('Delete specification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete specification'
    });
  }
});

// Export specification as markdown
router.get('/:id/export', async (req, res) => {
  try {
    const specification = await Specification.findById(req.params.id);

    if (!specification) {
      return res.status(404).json({
        success: false,
        error: 'Specification not found'
      });
    }

    const markdown = generateMarkdown(specification);

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${specification.featureName.replace(/[^a-z0-9]/gi, '_')}.md"`);
    res.send(markdown);
  } catch (error) {
    console.error('Export specification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export specification'
    });
  }
});

// Helper function to generate markdown
function generateMarkdown(spec) {
  let md = `# ${spec.featureName}\n\n`;
  md += `**Created:** ${spec.createdAt.toLocaleDateString()}\n\n`;
  md += `## Overview\n\n`;
  md += `**Goal:** ${spec.goal}\n\n`;
  md += `**Target Users:** ${spec.targetUsers}\n\n`;
  
  if (spec.constraints) {
    md += `**Constraints:** ${spec.constraints}\n\n`;
  }

  if (spec.template && spec.template !== 'custom') {
    md += `**Template:** ${spec.template}\n\n`;
  }

  if (spec.userStories && spec.userStories.length > 0) {
    md += `## User Stories\n\n`;
    spec.userStories.forEach((story, index) => {
      md += `### ${index + 1}. ${story.title}\n`;
      md += `${story.description}\n`;
      md += `- **Priority:** ${story.priority}\n`;
      if (story.estimatedHours) {
        md += `- **Estimated Hours:** ${story.estimatedHours}\n`;
      }
      md += `\n`;
    });
  }

  if (spec.engineeringTasks && spec.engineeringTasks.length > 0) {
    md += `## Engineering Tasks\n\n`;
    spec.engineeringTasks.forEach((task, index) => {
      md += `### ${index + 1}. ${task.title}\n`;
      md += `${task.description}\n`;
      md += `- **Priority:** ${task.priority}\n`;
      if (task.estimatedHours) {
        md += `- **Estimated Hours:** ${task.estimatedHours}\n`;
      }
      md += `\n`;
    });
  }

  if (spec.risks && spec.risks.length > 0) {
    md += `## Risks\n\n`;
    spec.risks.forEach((risk, index) => {
      md += `${index + 1}. **[${risk.severity.toUpperCase()}]** ${risk.description}\n`;
    });
    md += `\n`;
  }

  if (spec.unknowns && spec.unknowns.length > 0) {
    md += `## Unknowns / Questions\n\n`;
    spec.unknowns.forEach((unknown, index) => {
      md += `${index + 1}. ${unknown.description}\n`;
    });
    md += `\n`;
  }

  return md;
}

module.exports = router;