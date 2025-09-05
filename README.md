# N.AI Chatbot

Chatbot dengan AI yang responnya mirip cewe gen z.

## Features

-   **Sleek Interface**: A modern and responsive chat interface.
-   **Session Management**: Conversations are saved in your browser, allowing you to switch between multiple chats.
-   **Themeable**: Light and Dark modes available.
-   **Highly Customizable**: Easily change the AI's name, API endpoints, and models through a single configuration file.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd chatbot-vue
    ```
3.  Install NPM packages:
    ```sh
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

## Customization

All customizations can be done in the `src/config.js` file. This allows you to easily rebrand the chatbot and configure its behavior without touching the source code.

File: `src/config.js`

```javascript
export default {
  aiName: 'Nekorites AI',
  shortAiName: 'n.ai',
  copyright: '© 2025 Nekorites',
  alertAIText: 'Harap dicatat bahwa respons AI mungkin tidak selalu akurat.',
  models: [
    {
      id: 'default',
      name: 'Default',
      endpoint: 'https://backend-serv-774.fainshe.tech/api/v2/chat',
      model: 'default',
    },
    {
      id: 'yandere',
      name: 'Yandere',
      endpoint: 'https://backend-serv-774.fainshe.tech/api/v2/Yachat',
      model: 'yandere-model',
    },
    // Tambahkan model lain di sini
  ],
};
```

### Configuration Options

-   `aiName`: The full name of your AI. Displayed in the header and welcome message.
-   `shortAiName`: A shorter name for the AI. Displayed in the header on smaller screens or when the title shrinks.
-   `copyright`: A copyright notice. (Currently not implemented in the UI, but available for use).
-   `alertAIText`: A disclaimer text shown below the chat input area.
-   `models`: An array of objects, where each object represents a different AI model the user can choose from.

### How to Add a New Model

To add a new model to the dropdown selector, simply add a new object to the `models` array in `src/config.js`.

1.  **`id`**: A unique identifier for the model (e.g., `'creative'`).
2.  **`name`**: The display name for the model in the UI (e.g., `'Creative Mode'`).
3.  **`endpoint`**: The full API endpoint URL that the chatbot will send requests to for this model.
4.  **`model`**: The model name/identifier to be sent to the backend (if your API requires it).

**Example:**

```javascript
// ...
  models: [
    {
      id: 'default',
      name: 'Default',
      endpoint: 'https://api.example.com/chat',
      model: 'gpt-3.5-turbo',
    },
    {
      id: 'yandere',
      name: 'Yandere',
      endpoint: 'https://api.example.com/yandere',
      model: 'yandere-v2',
    },
    // New model added below
    {
      id: 'translator',
      name: 'Translator Bot',
      endpoint: 'https://api.example.com/translate',
      model: 'translation-model-xl',
    },
  ],
// ...
```

## Building for Production

To create a production build, run:

```sh
npm run build
```

The optimized files will be located in the `dist` directory. You can preview the production build locally with `npm run preview`.