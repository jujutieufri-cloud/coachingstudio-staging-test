#!/bin/bash
# 🤖 FIREBASE AUTOMATION SCRIPT
# Copy/paste this entire block into your terminal
# It will : login → select project → create indexes → deploy rules
# Takes ~5 minutes total

set -e  # Exit on any error

echo "🚀 Starting Firebase Setup Automation..."
echo ""

# ============================================================
# STEP 1: Install Firebase CLI (if not already done)
# ============================================================
echo "📦 Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    echo "   Installing firebase-tools globally..."
    npm install -g firebase-tools
    echo "   ✅ Installed"
else
    echo "   ✅ Already installed"
fi
echo ""

# ============================================================
# STEP 2: Login to Firebase
# ============================================================
echo "🔐 Logging in to Firebase..."
echo "   (A browser window will open — click 'Allow')"
firebase login
echo "   ✅ Logged in"
echo ""

# ============================================================
# STEP 3: Select project
# ============================================================
PROJECT_ID="la-clairiere-3e804"
echo "📍 Selecting project: $PROJECT_ID"
firebase use $PROJECT_ID
echo "   ✅ Project selected"
echo ""

# ============================================================
# STEP 4: Create Firestore indexes
# ============================================================
echo "📑 Creating Firestore indexes..."
echo ""

echo "   Creating index for clients.coachUid..."
firebase firestore:indexes:create \
  --collection="clients" \
  --field="coachUid" \
  --order="ASCENDING"
echo "   ✅ clients index created"
echo ""

echo "   Creating index for sessions.coachUid..."
firebase firestore:indexes:create \
  --collection="sessions" \
  --field="coachUid" \
  --order="ASCENDING"
echo "   ✅ sessions index created"
echo ""

# ============================================================
# STEP 5: Create firestore.rules file
# ============================================================
echo "📝 Creating Firestore rules file..."
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 🔒 CLIENTS — Isolation stricte par coach
    match /clients/{clientId} {
      allow read, write: if request.auth != null && resource.data.coachUid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.coachUid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.coachUid == request.auth.uid;
    }
    
    // 🔒 SESSIONS — Isolation stricte par coach
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && resource.data.coachUid == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.coachUid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.coachUid == request.auth.uid;
    }
    
    // ✅ SETTINGS — Paramètres du coach
    match /settings/coach {
      allow read, write: if request.auth != null;
    }
    
    // ✅ FAMILLES & COACH LINKS
    match /familles/{familyCode} {
      allow read, write: if request.auth != null;
    }
    match /coachLinks/{shareCode} {
      allow read, write: if request.auth != null;
    }
    match /rdvRequests/{docId} {
      allow read, write: if true;
    }
  }
}
EOF
echo "   ✅ firestore.rules created"
echo ""

# ============================================================
# STEP 6: Deploy Firestore rules
# ============================================================
echo "🚀 Deploying Firestore rules..."
firebase deploy --only firestore:rules
echo "   ✅ Rules deployed"
echo ""

# ============================================================
# STEP 7: Verify setup
# ============================================================
echo "✅ Verifying setup..."
echo ""
echo "   Listing indexes..."
firebase firestore:indexes:list
echo ""
echo "   (You should see 2 indexes: clients and sessions with coachUid)"
echo ""

# ============================================================
# DONE
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ FIREBASE SETUP COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo "  1. Open Firebase Console:"
echo "     https://console.firebase.google.com/u/0/project/la-clairiere-3e804/"
echo ""
echo "  2. Go to Firestore → Rules"
echo "     Verify the rules are there ✅"
echo ""
echo "  3. Go to Firestore → Indexes"
echo "     Verify both indexes are ENABLED ✅"
echo ""
echo "  4. Open CoachingStudio:"
echo "     https://coachingstudio.vercel.app"
echo ""
echo "  5. Test creating a client on one device"
echo "     See it appear on another device < 1 second"
echo ""
echo "Done! 🚀"
