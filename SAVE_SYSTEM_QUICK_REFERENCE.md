# Save System - Quick Reference

## What Was Implemented

### 1. Backend (pages-update.ts)
- Dynamic query building (only updates changed fields)
- Theme support
- Validation (empty title rejection)
- User isolation
- Timestamp tracking

### 2. Frontend Hook (useSaveManager.ts)
- Debounced auto-save (1.2s delay)
- Retry logic (3 attempts, exponential backoff)
- State management (isSaving, hasUnsavedChanges, error, lastSavedAt)
- Prevents concurrent saves
- Cleanup on unmount

### 3. UI Component (SaveStatus.tsx)
- Real-time status display
- "Saved X minutes ago" display
- Color-coded states (green/orange/blue/red)
- Error message display

### 4. Page Editor (PageEditor.tsx)
- Integrated save manager
- Tracks pending changes per field
- Auto-save enabled by default
- Manual save button
- Publish disabled if unsaved
- Unsaved changes warning

---

## How It Works

### Auto-Save Flow
```
User edits → markUnsaved() → triggerAutoSave()
                                    ↓
                            Wait 1.2 seconds
                                    ↓
                            performSave() with retry
                                    ↓
                            Update UI
```

### Manual Save Flow
```
User clicks Save → performSave() immediately
                            ↓
                    Retry up to 3 times
                            ↓
                    Update UI
```

### Publish Flow
```
User clicks Publish → Check unsaved changes
                            ↓
                    If unsaved: Ask to save
                            ↓
                    Save (if needed)
                            ↓
                    Publish
```

---

## Key Features

✅ **Auto-Save**: Saves automatically after 1.2s of inactivity
✅ **Manual Save**: Click button for immediate save
✅ **Error Handling**: Automatic retry with exponential backoff
✅ **Status Indicator**: Real-time save status in header
✅ **Prevents Spam**: Debouncing prevents API spam
✅ **Concurrent Protection**: Prevents multiple simultaneous saves
✅ **User Warnings**: Unsaved changes warning on navigation
✅ **Validation**: Empty title rejection
✅ **Cleanup**: Proper cleanup on unmount

---

## Configuration

### Debounce Delay
```tsx
useSaveManager({
  debounceDelay: 1200, // 1.2 seconds
})
```

### Retry Attempts
```tsx
useSaveManager({
  maxRetries: 3,
})
```

### Callbacks
```tsx
useSaveManager({
  onError: (error) => console.error(error),
  onSuccess: () => console.log("Saved!"),
})
```

---

## Testing

### Auto-Save
1. Edit title
2. Wait 1.2 seconds
3. Verify "Saving..." appears
4. Verify "Saved just now" appears
5. Refresh page
6. Verify changes persisted

### Manual Save
1. Edit content
2. Click "Save" button
3. Verify button shows loading
4. Verify "Saved just now" appears

### Error Handling
1. Disconnect network
2. Try to save
3. Verify error message
4. Reconnect network
5. Verify auto-retry succeeds

### Publish
1. Edit page
2. Click "Publish"
3. Verify unsaved warning
4. Choose "Save first"
5. Verify page publishes

---

## Files

### Created
- `netlify/functions/pages-update.ts` - Enhanced backend
- `client/src/hooks/useSaveManager.ts` - Save manager hook
- `client/src/components/SaveStatus.tsx` - Status component
- `client/src/pages/PageEditor.tsx` - Enhanced editor

### Modified
- None (API client already supports theme)

---

## Status Indicators

| State | Icon | Color | Meaning |
|-------|------|-------|---------|
| Saved | ✓ | Green | All changes saved |
| Saving | ⏳ | Blue | Currently saving |
| Unsaved | ● | Orange | Has unsaved changes |
| Error | ⚠️ | Red | Save failed |

---

## Debounce Behavior

```
User types: A → B → C → D → E
                                    ↓ (1.2s delay)
                            Save triggered
```

Prevents API spam by waiting for user to stop typing.

---

## Retry Logic

```
Attempt 1: Fails
    ↓ (wait 1s)
Attempt 2: Fails
    ↓ (wait 2s)
Attempt 3: Fails
    ↓
Show error message
```

Exponential backoff: 1s, 2s, 4s (max 5s)

---

## Button States

### Save Button
- **Enabled**: Has unsaved changes
- **Disabled**: No unsaved changes or saving
- **Loading**: During save

### Publish Button
- **Enabled**: No unsaved changes
- **Disabled**: Has unsaved changes or saving
- **Loading**: During publish

---

## Error Messages

- "Failed to save. Please try again."
- "Page title cannot be empty"
- "Page not found or unauthorized"
- "Failed after 3 attempts: [error]"

---

## Performance

- **Debounce**: 1.2 seconds (configurable)
- **Retry**: 3 attempts with exponential backoff
- **Payload**: Only changed fields sent
- **Memory**: Proper cleanup on unmount

---

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

---

## Next Steps

1. Deploy backend function
2. Deploy frontend components
3. Test with network throttling
4. Monitor error logs
5. Gather user feedback
