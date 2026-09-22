# 🔄 Configuration Firestore — Synchronisation Multi-Appareils

## 📋 Vue d'ensemble

CoachingStudio synchronise maintenant les clients et entretiens en temps réel via Firestore. Chaque coach ne voit que ses propres données.

**Commit référence :** 2115f0a

---

## 🗄️ Collections à Créer

### 1. Collection `clients`
Structure d'un document client :
```json
{
  "id": "c1234567890",
  "coachUid": "firebase-uid-du-coach",
  "name": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "tel": "06 12 34 56 78",
  "profile": "À définir",
  "age": null,
  "objective": "Confiance en soi",
  "sessions": 2,
  "nextSession": "2026-09-25",
  "status": "actif",
  "notes": "Notes du coach...",
  "sessionHistory": ["Séance 1 — ...", "Séance 2 — ..."],
  "objectifs": [],
  "paiements": [],
  "intake": { /* optionnel */ }
}
```

**Index composite :** `clients.coachUid` (ASC)

---

### 2. Collection `sessions`
Structure d'une session/entretien :
```json
{
  "id": "s1234567890",
  "coachUid": "firebase-uid-du-coach",
  "clientId": "c1234567890",
  "date": "2026-09-22T14:30:00Z",
  "energy": 7,
  "notes": "Notes de la séance...",
  "branch": "cadrage",
  "branchLabel": "Cadrage du coaching",
  "option": { /* protocole sélectionné */ },
  "values": { /* réponses du client */ },
  "script": "<html>...</html>",
  "microAction": "Action à tester...",
  "ideaBox": "Idées du coach...",
  "followUp": "Suivi...",
  "intake": { /* profil du client */ }
}
```

**Index composite :** `sessions.coachUid` (ASC)

---

## 🔐 Règles de Sécurité (Firestore)

À appliquer dans **Firebase Console** → **Firestore** → **Règles** :

```javascript
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
    
    // ✅ FAMILLES & COACH LINKS (inchangé)
    match /familles/{familyCode} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /coachLinks/{shareCode} {
      allow read, write: if request.auth != null;
    }
    match /rdvRequests/{docId} {
      allow read, write: if true;
    }
  }
}
```

---

## 🔎 Index Composites (Firestore)

Les queries utilisant `.where()` nécessitent des indexes. Firestore propose de les créer automatiquement au premier appel.

Si des erreurs "FAILED_PRECONDITION" s'affichent, créer manuellement :

**Firebase Console** → **Firestore** → **Indexes** → **Composite Indexes** :

| Collection | Champs | Ordre |
|-----------|--------|-------|
| `clients` | `coachUid (ASC)` | ← Automatique |
| `sessions` | `coachUid (ASC)` | ← Automatique |

> **Note :** Firestore crée généralement l'index automatiquement après la première requête `.where()`. Patienter 1-2 min si erreur.

---

## 📱 Flux de Synchronisation

### Création de Client (Web/Mobile)
1. Formulaire rempli sur téléphone/tablette
2. `save()` → localStorage
3. `ClientsManager.saveClient()` → Firestore avec `coachUid`
4. onSnapshot listener → Tous les appareils reçoivent la mise à jour

### Modification de Session (Pendant un entretien)
1. Séance enregistrée sur une appareil
2. `ClientsManager.saveSession()` → Firestore
3. `state.sessions` mis à jour en temps réel
4. Autres appareils reçoivent le changement en ~500ms

### Fallback Offline
- Si Firestore est inaccessible → localStorage reste synché localement
- Lors du reconnexion → données relancées vers Firestore
- Pas de merge conflict car un seul coach par collection

---

## ⚙️ Configuration dans CoachingStudio

**ClientsManager** (index.html, ligne 1005+) :

```javascript
const ClientsManager = {
  listen(cb) {
    const uid = CoachLink.user?.uid;
    // Listeners : .where("coachUid", "==", uid)
    // Offline fallback : localStorage comme cache
  },
  
  saveClient(clientId, patch) {
    // Ajoute { coachUid: uid } automatiquement
    await firebase.firestore().collection("clients").doc(clientId).set(...);
  },
  
  saveSession(sessionId, data) {
    // Ajoute { coachUid: uid } automatiquement
    await firebase.firestore().collection("sessions").doc(sessionId).set(...);
  }
};
```

**Initialisation** (CoachLink.init()) :
```javascript
if (u) {
  if (!ClientsManager.data) ClientsManager.listen();
}
```

---

## ✅ Checklist de Déploiement

- [ ] Créer les 2 collections (`clients`, `sessions`) via Firebase Console
- [ ] Copier/paster les **Règles de Sécurité** ci-dessus
- [ ] Laisser Firestore créer les indexes automatiquement (1-2 min)
- [ ] Tester sur **téléphone** et **tablette** :
  - [ ] Créer un client
  - [ ] Laisser tourner 5 secondes
  - [ ] Rafraîchir sur l'autre appareil → Client visible
  - [ ] Modifier le client → Changement synchronisé
- [ ] Tester **offline** :
  - [ ] Couper WiFi/4G
  - [ ] Créer un entretien
  - [ ] Reconnecter → Données poussées vers Firestore

---

## 🐛 Dépannage

### "FAILED_PRECONDITION: The query requires an index"
→ Firestore crée l'index automatiquement. Patienter 1-2 min et réessayer.

### "Erreur sync" affiché en boucle
→ Vérifier les Règles de Sécurité (console navigateur → `console.error`)

### Données ne se synchent pas entre appareils
→ Vérifier que `CoachLink.user` est défini (coach connecté)
→ Vérifier que les deux appareils utilisent le même projet Firebase

### Sessions disparaissent après refresh
→ Normal si offline. Vérifier localStorage → `console.log(localStorage.getItem('cs4-sessions'))`

---

## 📊 Monitoring

**Firebase Console** → **Firestore** → **Utilisation** :
- Read ops : ~10-20/min par coach (listeners actifs)
- Write ops : ~1-5/min (créations/modifications)
- Coût : négligeable pour petit usage

---

**Dernière mise à jour :** commit 2115f0a
