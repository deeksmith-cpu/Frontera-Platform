# Temporary Features to Remove After MVP Testing

This file tracks temporary features added for MVP testing that should be removed before production.

## 🔄 Phase Navigation Button

**Added**: January 11, 2026
**Purpose**: Enable easy testing of all phases without manual database updates
**When to Remove**: After MVP testing is complete and agent-driven phase progression is implemented

### Files to Update:

1. **src/components/product-strategy-agent/CanvasPanel/CanvasHeader.tsx**
   - Remove `handleNextPhase` function
   - Remove "Next Phase (TEST)" button from header controls
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

## 📋 Checklist Before Production:

- [ ] Remove "Next Phase (TEST)" button from CanvasHeader
- [ ] Delete `/api/product-strategy-agent/phase` route
- [ ] Implement agent-driven phase progression
- [ ] Add phase transition confirmations
- [ ] Test phase flow end-to-end with agent logic
- [ ] Update BUILD_STATUS.md to remove temporary feature notes
- [ ] Delete this REMOVE_AFTER_MVP_TESTING.md file

---

**Last Updated**: January 11, 2026
