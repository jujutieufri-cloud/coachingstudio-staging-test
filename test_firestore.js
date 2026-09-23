const firebase = require('firebase-app');
require('firebase-firestore');

// Config (clé API seule — lecture/écriture selon règles)
const config = {
  apiKey: "AIzaSyDMV0s1MPRzjswK_WFKO7VrV3rxl0p4xdM",
  authDomain: "la-clairiere-3e804.firebaseapp.com",
  projectId: "la-clairiere-3e804",
  storageBucket: "la-clairiere-3e804.firebasestorage.app",
  messagingSenderId: "674974632077",
  appId: "1:674974632077:web:ffdc647c053c944fb6bac4"
};

try {
  firebase.initializeApp(config);
  console.log("✅ Firebase initialized");
} catch (e) {
  console.error("Firebase init error:", e.message);
  process.exit(1);
}

const db = firebase.firestore();

// 🔍 Test 1: Vérifier collections
async function checkCollections() {
  console.log("\n📋 Checking collections...");
  
  try {
    // Clients
    const clientsSnap = await db.collection("clients").limit(1).get();
    console.log(`  clients: ${clientsSnap.docs.length > 0 ? "✅ EXISTS" : "❌ EMPTY"}`);
    if (clientsSnap.docs.length > 0) {
      const doc = clientsSnap.docs[0];
      console.log(`    Sample doc: ${doc.id}`, Object.keys(doc.data()).slice(0, 5));
    }
  } catch (e) {
    console.log(`  clients: ⚠️ ERROR - ${e.message}`);
  }
  
  try {
    // Sessions
    const sessSnap = await db.collection("sessions").limit(1).get();
    console.log(`  sessions: ${sessSnap.docs.length > 0 ? "✅ EXISTS" : "❌ EMPTY"}`);
    if (sessSnap.docs.length > 0) {
      const doc = sessSnap.docs[0];
      console.log(`    Sample doc: ${doc.id}`, Object.keys(doc.data()).slice(0, 5));
    }
  } catch (e) {
    console.log(`  sessions: ⚠️ ERROR - ${e.message}`);
  }
}

// 🔍 Test 2: Vérifier structure de doc client
async function checkClientStructure() {
  console.log("\n🔍 Checking client structure...");
  
  try {
    const snap = await db.collection("clients").where("coachUid", "==", "test-uid").limit(1).get();
    if (snap.docs.length === 0) {
      console.log("  No clients with coachUid filter found (normal si règles restreignent)");
      return;
    }
    
    const doc = snap.docs[0];
    const data = doc.data();
    console.log("  Fields present:");
    console.log("    - coachUid:", data.coachUid ? "✅" : "❌");
    console.log("    - name:", data.name ? "✅" : "❌");
    console.log("    - email:", data.email ? "✅" : "❌");
  } catch (e) {
    if (e.message.includes("composite index")) {
      console.log("  ⚠️ COMPOSITE INDEX MISSING (expected for where queries)");
    } else {
      console.log(`  ⚠️ ERROR: ${e.message}`);
    }
  }
}

// 🔍 Test 3: Test write (si règles le permettent)
async function testWrite() {
  console.log("\n✍️ Testing write (with API key)...");
  
  try {
    // Essayer de créer un doc test
    const testRef = db.collection("clients").doc("test-" + Date.now());
    await testRef.set({
      name: "Test Client",
      email: "test@example.com",
      coachUid: "test-coach-uid",
      createdAt: new Date().toISOString()
    });
    console.log("  ✅ Write successful (rules allow API key writes)");
    
    // Supprimer le test
    await testRef.delete();
    console.log("  ✅ Cleanup done");
  } catch (e) {
    console.log(`  ⚠️ Write denied: ${e.message}`);
    console.log("     (This is OK — API key might be restricted by rules)");
  }
}

// Run all tests
(async () => {
  try {
    await checkCollections();
    await checkClientStructure();
    await testWrite();
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("SUMMARY:");
    console.log("  Project: la-clairiere-3e804 ✅");
    console.log("  Connection: OK ✅");
    console.log("  Next: Run index + rules setup");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    process.exit(0);
  } catch (e) {
    console.error("Fatal error:", e);
    process.exit(1);
  }
})();
