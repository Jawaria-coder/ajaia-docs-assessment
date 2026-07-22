# Ajaia Docs

A lightweight collaborative document editor built for the Ajaia AI-Native Full Stack Developer assessment.

## Live Demo

[Ajaia Docs Live Demo](https://ajaia-docs-assessment-weld.vercel.app/)

## Overview

Ajaia Docs allows demo users to create, edit, save, reopen, import, export, and share rich-text documents.

The project focuses on a clear collaborative workflow, persistent storage, server-side access control, maintainable architecture, responsive design, and polished user feedback.

## Features

### Document Management

- Create new documents
- Rename documents
- Save documents to MongoDB
- Reopen saved documents
- Delete documents owned by the active user
- Separate owned and shared documents on the dashboard
- Display the most recent saved time
- Warn users before leaving with unsaved changes

### Rich-Text Editing

The editor supports:

- Paragraphs
- Heading levels 1, 2, and 3
- Bold
- Italic
- Underline
- Bullet lists
- Numbered lists
- Undo
- Redo

### File Import

- Import `.txt` files
- Import `.md` files
- Maximum file size of 1 MB
- Preserve basic Markdown headings
- Preserve paragraphs
- Preserve bullet lists
- Preserve numbered lists
- Convert imported content into editable Tiptap JSON

### Sharing and Collaboration

- Share owned documents with another demo user
- Revoke a user’s access
- Allow shared users to open and edit documents
- Prevent unrelated users from accessing documents
- Restrict sharing and deletion to the document owner
- Show immediate success and error feedback for access changes

### Export

- Export the current document as Markdown
- Preserve supported headings, lists, and text formatting
- Generate a sanitized filename from the document title
- Download the export directly in the browser

### User Experience

- Responsive dashboard and editor
- Loading indicators
- Save status feedback
- Import success feedback
- Export success feedback
- Sharing success and error feedback
- Empty-state messages
- Confirmation before document deletion
- Unsaved-change navigation warning

## Demo Users

The application includes three seeded demo users:

- Aisha Khan
- Bilal Ahmed
- Sara Malik

Use the **Viewing as** selector to switch between users and test document ownership, editing, and sharing.

## Example Collaboration Flow

1. Select **Aisha Khan**.
2. Create and save a document.
3. Share the document with **Bilal Ahmed**.
4. Switch to Bilal using the user selector.
5. Open the document under **Shared with me**.
6. Edit and save the document.
7. Switch back to Aisha to view Bilal’s saved changes.
8. Revoke Bilal’s access from the sharing dialog.

## Technology Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Tiptap
- Lucide React

### Backend

- Next.js Route Handlers
- MongoDB Atlas
- MongoDB Node.js Driver
- Zod

### Testing and Deployment

- Vitest
- ESLint
- Vercel
- GitHub

## Project Structure

```text
app/
├── api/
│   ├── documents/
│   │   ├── [id]/
│   │   │   ├── share/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   └── route.ts
│   ├── health/
│   │   └── route.ts
│   ├── seed/
│   │   └── route.ts
│   └── users/
│       └── route.ts
├── documents/
│   └── [id]/
│       └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── dashboard/
│   ├── DashboardHeader.tsx
│   ├── DocumentCard.tsx
│   ├── DocumentSection.tsx
│   └── WorkspaceActions.tsx
├── editor/
│   ├── EditorHeader.tsx
│   └── EditorToolbar.tsx
├── DocumentEditor.tsx
├── NoticeBanner.tsx
└── ShareDialog.tsx

hooks/
├── useDashboard.ts
└── useDocumentEditor.ts

lib/
├── access-control.ts
├── demo-users.ts
├── document-schema.ts
├── export-markdown.ts
├── file-import.ts
├── mongodb.ts
├── request-user.ts
└── types.ts

tests/
└── access-control.test.ts
```

## Architecture

The application uses the Next.js App Router and is divided into four main layers.

### Presentation Layer

Reusable React components render the dashboard, editor header, toolbar, sharing dialog, notices, and document cards.

### Client Logic Layer

Custom hooks manage client-side state and actions:

- `useDashboard` handles users, documents, creation, imports, and dashboard feedback.
- `useDocumentEditor` handles document loading, editing, saving, deletion, sharing state, export, and unsaved-change protection.

### API Layer

Next.js Route Handlers expose endpoints for:

- Database health checks
- Demo-user seeding
- User retrieval
- Document creation and retrieval
- Document updates and deletion
- Sharing and access revocation

### Persistence Layer

MongoDB Atlas stores:

- Demo users
- Document titles
- Tiptap JSON content
- Owner IDs
- Shared-user IDs
- Creation timestamps
- Update timestamps

## Local Setup

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB Atlas cluster

### 1. Clone the repository

```bash
git clone https://github.com/Jawaria-coder/ajaia-docs-assessment.git
cd ajaia-docs-assessment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=ajaia_docs
```

Do not commit `.env.local` or expose the MongoDB connection string.

### 4. Configure MongoDB Atlas network access

MongoDB Atlas must allow connections from the environment running the application.

For local development, add the current device IP address to the Atlas IP Access List.

For a Vercel deployment using dynamic outbound addresses, the assessment deployment uses:

```text
0.0.0.0/0
```

This permits network access from anywhere, so the database credentials must remain private and use a strong password.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 6. Seed the demo users

Using PowerShell:

```powershell
Invoke-RestMethod -Method Post "http://localhost:3000/api/seed"
```

Using curl:

```bash
curl -X POST http://localhost:3000/api/seed
```

The seed endpoint can be called repeatedly without creating duplicate demo users.

## Available Scripts

Start the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Run automated tests:

```bash
npm test
```

Create an optimized production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm start
```

## API Routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Check MongoDB connectivity |
| `POST` | `/api/seed` | Seed the demo users |
| `GET` | `/api/users` | Retrieve available demo users |
| `GET` | `/api/documents` | Retrieve documents accessible to the selected user |
| `POST` | `/api/documents` | Create a new document |
| `GET` | `/api/documents/[id]` | Retrieve a specific accessible document |
| `PATCH` | `/api/documents/[id]` | Update an accessible document |
| `DELETE` | `/api/documents/[id]` | Delete a document owned by the active user |
| `POST` | `/api/documents/[id]/share` | Grant document access to another user |
| `DELETE` | `/api/documents/[id]/share` | Revoke a user’s document access |

## Access-Control Model

This assessment uses a lightweight demo-user identity model rather than full authentication.

The selected user ID is stored in browser local storage and sent to the backend using the `x-user-id` request header.

Authorization decisions are performed on the server:

- Owners can read their documents.
- Owners can edit their documents.
- Owners can share their documents.
- Owners can revoke access.
- Owners can delete their documents.
- Shared users can read shared documents.
- Shared users can edit shared documents.
- Unrelated users cannot retrieve or modify documents.
- Only owners can manage sharing or delete documents.

The header-based identity model is suitable for demonstrating the assessment workflow, but it is not intended to replace production authentication or secure user sessions.

## Document Storage

Documents are stored in MongoDB using structured Tiptap JSON.

Each document contains:

- Title
- Rich-text content
- Owner ID
- Shared-user IDs
- Creation timestamp
- Last-updated timestamp

Storing structured editor JSON allows supported formatting to remain intact when documents are saved and reopened.

## File Import

Supported formats:

- `.txt`
- `.md`

Maximum file size:

```text
1 MB
```

Markdown import converts basic content into editable Tiptap nodes, including:

- Headings
- Paragraphs
- Bullet lists
- Numbered lists

Unsupported or highly complex Markdown structures may be simplified during import.

## Export to Markdown

Export to Markdown was implemented as an optional enhancement.

The current Tiptap document is converted into Markdown in the browser. The application then creates a downloadable file using a sanitized version of the document title.

Supported exported formatting includes:

- Headings
- Paragraphs
- Bold
- Italic
- Underline using HTML tags
- Bullet lists
- Numbered lists
- Code formatting when present

## Automated Tests

The test suite currently contains six access-control tests covering:

- Recognition of the document owner
- Rejection of owner status for shared users
- Owner access
- Shared-user access
- Rejection of unrelated users
- MongoDB-style ID values with `toString` methods

Current result:

```text
Test Files  1 passed
Tests       6 passed
```

The final project also passes:

```text
npm run lint
npm test
npm run build
```

## Deployment

The application is deployed on Vercel:

[Ajaia Docs Live Demo](https://ajaia-docs-assessment-weld.vercel.app/)

The deployment uses MongoDB Atlas for persistent data storage.

Required Vercel environment variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=ajaia_docs
```

After changing environment variables in Vercel, a new deployment or redeployment is required.

MongoDB Atlas must also permit network access from the deployment environment.

## Current Limitations

- The demo-user selector is not production authentication.
- Collaboration is persistence-based rather than simultaneous real-time editing.
- There are no live cursors or presence indicators.
- There are no comments or mentions.
- There is no document version history.
- `.docx` import is not supported.
- Shared users receive edit access rather than separate viewer and editor roles.
- Simultaneous edits do not include conflict detection or resolution.
- The latest saved update can overwrite an earlier concurrent update.
- The production seed endpoint remains publicly callable for assessment convenience.

## Future Improvements

Given additional development time, the next priorities would be:

1. Add secure authentication and session management.
2. Add viewer, editor, and owner permission roles.
3. Add document version history and restoration.
4. Add real-time collaboration and presence indicators.
5. Add optimistic concurrency control or conflict resolution.
6. Add comments, mentions, and notifications.
7. Add `.docx` import and broader export support.
8. Restrict or remove the production seed endpoint.
9. Add end-to-end tests for document creation, editing, sharing, and imports.
10. Add database indexes and production security hardening.

## Assessment Status

### Implemented Requirements

- Document creation
- Document renaming
- Rich-text editing
- Manual saving
- Persistent MongoDB storage
- Reopening saved documents
- Text and Markdown file import
- Document sharing
- Access revocation
- Shared-user editing
- Server-side access control
- Success and error feedback
- Responsive interface
- Automated tests
- Production deployment

### Optional Enhancement

- Export to Markdown