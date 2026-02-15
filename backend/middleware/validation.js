const validateSpecification = (req, res, next) => {
  const { featureName, goal, targetUsers } = req.body;

  const errors = [];

  if (!featureName || featureName.trim().length === 0) {
    errors.push('Feature name is required');
  } else if (featureName.length > 200) {
    errors.push('Feature name must be less than 200 characters');
  }

  if (!goal || goal.trim().length === 0) {
    errors.push('Goal is required');
  } else if (goal.length > 1000) {
    errors.push('Goal must be less than 1000 characters');
  }

  if (!targetUsers || targetUsers.trim().length === 0) {
    errors.push('Target users is required');
  } else if (targetUsers.length > 500) {
    errors.push('Target users must be less than 500 characters');
  }

  if (req.body.constraints && req.body.constraints.length > 1000) {
    errors.push('Constraints must be less than 1000 characters');
  }

  if (req.body.template && !['mobile', 'web', 'internal-tool', 'custom'].includes(req.body.template)) {
    errors.push('Invalid template type');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

const validateTaskUpdate = (req, res, next) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks)) {
    return res.status(400).json({
      success: false,
      error: 'Tasks must be an array'
    });
  }

  const errors = [];

  tasks.forEach((task, index) => {
    if (!task.title || task.title.trim().length === 0) {
      errors.push(`Task ${index + 1}: Title is required`);
    }
    if (!task.description || task.description.trim().length === 0) {
      errors.push(`Task ${index + 1}: Description is required`);
    }
    if (task.type && !['user-story', 'engineering-task', 'risk', 'unknown'].includes(task.type)) {
      errors.push(`Task ${index + 1}: Invalid type`);
    }
    if (task.priority && !['high', 'medium', 'low'].includes(task.priority)) {
      errors.push(`Task ${index + 1}: Invalid priority`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

module.exports = {
  validateSpecification,
  validateTaskUpdate
};