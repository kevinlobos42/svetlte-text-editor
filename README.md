# Collaborative Text Editor

This is a real-time collaborative text editor that allows multiple users to create, edit, and share documents. The app features autosave functionality, collaboration through a shared editor, and a chat for each document. Users can create and manage documents, invite others by email, and secure access using GitHub authentication.

---

## Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously.
- **Autosave**: Changes are automatically saved as users type, ensuring no work is lost.
- **Chat for Each Document**: A chat feature is available for every document, allowing collaborators to communicate directly within the document.
- **Document Creation**: Users can create new documents from the home page.
- **User Authentication**: Users authenticate securely via GitHub.
- **File Sharing**: Users can invite others to collaborate on their documents by adding their email. Only invited users can access the document.
- **File Access Control**: Users who are not explicitly added by the document owner cannot view or edit the document.

---

## Tech Stack

- **Frontend**: [SvelteKit](https://kit.svelte.dev/)
- **Backend**: [Go](https://golang.org/)
- **Database**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (GitHub OAuth)
- **Real-time Sync**: Firestore for real-time document collaboration and chat
- **Hosting**: [Firebase Hosting](https://firebase.google.com/docs/hosting)

---

## Getting Started

### Prerequisites

To run this project locally, you will need the following:

- Node.js v16 or higher
- Firebase Project
- GitHub OAuth App for Authentication

---

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash 
   npm install
   ```

3. Set up your Firebase project and Firestore:
   - Create a Firebase project at Firebase Console.
   - Enable Firestore and Firebase Authentication (with GitHub as a provider).

4. Create a ```.env``` file in the root of the project and add your Firebase configuration:
   ```bash
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Run the Development server:
   ```bash
    npm run dev
    ```

6. Open your browser and navigate to ```http://localhost:3000```.

---

## Usage

### Creating a New Document

- On the home page, click "Create Document" to start a new file.
- The new document will open in the text editor.

### Collaborating on a Document

- As the document owner, you can add collaborators by their email. Only users added to the document can access and edit it.
- All changes are reflected in real-time for all collaborators.

### Using the Chat Feature

- Each document has an integrated chat where users can communicate during collaboration. Messages are saved in real-time, just like the document.

### Autosave

- Documents will autosave when changes are made

### Downloading Documents

- Users can download their documents in the following formats:
  - PDF
  - PNG
  - Docx


---

## Authentication

- Users must log in with their GitHub account to access the app.
- After logging in, users can view only the documents they have created or have been given access to by other users.
