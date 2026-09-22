# ⚡ QUICK START — 1 Min par Agent

**Status :** 🟢 Sync Firestore implémentée (commit 2115f0a)
**Goal :** Valider + peaufiner avant lundi 25/09
**Timeline :** Samedi + dimanche

---

## 🏗️ AGENT 1 — GO/NO-GO Architecture (60 min)

**AUJOURD'HUI :**

1. Firebase Console → Firestore → Indexes
   - Status `coachUid (ASC)` = **ENABLED** ?
   - ✅ = Continue. ❌ = Attendre 2 min, retry

2. Firestore → Règles → Copy/paste depuis `FIRESTORE_SETUP.md`
   - Publier + test : Coach A ≠ voir Coach B
   - ✅ = Continue. ❌ = Fix règles

3. Créer `OFFLINE_STRATEGY.md` (1 page)
   - Lire `ClientsManager` lignes 1010-1042
   - Documenter fallback localStorage

**PUIS :** Envoyer checklist ✅ à Agent 3 + Équipe

---

## 🎨 AGENT 2 — Mobile UX (130 min)

**COMMENCER MAINTENANT (indépendant) :**

1. DevTools → Device mode iPhone 15 → Tester (30 min)
   - Dashboard → Clients → Créer → Détails
   - Inputs 44px+ ? Boutons réactifs ? Portrait/landscape OK ?

2. Vrai téléphone iPhone + Android (45 min)
   - Clavier cache inputs ? Taps laggy ?
   - Rapport : "Vrai device vs DevTools"

3. Lire CSS lignes 148-220, identifier cassures (30 min)
   - Créer `CSS_TWEAKS.md` (fixes proposées)
   - Passer Agent 1 pour valider

4. Accessibilité WCAG (20 min)
   - Contraste OK? Keyboard nav? Labels partout?

**PUIS :** Rendu samedi 17h

---

## 🔌 AGENT 3 — Backend Sync (110 min)

**ATTENDU :** Agent 1 donne ✅ indexes + règles

**FAIT ALORS :**

1. Console → `state.clients` + Firestore
   - Créer client → Firestore en < 500ms ? ✅

2. Tester 3 points créations (site + form + agenda)
   - `ClientsManager.saveClient()` appelé ? ✅

3. DevTools Network → Offline
   - Créer client offline → works ? ✅
   - Revenir online → sync auto ? ✅

4. Simuler erreur Firestore
   - Message s'affiche ? Data pas perdue ? ✅
   - Créer `ERROR_HANDLING.md`

5. Vérifier `coachUid` dans Firestore
   - Présent sur clients + sessions ? ✅

**PUIS :** Envoyer checklist ✅ à Agent 5

---

## ⚡ AGENT 4 — Performance (90 min)

**COMMENCER MAINTENANT (indépendant) :**

1. PageSpeed Insights → coachingstudio.vercel.app (20 min)
   - FCP, LCP, CLS desktop + mobile
   - Comparer avant/après (attendre rapport Agent 3)

2. DevTools → Firestore traffic (25 min)
   - Taille requêtes? Latence? Reads/writes par min?
   - Graph + observation

3. Firestore Console → Analyser 5 clients (20 min)
   - Champs gros ? (script, notes > 5KB)
   - Créer `FIRESTORE_OPTIMIZATION.md`

4. Fiche client 50+ sessions → Load time (15 min)
   - Toutes chargées ? Lazy loading OK ? Durée ?

5. SEO checks mobile (10 min)
   - Viewport OK ? CLS ? Fonts bloquent rendu ?

**PUIS :** Rendu samedi 17h

---

## 🧪 AGENT 5 — QA Final (165 min)

**ATTENDU :** Agent 1 ✅ indexes + Agent 3 ✅ sync OK

**FAIT ALORS :**

1. **2 navigateurs (PC + mobile) — Sync instantanée** (45 min)
   - Coach A crée → Coach A mobile la voit < 1s ? ✅
   - Modifie → change partout < 1s ? ✅
   - Mesurer latence réelle

2. **Edge cases** (30 min)
   - Accents/emojis ? 50 clients rapidos ? Supprimer = disparaît < 2s ?

3. **Reconnexion** (25 min)
   - Logout → Login → Clients rechargent ? Pas doublon ? ✅

4. **Cross-device** (20 min)
   - iPhone create → iPad voit immédiatement ? ✅

5. **Code review** (30 min)
   - ClientsManager lignes 1005-1075
   - Erreurs gérées ? Pas memory leaks ? Pas race condition ?

6. **Notifications** (15 min)
   - Sync toast s'affiche ? 3s puis disparaît ? Pas overlap ?

**PUIS :** Rendu dimanche + finale checklist OK/No-go

---

## 📅 Checkpoint

| Samedi 23/09 17h | Dimanche 24/09 09h | Lundi 25/09 09h |
|---|---|---|
| Rapports bruts | Intégration feedback | **GO/No-go final** |
| Agents 1,2,4 : ✅ ou ⚠️ | Fixing en cours | Tests réels Julien |
| Agent 3 : ✅ ou ⚠️ | Agent 5 checks tout | Appareils réels |
| Agent 5 : en cours | | |

---

## 🎯 Succès = Quoi?

```
✅ Sync < 1s entre 2 appareils
✅ Offline works (création + sync après reconnect)
✅ 0 crashes, 0 data loss
✅ Mobile UX OK (vrais appareils)
✅ Julien peut bosser lundi sans peur
```

---

**Qui fait quoi :**
- **Agent 1** : Architecture (bloquant pour tout)
- **Agents 2, 4** : Parallel
- **Agent 3** : Attend Agent 1, puis QA avec Agent 5
- **Agent 5** : Attend tout, valide tout

**Questions ?** Lire `TEAM_BRIEF.md` (complet)
