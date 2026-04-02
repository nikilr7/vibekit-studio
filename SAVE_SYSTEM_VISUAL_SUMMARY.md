# Save System - Visual Summary

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PAGE EDITOR COMPONENT                     │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Save Manager Hook                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ State:                                         │  │   │
│  │  │ • isSaving: boolean                            │  │   │
│  │  │ • hasUnsavedChanges: boolean                   │  │   │
│  │  │ • lastSavedAt: Date | null                     │  │   │
│  │  │ • error: string | null                         │  │   │
│  │  │ • retryCount: number                           │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Methods:                                       │  │   │
│  │  │ • markUnsaved()                                │  │   │
│  │  │ • save() - immediate                           │  │   │
│  │  │ • triggerAutoSave() - debounced               │  │   │
│  │  │ • cancelSave()                                 │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Pending Changes Tracking                   │   │
│  │  {                                                   │   │
│  │    title: boolean,                                  │   │
│  │    content: boolean,                                │   │
│  │    theme: boolean                                   │   │
│  │  }                                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              UI Components                           │   │
│  │  • SaveStatus (status indicator)                    │   │
│  │  • Save Button (manual save)                        │   │
│  │  • Publish Button (with unsaved check)              │   │
│  │  • Auto-save Toggle                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   API Client     │
                    │  pagesAPI.update │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Retry Logic     │
                    │  (3 attempts)    │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Backend API     │
                    │ pages-update.ts  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │    Database      │
                    │   Update Page    │
                    └──────────────────┘
```

---

## Save Flow Diagram

### Auto-Save Flow
```
User edits field
       │
       ▼
markUnsaved()
       │
       ▼
triggerAutoSave()
       │
       ▼
┌─────────────────────┐
│  Debounce Timer     │
│  (1.2 seconds)      │
└─────────────────────┘
       │
       ▼ (if no more edits)
performSave()
       │
       ├─ Attempt 1 ──┐
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       │         Wait 1s
       │              │
       ├─ Attempt 2 ──┤
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       │         Wait 2s
       │              │
       ├─ Attempt 3 ──┤
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       └─────────────> Show Error
```

### Manual Save Flow
```
User clicks Save
       │
       ▼
Cancel pending auto-save
       │
       ▼
performSave() immediately
       │
       ├─ Attempt 1 ──┐
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       │         Wait 1s
       │              │
       ├─ Attempt 2 ──┤
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       │         Wait 2s
       │              │
       ├─ Attempt 3 ──┤
       │              │
       │         Success? ──Yes──> Update UI
       │              │
       │              No
       │              │
       └─────────────> Show Error
```

### Publish Flow
```
User clicks Publish
       │
       ▼
Check for unsaved changes
       │
       ├─ No changes ──> Publish immediately
       │
       └─ Has changes ──> Ask user
                          │
                          ├─ "Save first" ──> Save changes
                          │                        │
                          │                        ▼
                          │                   Publish
                          │
                          └─ "Cancel" ──> Do nothing
```

---

## State Transitions

```
Initial State:
┌──────────────────────────────────────┐
│ isSaving: false                      │
│ hasUnsavedChanges: false             │
│ lastSavedAt: null                    │
│ error: null                          │
└──────────────────────────────────────┘

User edits:
┌──────────────────────────────────────┐
│ isSaving: false                      │
│ hasUnsavedChanges: true  ◄── CHANGED │
│ lastSavedAt: null                    │
│ error: null                          │
└──────────────────────────────────────┘

Auto-save triggered:
┌──────────────────────────────────────┐
│ isSaving: true  ◄── CHANGED           │
│ hasUnsavedChanges: true              │
│ lastSavedAt: null                    │
│ error: null                          │
└──────────────────────────────────────┘

Save successful:
┌──────────────────────────────────────┐
│ isSaving: false  ◄── CHANGED          │
│ hasUnsavedChanges: false  ◄── CHANGED │
│ lastSavedAt: 2024-01-15T10:30:00Z ◄─ │
│ error: null                          │
└──────────────────────────────────────┘

Save failed:
┌──────────────────────────────────────┐
│ isSaving: false  ◄── CHANGED          │
│ hasUnsavedChanges: true              │
│ lastSavedAt: 2024-01-15T10:30:00Z    │
│ error: "Failed to save..." ◄── CHANGED│
└──────────────────────────────────────┘
```

---

## UI State Mapping

### Save Button
```
┌─────────────────────────────────────────┐
│ hasUnsavedChanges │ isSaving │ State    │
├─────────────────────────────────────────┤
│ false             │ false    │ Disabled │
│ true              │ false    │ Enabled  │
│ true              │ true     │ Loading  │
│ false             │ true     │ Loading  │
└─────────────────────────────────────────┘
```

### Publish Button
```
┌──────────────────────────────────────────────┐
│ hasUnsavedChanges │ isSaving │ State        │
├──────────────────────────────────────────────┤
│ false             │ false    │ Enabled      │
│ true              │ false    │ Disabled     │
│ true              │ true     │ Loading      │
│ false             │ true     │ Loading      │
└──────────────────────────────────────────────┘
```

### SaveStatus Component
```
┌──────────────────────────────────────────────────────┐
│ isSaving │ hasUnsaved │ error │ Display              │
├──────────────────────────────────────────────────────┤
│ false    │ false      │ null  │ ✓ Saved just now     │
│ false    │ false      │ null  │ ✓ Saved 2m ago       │
│ false    │ true       │ null  │ ● Unsaved changes    │
│ true     │ true       │ null  │ ⏳ Saving...          │
│ false    │ true       │ msg   │ ⚠️ Failed to save... │
└──────────────────────────────────────────────────────┘
```

---

## Debounce Visualization

### Scenario 1: Continuous Typing
```
Time:    0ms    200ms   400ms   600ms   800ms   1000ms  1200ms  1400ms
Input:   A      B       C       D       E       (stop)
Timer:   |------|------|------|------|------|------|------|
Reset:   ✓      ✓      ✓      ✓      ✓      
Save:                                                    ✓

Result: Only 1 save after 1.2s of inactivity
```

### Scenario 2: Typing with Pauses
```
Time:    0ms    200ms   400ms   600ms   800ms   1000ms  1200ms  1400ms
Input:   A      B       (pause)                C       D       (stop)
Timer:   |------|------|------|------|------|------|------|
Reset:   ✓      ✓                             ✓      ✓
Save:                                                    ✓

Result: Only 1 save after 1.2s of inactivity
```

---

## Retry Logic Visualization

```
Attempt 1
├─ Try save
├─ Fail (network error)
└─ Wait 1 second

Attempt 2
├─ Try save
├─ Fail (network error)
└─ Wait 2 seconds

Attempt 3
├─ Try save
├─ Fail (network error)
└─ Show error message

Total time: ~3 seconds
```

---

## Component Hierarchy

```
PageEditor
├── SaveManager Hook
│   ├── State Management
│   ├── Debounce Logic
│   ├── Retry Logic
│   └── Cleanup
├── SaveStatus Component
│   ├── Status Display
│   ├── Time Ago Display
│   └── Error Display
├── Save Button
│   ├── onClick: saveManager.save()
│   ├── disabled: !hasUnsavedChanges
│   └── loading: isSaving
├── Publish Button
│   ├── onClick: handlePublish()
│   ├── disabled: hasUnsavedChanges || isSaving
│   └── loading: isSaving
└── Auto-save Toggle
    └── onClick: setAutoSaveEnabled(!autoSaveEnabled)
```

---

## Data Flow

```
User Input
    │
    ▼
Component State Update
    │
    ├─ setTitle()
    ├─ setContent()
    └─ setTheme()
    │
    ▼
Mark Pending Changes
    │
    ├─ pendingChanges.title = true
    ├─ pendingChanges.content = true
    └─ pendingChanges.theme = true
    │
    ▼
Mark Unsaved
    │
    └─ saveManager.markUnsaved()
    │
    ▼
Trigger Auto-Save (if enabled)
    │
    └─ saveManager.triggerAutoSave()
    │
    ▼
Debounce Timer (1.2s)
    │
    ▼
Perform Save
    │
    ├─ Build update object
    ├─ Call pagesAPI.update()
    └─ Retry up to 3 times
    │
    ▼
Update State
    │
    ├─ setPage(result)
    ├─ Clear pendingChanges
    └─ Update saveManager state
    │
    ▼
Update UI
    │
    ├─ SaveStatus shows "Saved just now"
    ├─ Save button becomes disabled
    └─ Publish button becomes enabled
```

---

## Error Handling Flow

```
Save Attempt
    │
    ├─ Success ──> Update UI ──> Done
    │
    └─ Failure
        │
        ├─ Client Error (4xx) ──> Show error ──> Done
        │
        └─ Server/Network Error (5xx)
            │
            ├─ Attempt < 3 ──> Wait & Retry
            │
            └─ Attempt = 3 ──> Show error ──> Done
```

---

## Performance Characteristics

```
Debounce Delay:     1200ms (configurable)
Retry Attempts:     3 (configurable)
Retry Backoff:      1s, 2s, 4s (exponential)
Max Retry Time:     ~7 seconds
Payload Size:       Only changed fields
Memory Overhead:    Minimal (cleanup on unmount)
```

---

## Browser Compatibility

```
Chrome/Edge:        ✅ Full support
Firefox:            ✅ Full support
Safari:             ✅ Full support
Mobile Browsers:    ✅ Full support
IE 11:              ❌ Not supported (AbortController)
```

---

## Key Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| Debounce Delay | 1200ms | Prevents API spam |
| Retry Attempts | 3 | Handles transient failures |
| Retry Backoff | Exponential | 1s, 2s, 4s |
| Max Retry Time | ~7s | Total time for 3 attempts |
| Payload Size | Minimal | Only changed fields |
| Memory Overhead | <1MB | Proper cleanup |
| CPU Usage | Minimal | Efficient debouncing |

---

## Success Criteria

✅ Auto-save works without user interaction
✅ Manual save works immediately
✅ Error handling with retry logic
✅ Status indicator shows real-time state
✅ Publish disabled if unsaved changes
✅ Unsaved changes warning on navigation
✅ No API spam (debouncing)
✅ No concurrent saves
✅ Proper cleanup on unmount
✅ User-friendly error messages
