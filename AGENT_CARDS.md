# 🤖 FICHES AGENTS — Sync Multi-Appareils CoachingStudio

---

## 🏗️ AGENT 1 — L'Architecte Système & Lead Tech

**Lead sur :** Architecture Firestore, indexes, sécurité, scalabilité
**Temps estimé :** 60 min
**Critique pour :** Tout le projet (bloquant si échoue)

### Tes tâches (dans l'ordre)

1. **Valider structure Firestore** (15 min)
   - Vérifier `collections/clients` et `collections/sessions` existent
   - Chaque doc client/session a `coachUid` ✅
   - Test requête : `.where("coachUid", "==", uid)` sans erreur "missing index"

2. **Créer les indexes** (5 min + 1-2 min attente)
   - Firebase Console → Firestore → Indexes
   - Status `coachUid (ASC)` → **ENABLED**
   - Si erreur "FAILED_PRECONDITION" : attendre 2 min et retry

3. **Publier Règles de Sécurité** (10 min)
   - Firebase Console → Firestore → Règles
   - Copy/paste depuis `FIRESTORE_SETUP.md`
   - Test : Coach A ≠ peut pas voir Coach B's clients

4. **Architecture offline** (20 min)
   - Lire `ClientsManager.listen()` pour comprendre fallback localStorage
   - Créer `OFFLINE_STRATEGY.md` (1 page)
   - Passer la main à Agent 5

### ⚠️ Blockers potentiels
- Index composite pas créé → Agent 3 va avoir des erreurs
- Règles mal appliquées → Coach A pourrait voir Coach B

### Avant de passer le flambeau
```
✅ Indexes activés (screenshot)
✅ Règles publiées et testées
✅ Architecture offline documentée
```

---

## 🎨 AGENT 2 — Designer UI/UX & Intégrateur Front-End

**Lead sur :** UX mobile, responsive, accessibilité
**Temps estimé :** 130 min (~2h)
**Critique pour :** Satisfaction utilisateur Julien

### Tes tâches (dans l'ordre)

1. **Tester responsive DevTools** (30 min)
   - Chrome DevTools → Device mode iPhone 15
   - Parcourir : Dashboard → Clients → Créer → Détails
   - Inputs ≥ 44px? Boutons tacticules? Landscape OK?
   - Screenshots des problèmes

2. **Tester sur VRAI téléphone** (45 min)
   - iPhone + Android (appareils réels ou emulateurs)
   - Formulaires longs : clavier cache inputs?
   - Taps réactifs? Pas de lag?
   - Rapport : "UX mobile réel vs DevTools"

3. **Affiner CSS** (30 min)
   - Lire media queries lignes 148-220 du code
   - Identifier 1-2 points qui se cassent
   - Créer `CSS_TWEAKS.md` avec fixes proposées
   - Passer à Agent 1 pour validation

4. **Accessibilité WCAG** (20 min)
   - Contraste texte? ≥ WCAG AA
   - Keyboard nav? Tab through all inputs
   - Labels explicites? Tous les inputs?
   - Résultat : 3-5 recommandations

### Pas besoin d'attendre
Tu peux travailler en parallèle pendant qu'Agent 1 fait indexes ✅

### Avant de crier victoire
```
✅ Responsive OK sur DevTools + vrai téléphone
✅ Pas de clavier qui cache inputs
✅ Accessibilité WCAG minimum
✅ CSS tweaks documentés
```

---

## 🔌 AGENT 3 — Développeur Back-End & API

**Lead sur :** Synchronisation, gestion erreurs, offline-first
**Temps estimé :** 110 min (~2h)
**Dépend de :** Agent 1 (indexes Firestore)

### Tes tâches (dans l'ordre)

1. **Valider sync Firestore ↔ localStorage** (20 min)
   - Console navigateur : `state.clients` et `state.sessions`
   - Créer client → localStorage se met à jour < 500ms ✅
   - state.clients rafraîchit automatiquement ✅
   - Logs d'erreur? Non ✅

2. **Tester les 3 points création client** (25 min)
   - **Point 1 :** Site public → `ClientsManager.saveClient()` appelé? ✅
   - **Point 2 :** Tab clients (form manuel) → `ClientsManager.saveClient()` appelé? ✅
   - **Point 3 :** Agenda → `ClientsManager.saveClient()` appelé? ✅
   - Vérifier chaque création arrive dans Firestore

3. **Tester offline mode** (30 min)
   - DevTools → Network → Offline
   - Créer client → localStorage fonctionne? ✅
   - Fermer app, revenir online, rafraîchir
   - Client existe? Sync en arrière-plan? ✅
   - Résultat : "Offline OK" ou liste des bugs

4. **Gestion erreurs de sync** (20 min)
   - Simuler erreur Firestore (couper WiFi, mauvaises règles)
   - Message d'erreur s'affiche (`notifCoach`)? ✅
   - localStorage pas perdu? ✅
   - Créer `ERROR_HANDLING.md` (cas gérés + cas manquants)

5. **Vérifier coachUid présent** (15 min)
   - Firestore Console → clients et sessions
   - 2-3 docs : `coachUid` présent? ✅
   - Test isolation : Coach A ≠ voir Coach B

### ⚠️ Attendus d'Agent 1
- Indexes Firestore ✅
- Règles de sécurité ✅

### Avant de passer à Agent 5
```
✅ Sync Firestore ↔ localStorage OK < 500ms
✅ 3 points créations testés
✅ Offline mode fonctionne
✅ Erreurs gérées + documentées
✅ coachUid attaché correctement
```

---

## ⚡ AGENT 4 — Informatologue & Spécialiste Performance/SEO

**Lead sur :** Performance, Core Web Vitals, optimisation
**Temps estimé :** 90 min (~1h30)
**Peut travailler en parallèle**

### Tes tâches (dans l'ordre)

1. **Mesurer Core Web Vitals** (20 min)
   - PageSpeed Insights : https://coachingstudio.vercel.app
   - Noter FCP, LCP, CLS (desktop + mobile)
   - Comparer "avant sync" vs "après sync"
   - Regression? Pas acceptable

2. **Profiler Firestore** (25 min)
   - DevTools → Network → Firestore
   - Taille requêtes? Nombre reads/writes par minute?
   - Pics de latence? Où?
   - Créer graph "Firestore Traffic"

3. **Optimiser taille docs** (20 min)
   - Analyser 5 clients dans Firestore
   - Champs voluméteux? (script HTML, notes longues)
   - Proposer compression ou archivage
   - Créer `FIRESTORE_OPTIMIZATION.md`

4. **Tester lazy loading sessions** (15 min)
   - Fiche client avec 50+ sessions
   - Toutes chargées d'un coup? Non ✅
   - Temps affichage initial? Mesurer
   - Proposer pagination si > 2s

5. **SEO & meta tags mobile** (10 min)
   - Viewport mobile correct? ✅
   - CLS au chargement? Pas de layout shift ✅
   - Fonts bloquent rendu? Non ✅
   - Checklist "SEO OK"

### Pas de dépendances bloquantes
Tu peux travailler tout de suite ✅

### Avant de déclarer victoire
```
✅ Core Web Vitals pas de regression
✅ Firestore profiling documenté
✅ Pas de doc > 1MB
✅ Lazy loading OK si > 50 sessions
✅ SEO checklist ✅
```

---

## 🧪 AGENT 5 — QA Tester & Reviewer de Code

**Lead sur :** Tests, bugs, edge cases, zéro bug en prod
**Temps estimé :** 165 min (~2h45)
**Dépend de :** Tous (commence après Agent 1 indexes OK)

### Tes tâches (dans l'ordre)

1. **Test multi-appareils réel** (45 min)
   - Ouvrir CoachingStudio sur 2 navigateurs (PC + mobile)
   - Coach A crée client → apparaît IMMÉDIATEMENT sur mobile ✅
   - Coach A modifie → change en < 1s sur autre appareil ✅
   - Latence mesurée et documentée

2. **Edge cases** (30 min)
   - Client nom avec accents/emojis? ✅
   - Notes > 5000 caractères? ✅
   - Créer 50 clients rapidement? Pas de merge conflict ✅
   - Supprimer client sur web → disparaît sur mobile < 2s ✅
   - Liste des bugs trouvés (priorité)

3. **Reconnexion après déco/reco** (25 min)
   - Coach logout
   - Coach login avec même compte
   - Clients rechargent correctement? ✅
   - Pas de doublon/corruption? ✅
   - Sessions récupérées? ✅

4. **Cross-device sync** (20 min)
   - Créer client sur iPhone
   - iPad → client visible immédiatement ✅
   - Modifier sur iPad
   - iPhone → modification visible < 1s ✅
   - Rapport "Cross-device sync ✅"

5. **Code review ClientsManager** (30 min)
   - Lire lignes 1005-1075
   - Gestion erreurs (try/catch)? ✅
   - Memory leaks (unsub() appelé)? ✅
   - Data race conditions? Non ✅
   - Fichier `CODE_REVIEW.md` + corrections

6. **Notifications sync** (15 min)
   - Créer client → "✅ Client synchronisé" s'affiche ✅
   - Disparaît en 3s ✅
   - Modifier client → notification s'affiche ✅
   - Pas de toasts qui se chevauchent ✅

### ⚠️ Attendus des autres agents
- Agent 1 : Indexes Firestore ✅
- Agent 3 : Sync fonctionne en conditions normales ✅
- Agents 2 & 4 : Pas de blockers sur UX

### Checklist finale pour Julien
```
✅ Sync multi-appareils OK (< 1s)
✅ Offline mode fonctionne
✅ Edge cases testés
✅ Reconnexion OK
✅ Cross-device OK
✅ Code review passé
✅ 0 bugs bloquants identifiés
✅ Prêt pour tests réels lundi
```

---

## 🎬 Timeline d'Exécution

```
PARALLÈLE (tout de suite)
├── Agent 1 (60 min)
├── Agent 2 (130 min) — indépendant
└── Agent 4 (90 min) — indépendant

APRÈS Agent 1 ✅
├── Agent 3 (110 min) — attend indexes
└── Agent 5 (165 min) — attend tout + mesure

CHECKPOINT
└── Samedi 23/09 17h : Tous les agents rendent rapports
└── Dimanche 24/09 09h : Intégration feedback
└── Lundi 25/09 09h : Go/No-Go pour test réel Julien
```

---

## 📲 Qui Contacte Qui

- **Agent 1 ↔ Agent 3 :** Indexes + règles Firestore
- **Agent 2 ↔ Agent 5 :** UX mobile tests
- **Agent 4 ↔ Tous :** Mesure performance après chacun
- **Agent 5 ↔ Tous :** Collecte résultats + QA final

---

**🚀 Prêts? À vous les agents!**
