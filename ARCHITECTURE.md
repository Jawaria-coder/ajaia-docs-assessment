# Ajaia Docs Architecture

## 1. System Overview

Ajaia Docs is a lightweight collaborative document editor built with Next.js, TypeScript, Tiptap, and MongoDB Atlas.

The application supports:

- Creating documents
- Editing rich-text content
- Saving and reopening documents
- Importing `.txt` and `.md` files
- Exporting documents as Markdown
- Sharing documents with other demo users
- Revoking access
- Editing shared documents
- Server-side access checks

The project uses a full-stack Next.js architecture where the frontend, API routes, and server-side database access are contained within one repository.

## 2. High-Level Architecture

```text
Browser
   |
   | HTTP requests
   v
Next.js Application
   |
   |-- React UI Components
   |-- Client Hooks
   |-- Next.js Route Handlers
   |
   v
MongoDB Atlas
```

The application is divided into four primary layers:

1. Presentation layer
2. Client logic layer
3. API and authorization layer
4. Persistence layer

## 3. Presentation Layer

The presentation layer is implemented using reusable React components.

```text
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
```

### Dashboard Components

#### `DashboardHeader`

Responsible for:

- Application branding
- Demo-user selection
- Displaying the active user

#### `WorkspaceActions`

Responsible for:

- Creating a new document
- Selecting a file for import
- Showing supported import formats
- Displaying loading states for creation and import

#### `DocumentSection`

Responsible for:

- Rendering owned or shared document groups
- Displaying document counts
- Displaying empty states

#### `DocumentCard`

Responsible for:

- Displaying document title
- Displaying the last update time
- Showing ownership or shared-access status
- Opening the selected document

### Editor Components

#### `EditorHeader`

Responsible for:

- Editable document title
- Save state
- Saved timestamp
- Export button
- Share button
- Delete button
- Back navigation

#### `EditorToolbar`

Responsible for Tiptap formatting actions:

- Paragraph
- Heading levels 1–3
- Bold
- Italic
- Underline
- Bullet lists
- Numbered lists
- Undo
- Redo

#### `DocumentEditor`

Acts as the editor page container.

It connects the editor hook to:

- `EditorHeader`
- `EditorToolbar`
- `EditorContent`
- `ShareDialog`
- `NoticeBanner`

It intentionally contains minimal application logic.

## 4. Client Logic Layer

Client-side state and behavior are separated into custom hooks.

```text
hooks/
├── useDashboard.ts
└── useDocumentEditor.ts
```

### `useDashboard`

The dashboard hook manages:

- Loading demo users
- Restoring the selected user from local storage
- Loading accessible documents
- Separating owned and shared documents
- Creating documents
- Importing files
- Dashboard loading states
- Success and error notices
- Navigation to the editor

Keeping this logic in a hook allows `app/page.tsx` to remain primarily responsible for rendering.

### `useDocumentEditor`

The editor hook manages:

- Tiptap initialization
- Loading a document
- Updating the title
- Tracking unsaved changes
- Saving document content
- Deleting documents
- Exporting Markdown
- Opening and closing the sharing dialog
- Updating shared-user state
- Save timestamps
- Navigation protection for unsaved changes
- Success and error notices

This separates editor behavior from the page layout.

## 5. Routing

The application uses the Next.js App Router.

### Client Routes

```text
/                 Dashboard
/documents/[id]   Document editor
```

### API Routes

```text
GET    /api/health
POST   /api/seed
GET    /api/users

GET    /api/documents
POST   /api/documents

GET    /api/documents/[id]
PATCH  /api/documents/[id]
DELETE /api/documents/[id]

POST   /api/documents/[id]/share
DELETE /api/documents/[id]/share
```

## 6. API Layer

The backend is implemented using Next.js Route Handlers.

The Route Handlers perform:

- Request validation
- User resolution
- Document authorization
- MongoDB operations
- Response serialization
- Error handling

The frontend does not connect directly to MongoDB.

All database access occurs on the server.

## 7. Demo Identity Model

The assessment uses three seeded demo users rather than full authentication.

The selected user ID is:

1. Stored in browser local storage
2. Added to API requests using the `x-user-id` header
3. Resolved by the server
4. Used for document authorization

Example request:

```http
GET /api/documents
x-user-id: USER_ID
```

This identity model was chosen to keep the assessment focused on document workflows and collaboration rather than login implementation.

### Trust Boundary

The `x-user-id` header is not secure production authentication.

A user could manually modify the request header.

For this reason, it is treated as an intentional assessment limitation rather than a production security mechanism.

A production version should replace it with:

- Secure authentication
- Server-managed sessions
- Signed cookies or tokens
- Authorization based on the authenticated session

## 8. Authorization Model

Authorization is checked in the API layer.

### Owner Permissions

The document owner can:

- Read the document
- Edit the document
- Rename the document
- Share the document
- Revoke access
- Delete the document

### Shared-User Permissions

A shared user can:

- Read the document
- Edit the document
- Save document changes

A shared user cannot:

- Delete the document
- Share the document
- Revoke another user’s access

### Unrelated Users

A user who is neither the owner nor included in `sharedWith` cannot access the document.

The UI hides restricted actions, but the backend independently enforces the same rules.

This prevents authorization from relying only on client-side controls.

## 9. Persistence Layer

MongoDB Atlas is used for persistent storage.

The application uses two collections:

```text
users
documents
```

### User Document

A user contains:

```ts
{
  _id: ObjectId;
  name: string;
  email: string;
}
```

### Document Record

A document contains:

```ts
{
  _id: ObjectId;
  title: string;
  content: TiptapDocument;
  ownerId: ObjectId;
  sharedWith: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 10. Document Content Format

Rich-text content is stored as Tiptap JSON rather than HTML or plain text.

Example:

```json
{
  "type": "doc",
  "content": [
    {
      "type": "heading",
      "attrs": {
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "Example heading"
        }
      ]
    }
  ]
}
```

### Why Tiptap JSON Was Chosen

Tiptap JSON:

- Preserves document structure
- Preserves text formatting
- Can be loaded directly back into the editor
- Avoids storing editor-specific HTML
- Makes import and export transformations possible
- Provides a structured format for future features

## 11. Sharing Data Model

Shared-user IDs are stored directly inside each document:

```ts
sharedWith: ObjectId[];
```

This embedded model was chosen because:

- The number of demo users is small
- Sharing queries are simple
- Access checks remain straightforward
- A separate permissions collection would add unnecessary complexity

For a larger production system, a dedicated permissions collection may be more suitable, particularly if documents support:

- Large sharing lists
- Teams
- Organizations
- Viewer and editor roles
- Expiring access
- Audit history

## 12. File Import

File import is performed in the browser.

Supported formats:

- `.txt`
- `.md`

Maximum file size:

```text
1 MB
```

### Import Flow

```text
User selects a file
        |
        v
Client validates extension and size
        |
        v
Browser reads file text
        |
        v
Text or Markdown is converted to Tiptap JSON
        |
        v
Document is created through the API
        |
        v
User is redirected to the editor
```

Plain text is converted into paragraph nodes.

Markdown supports basic conversion for:

- Headings
- Paragraphs
- Bullet lists
- Numbered lists

Complex Markdown structures may be simplified.

## 13. Markdown Export

Markdown export is implemented as a client-side optional enhancement.

### Export Flow

```text
Tiptap editor JSON
        |
        v
JSON-to-Markdown conversion
        |
        v
Browser Blob creation
        |
        v
Temporary object URL
        |
        v
Markdown file download
```

The export does not require a backend request.

The filename is created from the document title and sanitized to remove invalid filename characters.

Underline formatting is exported using HTML `<u>` tags because standard Markdown does not define underline syntax.

## 14. Validation and Error Handling

Zod is used to validate API request bodies.

Validation includes:

- Document title
- Document content
- Sharing target user
- Request payload structure

The application provides feedback for:

- Failed document loading
- Failed document creation
- Failed saving
- Invalid imported files
- Oversized imported files
- Failed sharing
- Failed access revocation
- Failed deletion
- Successful saves
- Successful imports
- Successful exports
- Successful access changes

## 15. Save and Unsaved-Change Handling

The editor tracks whether the document has changed since its last successful save.

Possible states include:

```text
Saved
Unsaved changes
Saving...
```

After saving, the interface displays the most recent save time.

The browser also warns the user when they attempt to leave or refresh while unsaved changes exist.

This reduces accidental data loss, although the application currently uses manual saving rather than automatic saving.

## 16. Testing Strategy

Vitest is used for automated testing.

The current automated tests focus on access-control behavior because authorization is one of the most important server-side rules in the project.

The tests verify:

- Owner recognition
- Shared users are not treated as owners
- Owner access
- Shared-user access
- Unrelated-user rejection
- MongoDB-style ID handling

Final verification commands:

```bash
npm run lint
npm test
npm run build
```

All three commands pass in the final implementation.

## 17. Deployment Architecture

The application is deployed on Vercel.

```text
GitHub Repository
        |
        v
Vercel Build
        |
        v
Next.js Application
        |
        v
MongoDB Atlas
```

Vercel environment variables:

```env
MONGODB_URI=MongoDB Atlas connection string
MONGODB_DB=ajaia_docs
```

MongoDB Atlas network access must allow the deployment environment to connect.

## 18. Deliberate Scope Decisions

The following features were deliberately not implemented during the assessment:

- Full authentication
- Real-time simultaneous editing
- Live cursor presence
- Comments
- Mentions
- Version history
- `.docx` import
- Granular viewer/editor roles
- Conflict resolution

These features were excluded to prioritize a complete, reliable implementation of the required workflow within the available assessment time.

## 19. Current Limitations

- Demo identity is not secure authentication.
- Shared users receive edit access only.
- Simultaneous updates may overwrite one another.
- No conflict-detection mechanism exists.
- No autosave is implemented.
- No version recovery exists.
- The seed route is publicly callable.
- Markdown conversion supports a focused subset of formatting.
- Atlas network access is configured for the assessment deployment rather than a hardened production network model.

## 20. Production Improvements

With additional time, the architecture would be extended with:

1. Secure authentication and sessions
2. Viewer, editor, and owner roles
3. Optimistic concurrency control
4. Document version history
5. Real-time synchronization
6. Presence indicators
7. Comments and mentions
8. Audit logs
9. Autosave with debouncing
10. Restricted administrative seed operations
11. End-to-end browser tests
12. Database indexes and monitoring