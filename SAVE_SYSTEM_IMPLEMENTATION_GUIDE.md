# Save System - Implementation Guide

## Overview
Complete robust save system with auto-save, manual save, error handling, and retry logic.

---

## 1. Backend Implementation

### File: `netlify/functions/pages-update.ts`

**Key Features:**
- Dynamic query building (only updates changed fields)
- Theme support
- Validation (empty title)
- User isolation
- Timestamp tracking

**Example Request:**
```bash
curl -X PUT /.netlify/functions/pages-update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "page-uuid",
    "title": "Updated Title",
    "content": { "hero": {...} },
    "theme": "dark-neon"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "page": {
    "id": "page-uuid",
    "title": "Updated Title",
    "content": { "hero": {...} },
    "theme": "dark-neon",
    "status": "draft",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 2. Frontend Hook Implementation

### File: `client/src/hooks/useSaveManager.ts`

**Usage in Component:**
```tsx
import { useSaveManager } from "../hooks/useSaveManager";

export default function MyComponent() {
  const [page, setPage] = useState<Page | null>(null);
  const [content, setContent] = useState<PageContent | null>(null);

  const saveManager = useSaveManager({
    onSave: async () => {
      if (!page || !content) return;
      
      const result = await pagesAPI.update(page.id, {
        title,
        content,
        theme,
      });
      
      setPage(result);
    },
    debounceDelay: 1200,
    maxRetries: 3,
    onError: (error) => {
      console.error("Save failed:", error);
    },
    onSuccess: () => {
      console.log("Page saved successfully!");
    },
  });

  // Mark as unsaved when content changes
  const handleContentChange = (newContent: PageContent) => {
    setContent(newContent);
    saveManager.markUnsaved();
  };

  // Trigger auto-save (debounced)
  useEffect(() => {
    if (saveManager.hasUnsavedChanges) {
      saveManager.triggerAutoSave();
    }
  }, [saveManager.hasUnsavedChanges]);

  return (
    <div>
      {/* Manual save button */}
      <button
        onClick={() => saveManager.save()}
        disabled={!saveManager.hasUnsavedChanges}
      >
        {saveManager.isSaving ? "Saving..." : "Save"}
      </button>

      {/* Status indicator */}
      <SaveStatus
        isSaving={saveManager.isSaving}
        hasUnsavedChanges={saveManager.hasUnsavedChanges}
        lastSavedAt={saveManager.lastSavedAt}
        error={saveManager.error}
      />
    </div>
  );
}
```

---

## 3. Save Status Component

### File: `client/src/components/SaveStatus.tsx`

**Usage:**
```tsx
import { SaveStatus } from "../components/SaveStatus";

<SaveStatus
  isSaving={saveManager.isSaving}
  hasUnsavedChanges={saveManager.hasUnsavedChanges}
  lastSavedAt={saveManager.lastSavedAt}
  error={saveManager.error}
/>
```

**Output Examples:**
```
✓ Saved just now          (green)
✓ Saved 2m ago            (green)
● Unsaved changes         (orange)
⏳ Saving...               (blue)
⚠️ Failed to save...       (red)
```

---

## 4. Page Editor Integration

### File: `client/src/pages/PageEditor.tsx`

**Key Integration Points:**

#### 1. Initialize Save Manager
```tsx
const saveManager = useSaveManager({
  onSave: async () => {
    if (!page || !content) return;

    const updates: any = {};
    if (pendingChanges.title) updates.title = title;
    if (pendingChanges.content) updates.content = content;
    if (pendingChanges.theme) updates.theme = theme;

    if (Object.keys(updates).length === 0) return;

    const result = await pagesAPI.update(page.id, updates);
    setPage(result);
    setPendingChanges({ title: false, content: false, theme: false });
  },
  debounceDelay: 1200,
  maxRetries: 3,
});
```

#### 2. Track Pending Changes
```tsx
const [pendingChanges, setPendingChanges] = useState({
  title: false,
  content: false,
  theme: false,
});

const handleTitleChange = (newTitle: string) => {
  setTitle(newTitle);
  setPendingChanges((prev) => ({ ...prev, title: true }));
  saveManager.markUnsaved();
};
```

#### 3. Trigger Auto-Save
```tsx
useEffect(() => {
  if (autoSaveEnabled && Object.values(pendingChanges).some((v) => v)) {
    saveManager.triggerAutoSave();
  }
}, [pendingChanges, autoSaveEnabled, saveManager]);
```

#### 4. Manual Save Button
```tsx
<Button
  colorScheme="blue"
  onClick={() => saveManager.save()}
  isLoading={saveManager.isSaving}
  isDisabled={!saveManager.hasUnsavedChanges}
>
  Save
</Button>
```

#### 5. Publish with Save Check
```tsx
const handlePublish = async () => {
  if (!page) return;

  // Save unsaved changes first
  if (Object.values(pendingChanges).some((v) => v)) {
    const shouldSaveFirst = window.confirm(
      "You have unsaved changes. Would you like to save them before publishing?"
    );
    if (shouldSaveFirst) {
      await saveManager.save();
      if (Object.values(pendingChanges).some((v) => v)) {
        return; // Save failed
      }
    }
  }

  try {
    const updated = await pagesAPI.publish(page.id);
    setPage(updated);
    alert("Success: Page published 🚀");
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
};
```

#### 6. Disable Publish if Unsaved
```tsx
const isPublishDisabled = 
  Object.values(pendingChanges).some((v) => v) || 
  saveManager.isSaving;

<Button
  colorScheme="cyan"
  onClick={handlePublish}
  isDisabled={isPublishDisabled}
>
  Publish
</Button>
```

---

## 5. API Client

### File: `client/src/api/pages.ts`

**Update Method (Already Supports Theme):**
```tsx
async update(id: string, data: Partial<Page>): Promise<Page> {
  return retryRequest(async () => {
    const response = await fetch(`${API_BASE}/pages-update`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id, ...data }),
    });
    return handleResponse(response);
  });
}
```

**Usage:**
```tsx
// Update only title
await pagesAPI.update(pageId, { title: "New Title" });

// Update only content
await pagesAPI.update(pageId, { content: {...} });

// Update only theme
await pagesAPI.update(pageId, { theme: "dark-neon" });

// Update multiple fields
await pagesAPI.update(pageId, {
  title: "New Title",
  content: {...},
  theme: "dark-neon",
});
```

---

## 6. State Management Pattern

### Tracking Changes
```tsx
// Track which fields have pending changes
const [pendingChanges, setPendingChanges] = useState({
  title: false,
  content: false,
  theme: false,
});

// Mark field as changed
const handleTitleChange = (newTitle: string) => {
  setTitle(newTitle);
  setPendingChanges((prev) => ({ ...prev, title: true }));
  saveManager.markUnsaved();
};

// Check if anything needs saving
const hasChanges = Object.values(pendingChanges).some((v) => v);

// Clear pending changes after save
setPendingChanges({ title: false, content: false, theme: false });
```

---

## 7. Error Handling

### Retry Logic
```tsx
// Automatic retry with exponential backoff
for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    return await onSave();
  } catch (error: any) {
    if (error.message?.includes("HTTP 4")) {
      throw error; // Don't retry on client errors
    }
    
    if (attempt < maxRetries) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Error Display
```tsx
if (saveManager.error) {
  return (
    <HStack gap={2} color="red.600">
      <Icon>⚠️</Icon>
      <Text>{saveManager.error}</Text>
    </HStack>
  );
}
```

---

## 8. Debounce Implementation

### How It Works
```tsx
// Clear previous timer
if (debounceTimerRef.current) {
  clearTimeout(debounceTimerRef.current);
}

// Set new timer
debounceTimerRef.current = setTimeout(() => {
  performSave();
}, debounceDelay); // 1200ms
```

### Effect
```
User types: A → B → C → D → E
                                ↓ (1.2s delay)
                        Save triggered
```

---

## 9. Cleanup and Unmount

### Proper Cleanup
```tsx
useEffect(() => {
  return () => {
    // Clear pending timers
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Abort pending requests
    abortControllerRef.current?.abort();
  };
}, []);
```

---

## 10. Testing Examples

### Test Auto-Save
```tsx
// 1. Edit content
fireEvent.change(titleInput, { target: { value: "New Title" } });

// 2. Wait for debounce
await waitFor(() => {
  expect(saveManager.isSaving).toBe(true);
}, { timeout: 1500 });

// 3. Verify save completed
await waitFor(() => {
  expect(saveManager.hasUnsavedChanges).toBe(false);
});
```

### Test Manual Save
```tsx
// 1. Edit content
fireEvent.change(titleInput, { target: { value: "New Title" } });

// 2. Click save button
fireEvent.click(saveButton);

// 3. Verify save completed
await waitFor(() => {
  expect(saveManager.isSaving).toBe(false);
  expect(saveManager.hasUnsavedChanges).toBe(false);
});
```

### Test Error Handling
```tsx
// 1. Mock API to fail
pagesAPI.update.mockRejectedValue(new Error("Network error"));

// 2. Try to save
await saveManager.save();

// 3. Verify error displayed
expect(saveManager.error).toBe("Failed to save. Please try again.");

// 4. Verify retry attempted
expect(pagesAPI.update).toHaveBeenCalledTimes(3);
```

---

## 11. Configuration Options

### Debounce Delay
```tsx
// Fast (500ms)
useSaveManager({ debounceDelay: 500 })

// Default (1200ms)
useSaveManager({ debounceDelay: 1200 })

// Slow (2000ms)
useSaveManager({ debounceDelay: 2000 })
```

### Retry Attempts
```tsx
// No retry
useSaveManager({ maxRetries: 1 })

// Default (3 attempts)
useSaveManager({ maxRetries: 3 })

// Aggressive (5 attempts)
useSaveManager({ maxRetries: 5 })
```

---

## 12. Performance Tips

1. **Debounce Delay**: 1200ms is optimal for most use cases
2. **Selective Updates**: Only send changed fields
3. **Batch Changes**: Group related changes together
4. **Cleanup**: Always cleanup timers and requests
5. **Memoization**: Use useCallback for handlers

---

## 13. Deployment Checklist

- [ ] Backend function deployed
- [ ] Frontend components deployed
- [ ] Auto-save tested with network throttling
- [ ] Error handling tested
- [ ] Retry logic verified
- [ ] UI states verified
- [ ] Unsaved changes warning tested
- [ ] Publish flow tested
- [ ] Error logs monitored
- [ ] User feedback gathered

---

## 14. Troubleshooting

### Auto-save not triggering
- Check if `autoSaveEnabled` is true
- Verify `pendingChanges` is being set
- Check browser console for errors

### Save button disabled
- Verify `hasUnsavedChanges` is true
- Check if `isSaving` is false
- Ensure `pendingChanges` is being tracked

### Error message not showing
- Check if `error` state is being set
- Verify SaveStatus component is rendered
- Check browser console for errors

### Retry not working
- Verify network is actually failing
- Check retry count in state
- Monitor API logs for errors

---

## 15. Future Enhancements

- [ ] Keyboard shortcut (Ctrl+S) for save
- [ ] Toast notifications instead of alerts
- [ ] Offline support with service workers
- [ ] Save history/version control
- [ ] Collaborative editing
- [ ] Conflict resolution
- [ ] Undo/redo functionality
