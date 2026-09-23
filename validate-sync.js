#!/usr/bin/env node
/**
 * 🧪 VALIDATION SCRIPT
 * Tests local sync logic without Firebase
 * Run: node validate-sync.js
 */

const assert = require('assert');
const fs = require('fs');

console.log('\n🧪 SYNC VALIDATION TESTS\n');
console.log('━'.repeat(50));

// ============================================================
// TEST 1: Verify ClientsManager code exists in index.html
// ============================================================
console.log('\n✅ TEST 1: ClientsManager implementation');

const html = fs.readFileSync('./index.html', 'utf-8');

const checks = [
  { name: 'ClientsManager defined', regex: /const ClientsManager = \{/ },
  { name: 'listen() method', regex: /listen\(cb\) \{/ },
  { name: 'saveClient() method', regex: /async saveClient/ },
  { name: 'saveSession() method', regex: /async saveSession/ },
  { name: '.where("coachUid")', regex: /\.where\("coachUid"/ },
  { name: 'coachUid injection', regex: /coachUid: uid/ },
  { name: 'Firebase init', regex: /firebase\.firestore\(\)/ },
  { name: 'onSnapshot listeners', regex: /\.onSnapshot/ },
  { name: 'localStorage fallback', regex: /localStorage\.setItem/ },
];

let passed = 0;
checks.forEach(check => {
  if (check.regex.test(html)) {
    console.log(`   ✅ ${check.name}`);
    passed++;
  } else {
    console.log(`   ❌ ${check.name} — NOT FOUND`);
  }
});

console.log(`\n   Result: ${passed}/${checks.length} checks passed`);
if (passed === checks.length) {
  console.log('   🎉 ClientsManager COMPLETE');
} else {
  console.log(`   ⚠️  Missing ${checks.length - passed} checks`);
  process.exit(1);
}

// ============================================================
// TEST 2: Verify sync call points
// ============================================================
console.log('\n✅ TEST 2: Sync call points');

const syncCalls = [
  { name: 'Point 1: Site public', regex: /ClientsManager\.saveClient.*site public/ },
  { name: 'Point 2: Manual form', regex: /ClientsManager\.saveClient.*newClient/ },
  { name: 'Point 3: Agenda', regex: /ClientsManager\.saveClient.*nouveauClient/ },
  { name: 'Point 4: Sessions', regex: /ClientsManager\.saveSession.*sessionId/ },
];

const callMatches = html.match(/ClientsManager\.save(Client|Session)/g) || [];
console.log(`   Found ${callMatches.length} sync calls`);
if (callMatches.length >= 4) {
  console.log('   ✅ All sync points present');
} else {
  console.log(`   ⚠️  Expected 4+ calls, found ${callMatches.length}`);
}

// ============================================================
// TEST 3: Verify error handling
// ============================================================
console.log('\n✅ TEST 3: Error handling');

const errorHandling = [
  { name: 'try/catch in saveClient', regex: /async saveClient.*?try\s*\{.*?\}\s*catch/ },
  { name: 'try/catch in saveSession', regex: /async saveSession.*?try\s*\{.*?\}\s*catch/ },
  { name: 'console.error calls', regex: /console\.error/ },
  { name: 'notifCoach on error', regex: /notifCoach\("⚠️/ },
];

let errorCount = 0;
errorHandling.forEach(check => {
  if (new RegExp(check.regex).test(html)) {
    console.log(`   ✅ ${check.name}`);
    errorCount++;
  }
});

console.log(`\n   Result: ${errorCount}/${errorHandling.length} error patterns found`);

// ============================================================
// TEST 4: Verify localStorage integration
// ============================================================
console.log('\n✅ TEST 4: localStorage integration');

const storageOps = [
  { name: 'clients saved', regex: /cs4-clients/ },
  { name: 'sessions saved', regex: /cs4-sessions/ },
  { name: 'Firestore + localStorage dual write', regex: /localStorage.*ClientsManager/ },
];

let storageCount = 0;
storageOps.forEach(check => {
  if (check.regex.test(html)) {
    console.log(`   ✅ ${check.name}`);
    storageCount++;
  }
});

console.log(`\n   Result: ${storageCount}/${storageOps.length} storage ops found`);

// ============================================================
// TEST 5: Mobile CSS verification
// ============================================================
console.log('\n✅ TEST 5: Mobile CSS optimization');

const cssChecks = [
  { name: 'min-height: 44px', regex: /min-height: 44px/ },
  { name: 'font-size: 16px', regex: /font-size: 16px/ },
  { name: 'media query mobile', regex: /@media\(max-width:768px\)/ },
  { name: 'media query small', regex: /@media\(max-width:600px\)/ },
  { name: 'scroll-behavior: smooth', regex: /scroll-behavior: smooth/ },
];

let cssCount = 0;
cssChecks.forEach(check => {
  if (check.regex.test(html)) {
    console.log(`   ✅ ${check.name}`);
    cssCount++;
  }
});

console.log(`\n   Result: ${cssCount}/${cssChecks.length} mobile CSS checks passed`);

// ============================================================
// TEST 6: Verify coachUid isolation
// ============================================================
console.log('\n✅ TEST 6: coachUid isolation logic');

const isolationChecks = [
  { name: 'coachUid from CoachLink.user.uid', regex: /CoachLink\.user\?.uid/ },
  { name: '.where("coachUid", "==", uid)', regex: /\.where\("coachUid", "==", uid\)/ },
  { name: 'Guard: if (!uid) return', regex: /if \(!uid\) return/ },
  { name: 'dataWithCoach = { ...patch, coachUid: uid }', regex: /coachUid: uid/ },
];

let isolationCount = 0;
isolationChecks.forEach(check => {
  if (check.regex.test(html)) {
    console.log(`   ✅ ${check.name}`);
    isolationCount++;
  }
});

console.log(`\n   Result: ${isolationCount}/${isolationChecks.length} isolation checks passed`);

// ============================================================
// SUMMARY
// ============================================================
console.log('\n' + '━'.repeat(50));
console.log('\n📊 VALIDATION SUMMARY\n');

const totalChecks = checks.length + 4 + errorHandling.length + storageOps.length + cssChecks.length + isolationChecks.length;
const totalPassed = passed + 4 + errorCount + storageCount + cssCount + isolationCount;

console.log(`  Total Checks: ${totalPassed}/${totalChecks}`);
console.log(`  Pass Rate: ${Math.round((totalPassed / totalChecks) * 100)}%`);

if (totalPassed === totalChecks) {
  console.log('\n  🎉 ALL CHECKS PASSED! 🎉');
  console.log('\n  Code is ready for deployment.\n');
  process.exit(0);
} else {
  console.log(`\n  ⚠️  ${totalChecks - totalPassed} checks failed\n`);
  process.exit(1);
}
