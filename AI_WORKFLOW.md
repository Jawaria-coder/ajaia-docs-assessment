# AI-Assisted Development Workflow

## 1. Overview

Ajaia Docs was developed through a developer-led workflow supported by AI tools and standard software-development tools.

The developer made the primary decisions regarding:

- Project scope
- Technical stack
- Application architecture
- Folder structure
- Component boundaries
- Feature priorities
- Code quality
- Testing
- Deployment
- Final submission content

AI tools were used to accelerate selected tasks such as implementation drafting, code completion, debugging, alternative solution review, refactoring support, and documentation preparation.

AI-generated suggestions were not accepted automatically. They were reviewed, adjusted, rejected, or rewritten when they did not match the requirements, project structure, or expected quality.

The final project is therefore best described as:

```text
Developer-led
AI-assisted
Tool-verified
Manually tested
```

## 2. Tools Used

### AI Tools

The following AI tools were used during the assessment:

- ChatGPT
- Claude
- GitHub Copilot

### Development and Verification Tools

The following development tools were used:

- Visual Studio Code
- TypeScript
- ESLint
- Vitest
- Next.js development and production build tools
- Git
- GitHub
- Vercel
- Vercel runtime logs
- MongoDB Atlas
- PowerShell
- Browser testing and developer tools

These tools were essential for verifying whether AI-assisted code and suggestions were actually correct.

## 3. Role of Each AI Tool

### ChatGPT

ChatGPT was used as the main conversational development assistant.

It supported tasks such as:

- Breaking the assessment into implementation stages
- Discussing technical approaches
- Drafting selected code sections
- Explaining TypeScript, React, Next.js, Tiptap, and MongoDB errors
- Suggesting debugging steps
- Helping restructure oversized files
- Supporting deployment configuration
- Interpreting Vercel and MongoDB Atlas errors
- Preparing documentation drafts
- Producing testing and deployment checklists

The developer provided the actual requirements, source-code context, screenshots, terminal output, runtime logs, and architectural direction.

ChatGPT did not determine the final project structure independently.

### Claude

Claude was used occasionally as a secondary AI assistant.

It supported tasks such as:

- Reviewing implementation ideas
- Comparing alternative solutions
- Providing a second explanation of selected technical issues
- Checking whether an approach was unnecessarily complex
- Reviewing individual code or architecture decisions

Claude was used as an additional perspective rather than as the main driver of the project.

Its suggestions were reviewed before being applied.

### GitHub Copilot

GitHub Copilot was used inside the development environment for inline coding assistance.

It helped with:

- Code completion
- Repetitive TypeScript syntax
- React component markup
- Predictable utility code
- Small implementation suggestions
- Boilerplate reduction

Copilot did not decide:

- The project architecture
- Folder structure
- Application scope
- Feature priorities
- Component boundaries
- Access-control rules
- Deployment configuration

The developer reviewed Copilot suggestions and rejected or modified completions that did not match the project’s types, naming conventions, or structure.

## 4. Developer-Led Decisions

The developer remained responsible for the overall direction and quality of the application.

Important developer decisions included:

- Using Next.js and TypeScript
- Using MongoDB Atlas for persistent document storage
- Storing structured Tiptap JSON rather than plain text
- Using Next.js Route Handlers for the backend
- Keeping the frontend and backend inside one repository
- Using a lightweight demo-user system rather than rushed authentication
- Implementing server-side access checks
- Separating owned and shared documents
- Allowing shared users to edit documents
- Restricting sharing and deletion to owners
- Supporting `.txt` and `.md` imports
- Selecting Export to Markdown as the optional enhancement
- Adding polished save, import, export, and sharing feedback
- Requiring reusable components and smaller files
- Moving application logic into custom hooks
- Rejecting unnecessary real-time and authentication complexity
- Requiring lint, tests, and production builds to pass
- Manually testing the deployed application

The developer also identified weaknesses in AI-assisted output and required them to be corrected.

## 5. Code Structure Decisions

The final structure was intentionally organized by responsibility.

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
```

The developer specifically required:

- Smaller files
- Reusable components
- Focused responsibilities
- Separation between UI and application logic
- Dedicated hooks for dashboard and editor behavior
- Separate utility modules for database access, validation, import, export, and authorization
- A structure that a reviewer could understand without reading one enormous component

AI assisted with rewriting the files after these structural requirements were defined.

## 6. Requirements Breakdown

The assessment was implemented incrementally.

The workflow was divided into the following stages:

1. Project setup
2. MongoDB connection
3. Demo-user creation and seeding
4. Document creation
5. Document listing
6. Rich-text editor integration
7. Saving and reopening documents
8. File import
9. Sharing and access control
10. UI feedback and visual polish
11. Markdown export
12. Component refactoring
13. Hook extraction
14. Automated testing
15. Git and GitHub setup
16. Vercel deployment
17. Production debugging
18. Documentation
19. Walkthrough preparation

This staged approach helped keep the project focused on completing the required user flow before adding optional improvements.

## 7. AI-Assisted Implementation Areas

AI tools helped draft or complete selected parts of the implementation.

These included:

- MongoDB connection utilities
- Demo-user seed data
- Request-user resolution
- Document schemas
- Document API routes
- Sharing API routes
- Access-control helper functions
- Tiptap editor configuration
- Rich-text toolbar actions
- Dashboard components
- Editor components
- Sharing dialog behavior
- File import conversion
- Markdown export conversion
- Notice and feedback components
- Automated access-control tests
- Documentation templates

The generated output was adjusted to match:

- Existing project files
- TypeScript types
- Actual API responses
- MongoDB data structures
- Component naming
- Assessment requirements
- Remaining development time

## 8. Refactoring Process

The developer wanted the codebase to use a maintainable component structure.

An initial AI-assisted refactor extracted some presentation components, including:

- Dashboard header
- Workspace actions
- Document cards
- Document sections
- Editor header
- Editor toolbar

However, the main files remained too large because most state management, API requests, and action handlers were still inside:

- `app/page.tsx`
- `components/DocumentEditor.tsx`

The developer identified that this was only a partial refactor and rejected it.

The architecture was then improved by extracting logic into:

```text
hooks/
├── useDashboard.ts
└── useDocumentEditor.ts
```

### `useDashboard`

This hook manages:

- Loading demo users
- Restoring the selected user
- Loading documents
- Separating owned and shared documents
- Creating documents
- Importing files
- Dashboard loading states
- Dashboard notices
- Navigation to documents

### `useDocumentEditor`

This hook manages:

- Tiptap initialization
- Document loading
- Title changes
- Dirty-state tracking
- Saving
- Deletion
- Markdown export
- Sharing-dialog state
- Shared-user updates
- Saved timestamps
- Navigation protection
- Editor notices

This change left the page and editor components focused mainly on rendering and composition.

The final structure reflects developer-led quality control rather than blind acceptance of the initial AI suggestion.

## 9. Suggestions That Were Rejected or Changed

AI suggestions were not always correct, complete, or suitable for the assessment.

### Incomplete Initial Refactor

The first refactor moved JSX into components but did not sufficiently reduce the size of the main files.

The developer rejected this approach and required controller logic to be moved into custom hooks.

### Full Authentication

A full authentication system was not implemented.

It would have consumed significant assessment time and reduced focus on the required document workflow.

A lightweight demo-user selector was used instead.

The security limitation is clearly documented.

### Real-Time Simultaneous Editing

Real-time collaboration, live cursors, and presence indicators were not implemented.

These features would require:

- Synchronization infrastructure
- Connection management
- Conflict handling
- More complex state coordination

The project instead demonstrates collaboration through shared persistent documents.

### Excessive Abstraction

The project avoided adding unnecessary layers such as:

- Global state-management libraries
- Multiple context providers
- Generic API-client frameworks
- Large service classes
- Separate frontend and backend repositories
- Premature permission tables
- Complex event systems

The final architecture uses focused components, two hooks, Route Handlers, and small utilities.

### Broad ESLint Suppression

Broad ESLint rule disabling was avoided.

An unnecessary suppression comment was removed after ESLint reported it as unused.

The final lint run passes without warnings.

### Unverified Generated Code

Generated code was not assumed to be correct because it looked plausible.

It was verified using:

```bash
npm run lint
npm test
npm run build
```

It was also tested manually in both local and deployed environments.

### Excessive AI Credit

An initial documentation draft overstated the role of AI in the project.

The developer corrected it because the architecture, folder structure, component separation, and quality requirements were developer-led.

The final documentation gives AI credit for assistance without presenting it as the owner of the project.

## 10. Debugging Support

AI tools were used to help interpret technical errors.

Examples included:

- MongoDB ObjectId comparisons
- TypeScript typing for MongoDB update operations
- Tiptap JSON typing
- React hook lint warnings
- Next.js client-component behavior
- Incorrect component import paths
- Windows case-sensitive folder naming issues
- Vercel environment-variable configuration
- MongoDB Atlas network access
- Production TLS connection failures

The developer supplied real evidence such as:

- Terminal output
- Screenshots
- Browser behavior
- API responses
- Vercel runtime logs
- MongoDB Atlas configuration screens

Fixes were selected using that evidence rather than by accepting guesses.

## 11. Production Debugging Example

After deploying the application, the interface loaded but the demo-user dropdown was empty.

The developer checked the production health route using PowerShell:

```powershell
curl.exe -i "https://ajaia-docs-assessment-weld.vercel.app/api/health"
```

The response returned:

```text
MongoDB connection failed
```

Vercel runtime logs revealed a MongoDB server-selection and TLS connection failure.

The issue was not caused by the frontend dropdown.

The developer traced it to MongoDB Atlas network access and updated the Atlas IP Access List to permit the Vercel deployment environment.

After the network rule became active:

- The production health endpoint succeeded
- The production database was seeded
- The demo users appeared
- The full application workflow became available

This troubleshooting process relied on runtime evidence and developer verification.

## 12. Testing and Verification

### Static Verification

The final implementation passes:

```text
ESLint: passed with no warnings
TypeScript: passed
Production build: passed
```

### Automated Tests

Vitest was used to test document access-control behavior.

The six tests verify:

- Recognition of the document owner
- Shared users are not treated as owners
- Owner access
- Shared-user access
- Rejection of unrelated users
- MongoDB-style IDs with `toString` methods

Final result:

```text
Test Files: 1 passed
Tests: 6 passed
```

### Manual Document Testing

The developer manually verified:

- Creating a document
- Renaming a document
- Adding headings
- Adding bold text
- Adding italic text
- Adding underline formatting
- Adding bullet lists
- Adding numbered lists
- Saving a document
- Refreshing the browser
- Reopening the document
- Confirming persistence
- Deleting an owned document

### File Import Testing

The developer tested:

- Importing a `.txt` file
- Importing a `.md` file
- Editing imported content
- Saving imported content
- Rejecting unsupported formats
- Rejecting files larger than 1 MB
- Import success feedback

### Sharing Testing

The developer tested:

- Sharing a document with another demo user
- Switching to the shared user
- Confirming the document appears under `Shared with me`
- Opening the shared document
- Editing the document
- Saving shared-user changes
- Switching back to the owner
- Confirming the changes are visible
- Revoking access
- Confirming the shared user loses access

### Export Testing

The developer tested:

- Exporting an open document
- Confirming a Markdown file downloads
- Confirming the document title is used as the filename
- Confirming supported formatting appears in the Markdown output
- Export success feedback

### Production Testing

The live Vercel application was tested for:

- MongoDB connectivity
- Demo-user loading
- Document creation
- Document persistence
- Document reopening
- User switching
- Sharing
- Shared-user editing
- Access revocation
- Markdown export

## 13. Human Review Process

For each major feature, the developer followed this process:

```text
Understand the assessment requirement
        |
        v
Decide the desired behavior and structure
        |
        v
Use AI for selected implementation support
        |
        v
Review generated suggestions
        |
        v
Correct or reject unsuitable output
        |
        v
Run lint, tests, and production build
        |
        v
Test the feature manually
        |
        v
Commit only after verification
```

## 14. Division of Responsibility

### Developer Responsibilities

The developer was responsible for:

- Understanding the assessment
- Choosing the technical stack
- Defining the project scope
- Choosing MongoDB
- Choosing Tiptap JSON storage
- Defining the folder structure
- Requiring reusable components
- Requiring custom hooks
- Identifying oversized files
- Rejecting an incomplete refactor
- Defining access-control behavior
- Selecting the optional enhancement
- Reviewing all generated code
- Running lint and tests
- Running production builds
- Performing local testing
- Performing production testing
- Configuring GitHub
- Configuring Vercel
- Configuring MongoDB Atlas
- Diagnosing deployment problems using real logs
- Deciding what belonged in the final submission

### ChatGPT Assistance

ChatGPT assisted with:

- Implementation drafts
- Error explanations
- Debugging suggestions
- Refactoring code
- Test preparation
- Deployment guidance
- Documentation drafting
- Testing checklists

### Claude Assistance

Claude assisted occasionally with:

- Alternative technical perspectives
- Reviewing selected approaches
- Comparing implementation options
- Clarifying individual technical ideas

### GitHub Copilot Assistance

GitHub Copilot assisted with:

- Inline code completion
- Repetitive syntax
- React and TypeScript boilerplate
- Small utility suggestions
- Predictable implementation completion

None of the AI tools had final authority over the project.

The developer remained responsible for correctness, maintainability, testing, deployment, and submission quality.

## 15. Benefits of AI Assistance

AI tools were useful for:

- Accelerating repetitive implementation
- Explaining unfamiliar errors
- Producing initial code drafts
- Comparing technical approaches
- Identifying edge cases
- Creating verification checklists
- Supporting refactoring
- Troubleshooting deployment
- Structuring documentation

Using multiple AI tools also provided different forms of support:

- ChatGPT provided conversational implementation and debugging support.
- Claude provided occasional alternative reviews.
- GitHub Copilot reduced boilerplate while writing code.

## 16. Limitations and Risks of AI Assistance

AI-assisted development introduced several risks:

- Generated code could use incorrect import paths
- Suggested types could conflict with the project
- Refactors could be incomplete
- Explanations could overstate AI’s contribution
- Suggestions could add unnecessary complexity
- Generated code could compile but fail in production
- AI could assume details not present in the project
- Inline completions could introduce inconsistent naming
- Documentation could describe features inaccurately

These risks were controlled through:

- Developer review
- Incremental implementation
- TypeScript checks
- ESLint
- Automated tests
- Production builds
- Manual browser testing
- API testing
- Runtime-log inspection

## 17. Final Assessment of AI Use

AI tools improved development speed and provided useful coding, review, debugging, and documentation support.

Their roles were different:

- ChatGPT provided the main conversational development support.
- Claude provided occasional alternative reviews and perspectives.
- GitHub Copilot assisted with inline completion and boilerplate.
- The developer defined the scope, architecture, folder structure, component boundaries, feature priorities, and quality expectations.

The project was not created by accepting generated output without review.

The final result came from combining:

- Developer-defined architecture
- Developer judgment
- AI-assisted implementation
- Developer-led refactoring
- Automated verification
- Manual testing
- Production debugging

The developer remained responsible for the project’s correctness, maintainability, deployment, and final submission.