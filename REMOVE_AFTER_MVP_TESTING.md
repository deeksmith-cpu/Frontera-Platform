# Temporary Features to Remove After MVP Testing

This file tracks temporary features added for MVP testing that should be removed before production.

## 🔄 Phase Navigation Buttons

**Added**: January 11-12, 2026
**Purpose**: Enable easy testing of all phases without manual database updates
**When to Remove**: After MVP testing is complete and agent-driven phase progression is implemented

### Files to Update:

1. **src/components/product-strategy-agent/CanvasPanel/CanvasHeader.tsx**
   - Remove `changePhase`, `handleNextPhase`, and `handlePreviousPhase` functions
   - Remove "Prev Phase (TEST)" and "Next Phase (TEST)" buttons from header controls
   - Remove conversation prop (or keep if needed for other features)
   - Search for: `TODO: REMOVE THIS AFTER MVP TESTING`

2. **src/app/api/product-strategy-agent/phase/route.ts**
   - **DELETE ENTIRE FILE** - This API route is only for testing
   - Phase updates should be driven by agent logic, not manual navigation

3. **src/components/product-strategy-agent/CanvasPanel/CanvasPanel.tsx**
   - Review if conversation prop to CanvasHeader is still needed
   - If not needed for other features, remove the prop

### Search Command:
```bash
# Find all temporary code marked for removal
grep -r "TODO: REMOVE THIS AFTER MVP TESTING" src/
```

### Replacement Strategy:

Phase progression should be driven by:
- Agent conversation logic determining when phase objectives are complete
- User confirmation prompts ("Ready to move to Research phase?")
- Automatic phase advancement based on completion criteria
- Phase progress stored in `phase_progress` table

---

## 📦 Storage Bypass for File Upload

**Added**: January 11, 2026
**Purpose**: Enable file upload testing without setting up Supabase Storage bucket
**When to Remove**: After creating 'strategy-materials' bucket in Supabase Storage

### Files to Update:

1. **src/app/api/product-strategy-agent/upload/route.ts**
   - Uncomment the storage upload code (lines ~141-160)
   - Remove the placeholder URL code (line ~164)
   - Test file upload with real storage

### Steps to Enable Real Storage:

1. **Create Storage Bucket in Supabase**:
   - Go to Storage in Supabase dashboard
   - Create new bucket: `strategy-materials`
   - Set to **private** (not public)

2. **Configure RLS Policies**:
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Users can upload to their org's folder"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'strategy-materials' AND
     auth.role() = 'authenticated'
   );

   -- Allow users to read their org's files
   CREATE POLICY "Users can read their org's files"
   ON storage.objects FOR SELECT
   USING (
     bucket_id = 'strategy-materials' AND
     auth.role() = 'authenticated'
   );
   ```

3. **Uncomment Storage Code** in upload route
4. **Test End-to-End** with real file upload

---

## 📋 Checklist Before Production:

- [ ] Remove "Prev Phase (TEST)" and "Next Phase (TEST)" buttons from CanvasHeader
- [ ] Delete `/api/product-strategy-agent/phase` route
- [ ] Implement agent-driven phase progression
- [ ] Add phase transition confirmations
- [ ] Test phase flow end-to-end with agent logic
- [ ] **Create 'strategy-materials' bucket in Supabase Storage**
- [ ] **Uncomment storage upload code in upload route**
- [ ] **Test file upload with real storage**
- [ ] Update BUILD_STATUS.md to remove temporary feature notes
- [ ] Delete this REMOVE_AFTER_MVP_TESTING.md file

---

**Last Updated**: January 12, 2026
