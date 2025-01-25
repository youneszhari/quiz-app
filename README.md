# Quiz Creator App

The **Quiz Creator App** is a React-based application designed to help users create and manage quizzes. It allows users to define quiz details, add questions, and specify answers with validation to ensure data integrity. The app is built with a modern UI and includes features like randomizing questions and answers, setting time limits, and managing multiple-choice or true/false questions.

---

## Features

- **Quiz Creation**:
  - Add a title, description, and time limit for the quiz.
  - Randomize questions and answers with toggle switches.
- **Question Management**:
  - Add multiple-choice or true/false questions.
  - Provide explanations and optional images for questions.
  - Validate questions to ensure they meet requirements (e.g., at least 2 answers, one correct answer).
- **Answer Management**:
  - Add up to 5 answers per question.
  - Mark one answer as correct.
  - Validate answers to ensure they are not empty.
- **Responsive Design**:
  - Works seamlessly on both desktop and mobile devices.
- **Dark Mode Support**:
  - Includes a dark mode for better user experience in low-light environments.

---

## Installation

Follow these steps to set up and run the Quiz Creator App on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) (for package management)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/quiz-creator-app.git
   cd quiz-creator-app
  ```

2. Install Dependencies:

```bash 
npm install
```
or

``` bash
yarn install
```

3. Run the Development Server:
```bash
npm run dev
```

or

``` bash
yarn dev
```
