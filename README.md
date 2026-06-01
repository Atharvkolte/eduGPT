# eduGPT

eduGPT is an educational AI assistant that leverages Large Language Models (LLMs) and Image Retrieval-Augmented Generation (RAG) to provide interactive learning experiences. This project aims to empower users with an intuitive chat interface while allowing rich contextual understanding through images and text.

## Features
- **Conversational Chat:** A smart interactive GPT interface for answering educational queries.
- **Image RAG:** Enhance learning through contextually aware image retrieval and generation.
- **Modern Frontend:** Built with React, Vite, and TypeScript for a fast and responsive UI.
- **Robust Backend:** Powered by Python for handling complex LLM interactions securely and efficiently.

## Prerequisites

Before setting up the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (for the frontend)
- [Python 3.8+](https://www.python.org/) (for the backend)
- [Git](https://git-scm.com/)

## Guided Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Atharvkolte/eduGPT.git
cd eduGPT
```

### 2. Set up the Backend
Navigate to the `backend` directory, install the required dependencies, and configure your environment variables.

For the Chat module:
```bash
cd backend/chat
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Mac/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

> **Note:** Make sure to create a `.env` file in the backend directories and add your API keys (e.g., `OPENAI_API_KEY`) based on the `.env.example` structure if provided.

For the Image RAG module:
```bash
cd ../img_rag
# Install corresponding requirements based on the module setup
```

### 3. Set up the Frontend
Open a new terminal window, navigate to the `frontend` directory, and install its dependencies.
```bash
cd frontend
npm install
```

### 4. Run the Application
Start the frontend development server:
```bash
npm run dev
```

Start the backend server(s):
```bash
# In the backend terminal
python main.py  # or the relevant start command for the chat modules
python app.py   # or the relevant start command for the img modules
```

## Why this project was made?
eduGPT was created to explore the intersection of education and modern generative AI. By combining both text-based communication and image context (RAG), the goal is to create a dynamic tool that adapts to different learning styles, helping users find answers efficiently and intuitively. This hands-on project serves to experiment with advanced conversational agents and create an accessible studying assistant.

## License
MIT
