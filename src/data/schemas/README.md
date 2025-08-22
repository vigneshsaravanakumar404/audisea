# Database Schemas

This directory contains TypeScript interfaces and utility functions for all database collections in the Audisea application.

## Schema Files

### `tutor.ts`
- **Collection**: `tutors`
- **Purpose**: Stores tutor profile information and availability
- **Key Fields**:
  - `uid`: Unique user identifier
  - `name`, `email`, `photoURL`: Basic profile information
  - `subjects`: Array of subjects the tutor can teach
  - `datesAvailable`: Array of available dates (YYYY-MM-DD format)
  - `timeSlots`: Map of date strings to time slot descriptions

### `parent.ts`
- **Collection**: `parents`
- **Purpose**: Stores parent profile information
- **Key Fields**:
  - `uid`: Unique user identifier
  - `children`: Array of student UIDs
  - `phoneNumber`: Optional contact information

### `student.ts`
- **Collection**: `students`
- **Purpose**: Stores student profile information
- **Key Fields**:
  - `uid`: Unique user identifier
  - `parentUid`: Reference to parent document
  - `subjects`: Array of subjects the student is studying
  - `grade`, `age`: Academic and personal information

### `session.ts`
- **Collection**: `sessions`
- **Purpose**: Stores tutoring session information
- **Key Fields**:
  - `uid`: Unique session identifier
  - `tutorUid`, `studentUid`, `parentUid`: References to user documents
  - `date`, `startTime`, `endTime`: Session scheduling
  - `status`: Session status (scheduled, completed, cancelled, no-show)
  - `createdAt`, `updatedAt`: Timestamps

## Utility Functions

### `createDefaultTutorDocument()`
Creates a new tutor document with default values when a user first visits the availabilities page.

### `createDefaultParentDocument()`
Creates a new parent document with default values.

### `createDefaultStudentDocument()`
Creates a new student document with default values.

## Firebase Utilities

The `src/data/firebase/utils.ts` file contains the `FirebaseUtils` class with common database operations:

- `getOrCreateTutor()`: Fetches existing tutor data or creates default document
- `getOrCreateParent()`: Fetches existing parent data or creates default document
- `getOrCreateStudent()`: Fetches existing student data or creates default document
- `documentExists()`: Checks if a document exists in a collection
- `getDocument()`: Generic function to get any document from any collection

## Usage Example

```typescript
import { FirebaseUtils } from '@/data/firebase/utils';
import { TutorSchema } from '@/data/schemas';

// Get or create tutor document
const tutorData = await FirebaseUtils.getOrCreateTutor(
  user.uid,
  user.displayName || 'Unknown',
  user.email || '',
  user.photoURL || ''
);
```

## Benefits

1. **Type Safety**: All database operations are fully typed
2. **Consistency**: Standardized document structure across the application
3. **Reusability**: Common functions can be used in multiple components
4. **Maintainability**: Centralized schema definitions are easier to update
5. **Auto-creation**: Documents are automatically created with proper defaults when needed
