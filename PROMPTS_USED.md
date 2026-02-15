# Prompts Used During Development

A concise record of key prompts used with Claude (Anthropic) to develop this application.



## 1. Initial Project Setup

```
Build a web app where I can:
- Fill a form about a feature idea (goal, users, constraints)
- Generate user stories and engineering tasks with AI
- Edit, reorder, and group tasks (drag-and-drop)
- Export as markdown or copy to clipboard
- View last 5 generated specs

Stack: React, Node.js, Express, MongoDB, Tailwind CSS
Include: Home page, Create form, Status page, README
```

---

## 2. Backend Development

**Express Server:**
```
Create Express server with CORS, Helmet, rate limiting, error handling, and health check endpoint.
```

**Database Schema:**
```
Design MongoDB schema for specifications with user stories, engineering tasks, risks, unknowns. Include timestamps and indexes.
```

**AI Service:**
```
Create service to integrate with Groq API (Llama 3.3 70B). Accept feature description, generate JSON with user stories, tasks, risks, unknowns. Include templates for mobile/web/internal-tool.
```

**API Routes:**
```
Create REST endpoints: POST /generate, GET /recent, GET /:id, PUT /:id, PUT /:id/tasks/reorder, DELETE /:id, GET /:id/export
```

**Validation:**
```
Add validation middleware for required fields, length limits, and proper error messages.
```

---

## 3. Frontend Development

**React Structure:**
```
Create React app with: Home (hero + recent specs), CreateSpec (form with template selection), SpecView (task management with drag-and-drop), Status (health monitoring), Navbar.
```

**Drag-and-Drop:**
```
Implement react-dnd for task reordering. Show drag handle, visual feedback, save to backend on drop.
```

**Forms & Validation:**
```
Create form with client-side validation, loading states, error messages, template selection buttons.
```

**Export Features:**
```
Add markdown export (download) and copy to clipboard with success feedback.
```

**Styling:**
```
Set up Tailwind with custom colors (blue/indigo), animations (fade-in, slide-up), card/button utilities, gradient backgrounds.
```

---

## 4. AI Provider Issues & Solutions

**Problem 1 - Anthropic:**
```
Anthropic requires paid credits. Switch to free alternative.
```

**Problem 2 - Gemini:**
```
Getting 404: "models/gemini-1.5-flash not found". Try different endpoint/model.
```

**Solution - Groq:**
```
Switch to Groq API (free, fast, reliable). Use llama-3.3-70b-versatile model with OpenAI-compatible format and JSON mode.
```

**Model Update:**
```
Error: "llama-3.1-70b-versatile decommissioned". Update to llama-3.3-70b-versatile.
```

---

## 5. Testing & Debugging

```
Create health check test that calls /api/health and verifies response structure.
```

```
Add error handling: try-catch blocks, user-friendly messages, timeout handling, edge case validation.
```

---

## 6. Documentation

```
Write README with: setup instructions, features (done/not done), API endpoints, troubleshooting.
```

```
Create AI_NOTES.md explaining: what AI generated, what was manually verified, why Groq was chosen, comparison with alternatives.
```

```
Create ABOUTME.md template with: personal info, skills, experience, projects, contact.
```

```
Create PROMPTS_USED.md logging development prompts (no responses or keys).
```

---

## 7. Key Refinements

**UI Polish:**
```
Improve spacing, animations, color contrast, mobile responsiveness, loading indicators.
```

**Performance:**
```
Optimize React re-renders (useMemo, useCallback), add MongoDB indexes, improve API response times.
```

**Security:**
```
Review: API key handling, CORS config, input validation, rate limiting, error messages.
```

---

## Summary

**Total Major Prompts:** ~25-30  
**Most Complex:** Initial project setup (full stack architecture)  
**Most Iterative:** AI provider selection (tried Anthropic → Gemini → Groq)  
**Most Critical:** Groq integration (solved all API issues)

**Approach:**
- Started with specific requirements
- Iterated based on errors
- Manually tested all features
- Refined based on real usage

---

*AI (Claude) accelerated development by ~60%, but all code was manually reviewed and tested.*