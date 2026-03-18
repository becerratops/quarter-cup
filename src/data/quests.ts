export type Priority = 'urgent' | 'crucial' | 'would-love' | 'nice-to-have';
export type Effort = 'XS' | 'S' | 'M' | 'L';
export type QuestStatus = 'open' | 'claimed' | 'completed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  effort: Effort;
  points: number;
  status: QuestStatus;
  claimedBy?: string;
  completedBy?: string;
  completedAt?: string;
  acceptanceCriteria: string[];
  tags: string[];
}

const PRIORITY_MULTIPLIER: Record<Priority, number> = {
  urgent: 4,
  crucial: 3,
  'would-love': 2,
  'nice-to-have': 1,
};

const EFFORT_MULTIPLIER: Record<Effort, number> = {
  XS: 1,
  S: 2,
  M: 3,
  L: 5,
};

export function calculatePoints(priority: Priority, effort: Effort): number {
  return PRIORITY_MULTIPLIER[priority] * EFFORT_MULTIPLIER[effort];
}

// ============================================================
// EXAMPLE QUESTS — Replace with your own or load from Jira/API
// ============================================================
// To use your own quests, create a file at data/quests.local.ts
// (gitignored) or connect to your Jira instance via the config.
// ============================================================

export const QUESTS: Quest[] = [
  // === URGENT ===
  {
    id: 'Q-001',
    title: 'Fix Login 500 Error',
    description: 'Users get a 500 Internal Server Error when logging in with an email that contains a plus sign (e.g., user+test@example.com). The backend auth middleware doesn\'t URL-decode the email before lookup.',
    priority: 'urgent',
    effort: 'S',
    points: calculatePoints('urgent', 'S'),
    status: 'open',
    acceptanceCriteria: [
      'POST /api/auth/login returns 200 for emails with + characters',
      'Existing users with + in email can log in successfully',
      'No regression for standard email formats',
    ],
    tags: ['backend', 'auth', 'bug'],
  },
  {
    id: 'Q-002',
    title: 'Dashboard Not Updating in Real-Time',
    description: 'When one user makes changes on mobile, the desktop dashboard doesn\'t reflect updates until a full page refresh. WebSocket events are emitted but the frontend isn\'t listening.',
    priority: 'urgent',
    effort: 'M',
    points: calculatePoints('urgent', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Desktop dashboard updates within 5 seconds of any change',
      'No manual page refresh required',
      'WebSocket reconnection handles network drops gracefully',
    ],
    tags: ['frontend', 'websocket', 'real-time'],
  },
  {
    id: 'Q-003',
    title: 'Admin Role Can\'t Access Settings Page',
    description: 'The settings page returns 403 for admin users. The route guard checks for "superadmin" role but the settings page should be accessible to both "admin" and "superadmin" roles.',
    priority: 'urgent',
    effort: 'XS',
    points: calculatePoints('urgent', 'XS'),
    status: 'open',
    acceptanceCriteria: [
      'Admin users can access /settings without 403',
      'Role check allows both admin and superadmin',
      'Non-admin users still get 403',
    ],
    tags: ['backend', 'auth', 'permissions'],
  },
  {
    id: 'Q-004',
    title: 'Merge Pending PRs (#12, #13, #14)',
    description: 'Three approved PRs have been sitting for a week. Review any final comments, resolve conflicts if needed, and merge to dev.',
    priority: 'urgent',
    effort: 'XS',
    points: calculatePoints('urgent', 'XS'),
    status: 'open',
    acceptanceCriteria: [
      'All three PRs merged to dev',
      'No merge conflicts remaining',
      'CI passes on dev after merge',
    ],
    tags: ['PR-review', 'housekeeping'],
  },

  // === CRUCIAL ===
  {
    id: 'Q-005',
    title: 'Add Address Autocomplete to Forms',
    description: 'Address input fields are plain text. Replace with a geocoding-powered typeahead that suggests addresses as the user types and populates street, city, state, zip fields on selection.',
    priority: 'crucial',
    effort: 'M',
    points: calculatePoints('crucial', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Address fields show suggestions as user types',
      'Selecting a suggestion populates individual fields (street, city, state, zip)',
      'Each field is individually editable after auto-fill',
      'Shared component reused across all address inputs',
    ],
    tags: ['frontend', 'geocoding', 'UX'],
  },
  {
    id: 'Q-006',
    title: 'Currency Formatting on Price Inputs',
    description: 'Price and payment inputs show raw numbers (e.g., 250000). Should display with $ prefix and comma separators ($250,000).',
    priority: 'crucial',
    effort: 'XS',
    points: calculatePoints('crucial', 'XS'),
    status: 'open',
    acceptanceCriteria: [
      'All price inputs display with $ prefix and comma formatting',
      'Underlying value remains a clean number for the API',
      'Formatting works on both input and display',
    ],
    tags: ['frontend', 'UI', 'formatting'],
  },
  {
    id: 'Q-007',
    title: 'Form Wizard: Edit Without Restarting',
    description: 'On the review page of multi-step forms, tapping "Edit" sends the user back to that step and forces them to re-walk all subsequent steps. Should jump to the field and return to review.',
    priority: 'crucial',
    effort: 'M',
    points: calculatePoints('crucial', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Edit on review page opens just that field (inline or modal)',
      'After editing, user returns directly to review page',
      'No need to re-walk intermediate steps',
    ],
    tags: ['frontend', 'forms', 'UX'],
  },
  {
    id: 'Q-008',
    title: 'Show Inline Validation Errors on Registration',
    description: 'Registration form shows a generic "Something went wrong" toast when validation fails. Backend returns field-specific errors but the form doesn\'t display them.',
    priority: 'crucial',
    effort: 'S',
    points: calculatePoints('crucial', 'S'),
    status: 'open',
    acceptanceCriteria: [
      'Field-level error messages appear under the relevant input',
      'No generic toast for validation failures',
      'Backend errors are parsed and mapped to form fields',
    ],
    tags: ['frontend', 'registration', 'UX'],
  },
  {
    id: 'Q-009',
    title: 'PDF Document Generation on Form Submit',
    description: 'When users submit certain forms, a PDF should be generated with their responses and attached to their record. Currently no document is produced.',
    priority: 'crucial',
    effort: 'L',
    points: calculatePoints('crucial', 'L'),
    status: 'open',
    acceptanceCriteria: [
      'PDF generates on form submission with all relevant data',
      'PDF attaches to the user\'s record automatically',
      'PDF is viewable and downloadable from the documents section',
      'Professional formatting suitable for external use',
    ],
    tags: ['backend', 'frontend', 'documents', 'PDF'],
  },

  // === WOULD LOVE THIS ===
  {
    id: 'Q-010',
    title: 'Dark Mode Support',
    description: 'Add a dark mode toggle that respects system preference by default. Should persist the user\'s choice across sessions.',
    priority: 'would-love',
    effort: 'M',
    points: calculatePoints('would-love', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Dark mode toggle in settings/header',
      'Respects OS prefers-color-scheme by default',
      'Preference persists in localStorage',
      'All components render correctly in both modes',
    ],
    tags: ['frontend', 'UI', 'theming'],
  },
  {
    id: 'Q-011',
    title: 'Add User Activity Feed',
    description: 'Show a chronological feed of recent actions (form submissions, document uploads, status changes) on the dashboard. Helps team members see what\'s happening without checking each section.',
    priority: 'would-love',
    effort: 'L',
    points: calculatePoints('would-love', 'L'),
    status: 'open',
    acceptanceCriteria: [
      'Activity feed shows recent actions with timestamps',
      'Feed updates in real-time via WebSocket',
      'Filterable by action type',
      'Paginated for performance',
    ],
    tags: ['frontend', 'backend', 'dashboard'],
  },
  {
    id: 'Q-012',
    title: 'Notification: Tell Users Who Gets Notified',
    description: 'When an action triggers notifications, tell the user explicitly who was notified. Builds trust and transparency.',
    priority: 'would-love',
    effort: 'M',
    points: calculatePoints('would-love', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'After triggering an action, UI shows "Notified: [names/roles]"',
      'Pattern is consistent across all notification-triggering actions',
    ],
    tags: ['frontend', 'UX', 'trust'],
  },
  {
    id: 'Q-013',
    title: 'Inline Document Viewer',
    description: 'Currently documents open via external URL in a new tab. Add an inline viewer with download/share buttons directly in the app.',
    priority: 'would-love',
    effort: 'M',
    points: calculatePoints('would-love', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'PDFs render inline using a viewer component',
      'Download and Share buttons available',
      'Works on both desktop and mobile',
    ],
    tags: ['frontend', 'documents', 'UI'],
  },

  // === NICE TO HAVE ===
  {
    id: 'Q-014',
    title: 'Polish Date/Time Picker',
    description: 'Replace native HTML date/time inputs with a polished, mobile-friendly custom picker that matches the app\'s design language.',
    priority: 'nice-to-have',
    effort: 'M',
    points: calculatePoints('nice-to-have', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Custom date/time picker replaces native inputs',
      'Large touch targets for mobile use',
      'Matches app design language',
    ],
    tags: ['frontend', 'UI', 'mobile'],
  },
  {
    id: 'Q-015',
    title: 'Document Naming on Upload',
    description: 'No way to set a display name when uploading documents. Should be able to name on upload and rename after.',
    priority: 'nice-to-have',
    effort: 'S',
    points: calculatePoints('nice-to-have', 'S'),
    status: 'open',
    acceptanceCriteria: [
      'Upload dialog includes a name field',
      'Existing documents can be renamed',
    ],
    tags: ['frontend', 'documents'],
  },
  {
    id: 'Q-016',
    title: 'Online Presence Indicator',
    description: 'Show real-time online/offline status for team members using existing WebSocket connections. Green dot = online, gray = offline.',
    priority: 'nice-to-have',
    effort: 'M',
    points: calculatePoints('nice-to-have', 'M'),
    status: 'open',
    acceptanceCriteria: [
      'Green dot next to online team members',
      'Gray dot for offline members',
      'Uses existing WebSocket connections',
    ],
    tags: ['frontend', 'websocket', 'team'],
  },
  {
    id: 'Q-017',
    title: 'Clean Up Stale GitHub Branches',
    description: 'Over 100 remote branches, most already merged. Prune merged branches and document a policy for branch cleanup.',
    priority: 'nice-to-have',
    effort: 'S',
    points: calculatePoints('nice-to-have', 'S'),
    status: 'open',
    acceptanceCriteria: [
      'All merged branches are deleted from remote',
      'Branch cleanup policy documented in contributing guide',
    ],
    tags: ['housekeeping', 'git'],
  },
];

// Derived stats
export const TOTAL_POINTS = QUESTS.reduce((sum, q) => sum + q.points, 0);
export const QUEST_COUNT = QUESTS.length;
export const URGENT_COUNT = QUESTS.filter(q => q.priority === 'urgent').length;
export const CRUCIAL_COUNT = QUESTS.filter(q => q.priority === 'crucial').length;
