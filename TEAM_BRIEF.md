# 🎯 BRIEF ÉQUIPE — Sync Multi-Appareils CoachingStudio

**Status :** ✅ Commit 2115f0a — Implémentation Option A (Sync Temps Réel Firestore)
**Deadline :** Tests en condition réelle lundi 25/09
**Context :** Julien remplit les fiches clients sur mobile/tablette avec sync instantanée

---

## 📊 Répartition des Tâches par Agent

### 🏗️ **AGENT 1 — L'Architecte Système & Lead Tech**

**Responsabilité :** Architecture Firestore, indexes, sécurité, scalabilité

#### Tâches atomiques :

**1.1 | Valider la structure Firestore** [ATOMIQUE — 15 min]
- [ ] Vérifier `collections/clients` et `collections/sessions`
- [ ] Valider les champs `coachUid` sur chaque document
- [ ] Tester requête `.where("coachUid", "==", uid)` 
- [ ] Résultat : Aucune erreur "missing index"

**1.2 | Créer les indexes composites** [ATOMIQUE — 5 min + attente 1-2min]
- [ ] Accéder Firebase Console → Firestore → Indexes
- [ ] Vérifier que les 2 indexes `coachUid (ASC)` sont activés
- [ ] Screenshot du status "ENABLED"
- [ ] Passer la main à Agent 3 si erreurs d'index

**1.3 | Valider les Règles de Sécurité** [ATOMIQUE — 10 min]
- [ ] Copy/paste les règles depuis `FIRESTORE_SETUP.md` lignes XXX
- [ ] Publier dans Firebase Console → Firestore → Règles
- [ ] Tester accès : Coach A ne doit PAS voir clients du Coach B
- [ ] Documenter le résultat du test

**1.4 | Architecture de fallback offline** [ATOMIQUE — 20 min]
- [ ] Lire `ClientsManager.listen()` lignes 1010-1042
- [ ] Vérifier que localStorage est bien utilisé comme cache local
- [ ] Identifier 2-3 scénarios offline critiques
- [ ] Créer `OFFLINE_STRATEGY.md` (1 page max)
- [ ] Passer la main à Agent 5 pour les tests

---

### 🎨 **AGENT 2 — Designer UI/UX & Intégrateur Front-End**

**Responsabilité :** UX mobile, responsive, accessibilité, animations

#### Tâches atomiques :

**2.1 | Tester responsive mobile 📱** [ATOMIQUE — 30 min]
- [ ] Ouvrir DevTools → device mode iPhone 15
- [ ] Parcourir : Dashboard → Clients → Créer Client → Détails
- [ ] Vérifier : inputs min 44px, boutons tactiles, espace entre doigts
- [ ] Tester portrait + landscape
- [ ] Résultat : Screenshots + observations

**2.2 | Tester sur vrai téléphone** [ATOMIQUE — 45 min]
- [ ] Ouvrir https://coachingstudio.vercel.app sur **iPhone** + **Android**
- [ ] Parcourir formulaires longs
- [ ] Vérifier clavier virtuel ne cache pas les inputs
- [ ] Test tactile : boutons répondent au premier tap
- [ ] Résultat : Rapport "UX mobile réel vs DevTools"

**2.3 | Affiner CSS responsive** [ATOMIQUE — 30 min]
- [ ] Lire les media queries ajoutées lignes 148-220
- [ ] Identifier 1-2 points où le layout se casse
- [ ] Créer `CSS_TWEAKS.md` (liste des fixes proposées)
- [ ] Passer la main à Agent 1 pour validation avant push

**2.4 | Accessibilité WCAG mobile** [ATOMIQUE — 20 min]
- [ ] Vérifier contraste texte/fond sur mobile (WCAG AA minimum)
- [ ] Tester au clavier : Tab through all inputs
- [ ] Vérifier labels explicites sur tous les inputs
- [ ] Résultat : 3-5 recommandations concrètes

---

### 🔌 **AGENT 3 — Développeur Back-End & API**

**Responsabilité :** Synchronisation, gestion erreurs, offline-first

#### Tâches atomiques :

**3.1 | Valider la sync Firestore → localStorage** [ATOMIQUE — 20 min]
- [ ] Ouvrir console → `state.clients` et `state.sessions`
- [ ] Créer un client sur web/mobile
- [ ] Vérifier : localStorage se met à jour en < 500ms
- [ ] Vérifier : state.clients rafraîchit automatiquement
- [ ] Résultat : "✅ Sync OK" ou logs d'erreur

**3.2 | Tester les 3 points de création clients** [ATOMIQUE — 25 min]
- [ ] Point 1 : Client du site public → `ClientsManager.saveClient()` appelé
- [ ] Point 2 : Création manuelle (tab clients) → `ClientsManager.saveClient()` appelé
- [ ] Point 3 : Création via agenda → `ClientsManager.saveClient()` appelé
- [ ] Vérifier : chaque création arrive bien dans Firestore
- [ ] Résultat : Traces console + document Firestore visible

**3.3 | Tester offline mode** [ATOMIQUE — 30 min]
- [ ] Ouvrir DevTools → Network → Offline
- [ ] Créer un client (doit fonctionner localement)
- [ ] Fermer l'app, revenir online, rafraîchir
- [ ] Vérifier : client existe toujours + synchro en arrière-plan
- [ ] Résultat : Scénario offline "✅ OK" ou points de blocage

**3.4 | Gestion des erreurs de sync** [ATOMIQUE — 20 min]
- [ ] Simuler erreur Firestore (règles de sécurité, quota)
- [ ] Vérifier message d'erreur s'affiche (notifCoach)
- [ ] Vérifier localStorage n'est pas perdu
- [ ] Créer `ERROR_HANDLING.md` (liste des cas gérés)
- [ ] Passer à Agent 5

**3.5 | Vérifier coachUid attaché correctement** [ATOMIQUE — 15 min]
- [ ] Ouvrir Firestore Console
- [ ] Vérifier 2-3 clients : `coachUid` présent et correct
- [ ] Vérifier 2-3 sessions : `coachUid` présent et correct
- [ ] Test d'isolation : Coach A ne peut pas lire Coach B

---

### ⚡ **AGENT 4 — Informatologue & Spécialiste Performance/SEO**

**Responsabilité :** Performance, Core Web Vitals, optimisation Firestore

#### Tâches atomiques :

**4.1 | Mesurer Core Web Vitals avant/après** [ATOMIQUE — 20 min]
- [ ] Ouvrir PageSpeed Insights : https://coachingstudio.vercel.app
- [ ] Noter FCP, LCP, CLS sur desktop + mobile
- [ ] Mesurer temps d'ouverture des onglets (Clients, Détails, etc.)
- [ ] Résultat : Rapport "Avant sync" vs "Après sync"

**4.2 | Profiler les listeners Firestore** [ATOMIQUE — 25 min]
- [ ] Ouvrir DevTools → Network
- [ ] Filtrer firestore → Mesurer taille requêtes
- [ ] Compter nombre de reads/writes par minute
- [ ] Identifier pics de latence
- [ ] Résultat : Graph "Firestore Traffic" + observations

**4.3 | Optimiser taille des documents** [ATOMIQUE — 20 min]
- [ ] Analyser 5 clients : contenu utile vs redondant
- [ ] Identifier champs voluméteux (script HTML, notes longues)
- [ ] Proposer compression ou archivage
- [ ] Créer `FIRESTORE_OPTIMIZATION.md`

**4.4 | Tester lazy loading des sessions** [ATOMIQUE — 15 min]
- [ ] Ouvrir fiche client avec 50+ sessions
- [ ] Vérifier que toutes les sessions ne sont pas chargées d'un coup
- [ ] Mesurer temps d'affichage initial
- [ ] Résultat : Temps réel + recommandations pagination

**4.5 | SEO & Meta tags** [ATOMIQUE — 10 min]
- [ ] Vérifier viewport mobile est correctement configuré
- [ ] Vérifier pas de CLS (Cumulative Layout Shift) au chargement
- [ ] Vérifier fonts ne bloquent pas le rendu
- [ ] Résultat : Checklist "SEO OK"

---

### 🧪 **AGENT 5 — QA Tester & Reviewer de Code**

**Responsabilité :** Tests, bugs, edge cases, fiabilité

#### Tâches atomiques :

**5.1 | Tester scénario multi-appareils réel** [ATOMIQUE — 45 min]
- [ ] Ouvrir CoachingStudio sur 2 navigateurs (PC + mobile)
- [ ] Coach A crée un client
- [ ] Vérifier qu'il apparaît IMMÉDIATEMENT sur l'autre appareil
- [ ] Coach A modifie client → Coach A's mobile rafraîchit
- [ ] Résultat : "✅ Sync OK" ou "Latence X ms"

**5.2 | Tester cas limites (edge cases)** [ATOMIQUE — 30 min]
- [ ] Créer client avec caractères spéciaux (accents, emojis)
- [ ] Créer client avec notes > 5000 caractères
- [ ] Créer 50 clients rapidement → pas de merge conflict
- [ ] Supprimer client sur web → disparaît sur mobile en < 2s
- [ ] Résultat : Liste des bugs trouvés (priorité)

**5.3 | Tester reconnexion après déco/reco** [ATOMIQUE — 25 min]
- [ ] Déconnecter le coach (logout)
- [ ] Reconnecter avec même compte
- [ ] Vérifier clients re-chargent correctement
- [ ] Vérifier pas de doublon/data corruption
- [ ] Résultat : "Reconnexion ✅ OK"

**5.4 | Tester changement d'appareil** [ATOMIQUE — 20 min]
- [ ] Créer client sur iPhone
- [ ] Ouvrir l'app sur iPad → client visible
- [ ] Modifier client sur iPad
- [ ] Revenir iPhone → modification visible
- [ ] Résultat : Rapport "Cross-device sync ✅"

**5.5 | Code review — ClientsManager** [ATOMIQUE — 30 min]
- [ ] Lire `ClientsManager.listen()` lignes 1010-1042
- [ ] Vérifier gestion d'erreurs (try/catch, console.error)
- [ ] Vérifier pas de memory leaks (unsub() bien appelé)
- [ ] Vérifier pas de data race conditions
- [ ] Résultat : `CODE_REVIEW.md` + liste corrections

**5.6 | Tester notifications "sync"** [ATOMIQUE — 15 min]
- [ ] Créer client → doit afficher "✅ Client synchronisé"
- [ ] Attendre 3s → notification disparaît
- [ ] Modifier client → "✅ Client synchronisé"
- [ ] Vérifier pas de toasts qui se chevauchent
- [ ] Résultat : "Notifications UX ✅"

---

## 🎯 Dépendances Inter-Équipe

```
Agent 1 (Architecture)
    ↓
    ├→ Agent 3 (Backend) — Attend indexes de Agent 1
    │   ├→ Agent 5 (Tests offline) — Attend code de Agent 3
    │   └→ Agent 4 (Performance) — Mesure après Agent 3
    │
    ├→ Agent 2 (Frontend) — Peut travailler en parallèle
    │   └→ Agent 5 (Tests UX) — Attend polish de Agent 2
    │
    └→ Agent 4 (Performance) — Mesure architecture de Agent 1

Agent 5 (QA) ← Collecte résultats de tous
```

**Chemin critique :**
1. Agent 1 : Indexes Firestore ✅
2. Agent 3 : Valider sync
3. Agent 5 : Tests complets
4. Tous : Go/No-Go avant lundi

---

## ✅ Checklist d'Équipe

- [ ] Agent 1 : Architecture validée
- [ ] Agent 2 : UX mobile testé sur vrais appareils
- [ ] Agent 3 : Sync Firestore + offline mode OK
- [ ] Agent 4 : Performance mesurée, pas de regression
- [ ] Agent 5 : Tous les tests passent, 0 blockers

---

## 📝 Livrables Attendus

Chaque agent doit produire :
1. **Code** : Push sur `main` via commit explicite
2. **Documentation** : `.md` ou commentaires inline
3. **Résultat** : "✅ OK" ou "⚠️ À fixer" + détail

**Deadline rapports :** Dimanche 24/09 18h
**Deadline push final :** Lundi 25/09 09h avant tests réels

---

## 🚀 Après cette phase

Une fois tous les tests Agent 5 ✅ :
- Julien teste sur mobile/tablette en vrai
- Collecter retours utilisateur
- Itération rapide semaine du 25/09

---

**Lancé par :** Claude (Orchestrateur)
**Date :** 2026-09-22
**Commit de référence :** 2115f0a
