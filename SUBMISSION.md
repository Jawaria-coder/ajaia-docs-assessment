# Ajaia Docs Submission

## Candidate

**Name:** Jawaria  
**Assessment:** Ajaia AI-Native Full Stack Developer Assessment  
**Project:** Ajaia Docs

## Project Links

### Live Application

[Ajaia Docs Live Demo](https://ajaia-docs-assessment-weld.vercel.app/)

### GitHub Repository

[Ajaia Docs Source Code](https://github.com/Jawaria-coder/ajaia-docs-assessment)

### Walkthrough Video

Walkthrough video URL will be added here after recording:

https://drive.google.com/file/d/1lgTXaWlRagzWXV85WtmrMoJ2d1ZFMQGM/view?usp=sharing

## Project Summary

Ajaia Docs is a lightweight collaborative document editor built with Next.js, TypeScript, Tiptap, Tailwind CSS, and MongoDB Atlas.

The application allows demo users to:

- Create documents
- Rename documents
- Edit rich-text content
- Save documents
- Reopen persisted documents
- Import `.txt` and `.md` files
- Export documents as Markdown
- Share documents with other demo users
- Edit shared documents
- Revoke document access
- Delete owned documents

The project includes server-side access checks, persistent MongoDB storage, responsive UI components, user feedback, automated tests, and a live Vercel deployment.

## Demo Users

The application contains three seeded demo users:

- Aisha Khan
- Bilal Ahmed
- Sara Malik

Use the **Viewing as** selector on the dashboard to switch between users.

## Suggested Demo Flow

1. Open the live application.
2. Select **Aisha Khan**.
3. Create a document.
4. Rename the document.
5. Add a heading, bold text, and a list.
6. Save the document.
7. Return to the dashboard.
8. Reopen the saved document.
9. Export the document as Markdown.
10. Share the document with **Bilal Ahmed**.
11. Switch to Bilal.
12. Open the document under **Shared with me**.
13. Edit and save the document.
14. Switch back to Aisha.
15. Confirm Bilal’s saved changes are visible.
16. Revoke Bilal’s access.
17. Switch back to Bilal and confirm the document is no longer accessible.

## Implemented Requirements

### Document Creation

- Users can create new documents.
- Newly created documents open directly in the editor.

### Document Renaming

- Document titles can be edited.
- Titles are persisted when the document is saved.
- Empty titles are rejected.

### Rich-Text Editing

The editor supports:

- Paragraphs
- Heading levels 1–3
- Bold
- Italic
- Underline
- Bullet lists
- Numbered lists
- Undo
- Redo

### Saving and Persistence

- Documents are saved to MongoDB Atlas.
- Rich-text content is stored as structured Tiptap JSON.
- Saved documents can be reopened after refreshing or revisiting the application.
- The editor displays saved, saving, and unsaved states.
- The most recent save time is shown.
- Users receive a warning before leaving with unsaved changes.

### File Import

Supported file formats:

- `.txt`
- `.md`

Import limitations:

- Maximum size: 1 MB
- Basic Markdown headings are preserved.
- Paragraphs are preserved.
- Bullet lists are preserved.
- Numbered lists are preserved.
- Complex Markdown structures may be simplified.

### Sharing

- Document owners can share documents with another demo user.
- Owners can revoke shared access.
- Shared users can open and edit shared documents.
- Shared users cannot delete documents.
- Shared users cannot manage sharing.
- Unrelated users cannot access documents.
- Authorization is enforced by the backend.

### Dashboard

The dashboard separates documents into:

- Owned by me
- Shared with me

Each document card displays:

- Document title
- Last updated time
- Ownership or shared-access status

### Feedback and Error Handling

The application includes feedback for:

- Document creation
- File import
- Document saving
- Markdown export
- Sharing
- Access revocation
- Invalid file formats
- Oversized files
- Failed API requests
- Document deletion

## Optional Enhancement

### Export to Markdown

The project includes Export to Markdown as an optional enhancement.

The open Tiptap document is converted into Markdown in the browser and downloaded using a sanitized version of the document title.

Supported output includes:

- Headings
- Paragraphs
- Bold text
- Italic text
- Underline using HTML tags
- Bullet lists
- Numbered lists

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

### Testing and Tooling

- Vitest
- ESLint
- Git
- GitHub
- Vercel

## Architecture Summary

The codebase is separated by responsibility.

```text
app/
├── api/
├── documents/[id]/
└── page.tsx

components/
├── dashboard/
├── editor/
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

Presentation components are separated from application logic.

Dashboard behavior is handled by:

```text
hooks/useDashboard.ts
```

Editor behavior is handled by:

```text
hooks/useDocumentEditor.ts
```

Backend operations and access checks are handled through Next.js Route Handlers.

## Access-Control Model

The assessment uses a lightweight demo identity system.

The selected demo user ID is:

1. Stored in browser local storage
2. Sent in the `x-user-id` request header
3. Resolved by the backend
4. Used for server-side authorization checks

Permissions:

| User type | Read | Edit | Share | Revoke | Delete |
|---|---:|---:|---:|---:|---:|
| Owner | Yes | Yes | Yes | Yes | Yes |
| Shared user | Yes | Yes | No | No | No |
| Unrelated user | No | No | No | No | No |

This identity model is suitable for demonstrating the assessment workflow but is not intended to replace production authentication.

## Automated Testing

The project contains six automated access-control tests.

Covered behavior:

- Owner recognition
- Shared users are not treated as owners
- Owner access
- Shared-user access
- Unrelated-user rejection
- MongoDB-style ID handling

Final result:

```text
Test Files: 1 passed
Tests: 6 passed
```

## Final Verification

The final implementation passes:

```bash
npm run lint
npm test
npm run build
```

Verification results:

```text
ESLint: Passed with no errors or warnings
Automated tests: 6 passed
TypeScript compilation: Passed
Next.js production build: Passed
Vercel deployment: Successful
MongoDB Atlas connection: Successful
```

## Documentation

The repository includes:

- `README.md`
- `ARCHITECTURE.md`
- `AI_WORKFLOW.md`
- `SUBMISSION.md`
- `walkthrough-url.txt`

## AI-Assisted Development

The project was developer-led and supported by:

- ChatGPT
- Claude
- GitHub Copilot

The developer made the final decisions regarding:

- Architecture
- Scope
- Folder structure
- Component boundaries
- Refactoring
- Feature priorities
- Testing
- Deployment
- Submission quality

AI tools supported implementation drafting, inline completion, debugging, alternative reviews, and documentation.

Further details are available in:

```text
AI_WORKFLOW.md
```

## Current Limitations

- Demo identity is not secure production authentication.
- Collaboration is persistence-based rather than simultaneous real-time editing.
- There are no live cursors or presence indicators.
- There are no comments or mentions.
- There is no document version history.
- `.docx` import is not supported.
- Shared users receive edit access rather than separate viewer and editor roles.
- Concurrent edits do not include conflict detection or resolution.
- Manual saving is used instead of autosave.
- The production seed endpoint remains publicly callable for assessment convenience.
- MongoDB Atlas network access is configured for the assessment deployment rather than a hardened private production network.

## Improvements With Additional Time

Given another two to four development hours, the next priorities would be:

1. Add secure authentication and session management.
2. Add viewer and editor permission roles.
3. Add document version history.
4. Add optimistic concurrency control.
5. Add autosave with debouncing.
6. Add end-to-end tests for the main document workflow.
7. Restrict the production seed endpoint.
8. Add database indexes and stronger production security controls.

With a larger development window, additional improvements would include:

- Real-time collaboration
- Presence indicators
- Comments
- Mentions
- Notifications
- `.docx` import
- Broader export support
- Audit logs

## Submission Checklist

- [x] Source code pushed to GitHub
- [x] Live application deployed to Vercel
- [x] MongoDB Atlas connected
- [x] Demo users seeded
- [x] Document creation implemented
- [x] Rich-text editing implemented
- [x] Saving and reopening implemented
- [x] File import implemented
- [x] Sharing implemented
- [x] Access revocation implemented
- [x] Server-side authorization implemented
- [x] Markdown export implemented
- [x] Automated tests passing
- [x] ESLint passing
- [x] Production build passing
- [x] README completed
- [x] Architecture documentation completed
- [x] AI workflow documented
- [x] Walkthrough video recorded
- [x] Walkthrough URL added
- [x] Final Google Drive submission folder prepared