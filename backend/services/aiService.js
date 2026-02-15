const axios = require('axios');

class AIService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    // Updated to current active model
    this.model = 'llama-3.3-70b-versatile';
  }

  async generateTasks(featureData) {
    const { featureName, goal, targetUsers, constraints, template } = featureData;

    const templateContext = this.getTemplateContext(template);
    
    const systemPrompt = `You are a product manager and technical architect. Generate a JSON response with user stories, engineering tasks, risks, and unknowns. Always return valid JSON only.`;
    
    const userPrompt = `Break down this feature into tasks:

Feature: ${featureName}
Goal: ${goal}
Target Users: ${targetUsers}
Constraints: ${constraints || 'None specified'}
${templateContext}

Generate:
1. 3-5 User Stories (As a [user], I want [goal] so that [benefit])
2. 8-12 Engineering Tasks (specific, actionable)
3. 2-4 Risks
4. 2-4 Unknowns

Return ONLY this JSON structure:
{
  "userStories": [
    {
      "title": "Story title",
      "description": "As a [user], I want [goal] so that [benefit]",
      "priority": "high",
      "estimatedHours": 8
    }
  ],
  "engineeringTasks": [
    {
      "title": "Task title",
      "description": "Detailed description",
      "priority": "high",
      "estimatedHours": 6
    }
  ],
  "risks": [
    {
      "description": "Risk description",
      "severity": "high"
    }
  ],
  "unknowns": [
    {
      "description": "Question needing answer"
    }
  ]
}`;

    try {
      console.log('Calling Groq API with model:', this.model);
      
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      console.log('Got response from Groq');

      const content = response.data.choices[0].message.content;
      
      // Parse JSON response
      const tasks = JSON.parse(content);
      
      // Validate and add required fields
      if (!tasks.userStories) tasks.userStories = [];
      if (!tasks.engineeringTasks) tasks.engineeringTasks = [];
      if (!tasks.risks) tasks.risks = [];
      if (!tasks.unknowns) tasks.unknowns = [];
      
      // Add order and type properties
      tasks.userStories = tasks.userStories.map((story, index) => ({
        title: story.title || 'User Story',
        description: story.description || '',
        priority: story.priority || 'medium',
        estimatedHours: story.estimatedHours || 4,
        order: index,
        type: 'user-story'
      }));
      
      tasks.engineeringTasks = tasks.engineeringTasks.map((task, index) => ({
        title: task.title || 'Engineering Task',
        description: task.description || '',
        priority: task.priority || 'medium',
        estimatedHours: task.estimatedHours || 4,
        order: index,
        type: 'engineering-task'
      }));

      // Ensure risks and unknowns have proper structure
      tasks.risks = tasks.risks.map(risk => ({
        description: risk.description || risk,
        severity: risk.severity || 'medium'
      }));

      tasks.unknowns = tasks.unknowns.map(unknown => ({
        description: unknown.description || unknown
      }));

      console.log('Successfully parsed tasks');
      console.log('User Stories:', tasks.userStories.length);
      console.log('Engineering Tasks:', tasks.engineeringTasks.length);
      
      return tasks;
    } catch (error) {
      console.error('AI Service Error:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('API Response:', JSON.stringify(error.response.data, null, 2));
      }
      throw new Error(`Failed to generate tasks: ${error.message}`);
    }
  }

  getTemplateContext(template) {
    const contexts = {
      'mobile': 'This is a MOBILE APPLICATION. Consider: screen sizes, touch interactions, offline mode, app store requirements.',
      'web': 'This is a WEB APPLICATION. Consider: browser compatibility, responsive design, SEO, web performance.',
      'internal-tool': 'This is an INTERNAL TOOL. Focus on functionality over polish. Consider integration with existing systems.',
      'custom': ''
    };
    return contexts[template] || '';
  }

  async checkConnection() {
    try {
      console.log('Testing Groq API connection with model:', this.model);
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: 'Say hello'
            }
          ],
          max_tokens: 10
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 5000
        }
      );
      console.log('Groq API connection successful with', this.model);
      return true;
    } catch (error) {
      console.error('Groq API connection failed:', error.message);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
      return false;
    }
  }
}

module.exports = new AIService();