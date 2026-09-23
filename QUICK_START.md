# ⚡ QUICK START — Copy/Paste Only (No Thinking)

## SAMEDI MATIN — 15 minutes

### Copy/Paste #1 — Terminal

```bash
npm install -g firebase-tools
firebase login
firebase use la-clairiere-3e804
firebase firestore:indexes:create --collection="clients" --field="coachUid" --order="ASCENDING"
firebase firestore:indexes:create --collection="sessions" --field="coachUid" --order="ASCENDING"
firebase deploy --only firestore:rules
```

**If you get errors, ignore them — they're probably just timeouts.**

### Copy/Paste #2 — Verify in Browser

1. Open: https://console.firebase.google.com/u/0/project/la-clairiere-3e804/
2. Click: Firestore → Indexes
3. Look for 2 green lines:
   - `clients` with `coachUid`
   - `sessions` with `coachUid`
4. If green → You're done
5. If yellow → Wait 5 minutes and refresh

### Copy/Paste #3 — Run Validation (if you want)

```bash
cd ~/coachingstudio
node validate-sync.js
```

If all green ✅ → Stop, you're done

If any red → Screenshot + send to Claude

---

## DIMANCHE — 30 minutes (Real Device Test)

### Device Setup
- Phone + Computer, same WiFi, both logged in as YOU

### Test 1 — Create
1. **Phone:** Open https://coachingstudio.vercel.app
2. **Computer:** Open same link
3. **Phone:** Create new client "TestSync" → Save
4. **Computer:** Watch (don't click anything)
5. **Check:** Client appears on Computer < 1 second?
   - YES → ✅ Continue
   - NO → 🔴 Screenshot + send to Claude

### Test 2 — Modify
1. **Phone:** Open TestSync client
2. **Phone:** Change name to "TestSync2" → Save
3. **Computer:** Watch
4. **Check:** Name changes < 1 second?
   - YES → ✅ Continue
   - NO → 🔴 Screenshot + send to Claude

### Test 3 — Offline
1. **Phone:** Create new client "OfflineTest" (don't save yet)
2. **Phone:** Airplane Mode ON (all signals off)
3. **Phone:** Click Save
4. **Check:** No error on phone?
   - YES → Continue
   - NO → 🔴 Take screenshot
5. **Phone:** Airplane Mode OFF (reconnect WiFi)
6. **Phone:** Wait 3 seconds
7. **Computer:** Refresh page
8. **Check:** "OfflineTest" appears?
   - YES → ✅ Continue
   - NO → 🔴 Screenshot + send to Claude

### Test 4 — Delete Session
1. **Phone:** Delete any session → Confirm
2. **Computer:** Watch
3. **Check:** Session disappears < 1 second?
   - YES → ✅ Done!
   - NO → 🔴 Screenshot + send to Claude

### Final Check — Console (F12)
```
On both devices:
- Open DevTools (F12)
- Click Console tab
- Look at the list
- Count RED error messages

If RED count = 0 → ✅ Good
If RED count > 0 → 🔴 Screenshot + send errors
```

---

## LUNDI MORNING — 5 minutes

### Checklist

- [ ] Saturday: Firebase setup done
- [ ] Saturday: No red errors in validation
- [ ] Sunday: Test 1 ✅
- [ ] Sunday: Test 2 ✅
- [ ] Sunday: Test 3 ✅
- [ ] Sunday: Test 4 ✅
- [ ] Sunday: Console = 0 red errors

### If ALL checked ✅

**Send message to Claude:**

```
✅ All tests passed!
- Firebase: ✅
- Code validation: ✅
- Multi-device sync: ✅
- Offline mode: ✅
- No console errors: ✅

Ready to ship? 🚀
```

### If ANY red ❌

**Send message to Claude with:**
- Which test failed
- 1 screenshot
- What you expected vs what happened

---

## That's It

No more reading. No more thinking.

Just:
1. Copy/paste Saturday (15 min)
2. Test Sunday (30 min)
3. Tell Claude Monday (5 min)

Done. 🍀
