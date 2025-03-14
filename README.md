# Welcome to Reach: A Networking Platform for Researchers  

**Reach** is a platform that helps researchers connect, collaborate, and share insights in their field.  

---

# Project Structure  

```plaintext
├── frontend/    # Contains React-based frontend
├── backend/     # Node.js backend with Express
├── db/          # PostgreSQL database schema and migration files (currently empty)
├── docker-compose.yml  # Docker configuration
```

# Getting Started  

## Prerequisites  
Before running the application, ensure you have the following installed:  
- [Docker](https://docs.docker.com/get-docker/)  
- [Docker Compose](https://docs.docker.com/compose/install/)  

## Installation & Running the Project  

### Clone the repository:  
```bash
git clone [https://github.com/CMU-17-356/17-356-team-time.git](https://github.com/CMU-17-356/17-356-team-time.git)
```

### Build the Docker containers:
```bash
docker-compose build
```

### Start the application:
```bash
docker-compose up
```
This will launch both the frontend and the backend

### Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

*For troubleshooting, check the logs using:*
```bash
docker-compose logs -f
```


## Code Review Guidelines

### High Level Guidelines


#### 1. Purpose & Context  
- Does the PR align with the project's goals?  
- Are there alternative, simpler solutions that should be considered?  
- Does the PR introduce unnecessary complexity?  

📌 *Before reviewing, read the PR description, related issues, and design discussions.*



#### 2. Code Architecture & Design  
- Does the code follow existing patterns and conventions?  
- Is there proper separation of Model, View, Controller?  
- Does the code introduce unnecessary dependencies?  
- Are modules, classes, and functions reusable? 

📌 *Favor modular, loosely coupled designs that improve maintainability.* 



#### 3. Maintainability & Readability  
- Is the code easy to read/modify?
- Is there unnecessary complexity that could be simplified?  
- Does the code have meaningful comments and documentation?  

📌 *Clarity is key*  



#### 4. Scalability & Performance  
- Can this code handle increased load in the future?  
- Are costly operations justified?

📌 *Consider the cost of technical debt quick fixes can slow down future development.*  


#### 5. Security & Compliance  
- Does the code handle user input safely?  
- Are authentication and authorization handled?  
- Are dependencies up to date?  

📌 *Review security with "worst-case scenario" in mind*



#### 6. Test Coverage & Reliability  
- Are unit tests, integration tests, and edge cases covered when relevant?  
- Are test cases meaningful?  

📌 *Well tested code prevents future failure*  



#### 7. Documentation & Communication  
- Does the PR clearly explain what it does and why?  
- Are future developers likely to struggle understanding this code?  

📌 *A well-written PR provides crucial documentation for future development*



### Low Level Checklist for Code Structure and Readability
- [ ] Functions/methods/classes are named clearly and descriptively
- [ ] No dead code
- [ ] No outdated/unnecessary comments
- [ ] No magic numbers or hardcoded values that should be replaced with constants
- [ ] No excessive nesting that could be simplified
- [ ] Proper edge case handling
- [ ] No potential SQL injection risks
- [ ] Retries or fallbacks implemented where necessary
- [ ] Unit/integration tests cover the new changes


