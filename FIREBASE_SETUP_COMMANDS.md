# 🔧 Firebase Setup — Commandes CLI à Exécuter

**Status :** À faire maintenant (5-10 min)
**Project ID :** `la-clairiere-3e804`
**Qui :** Toi (Julien), dans ton terminal

---

## **Étape 0 — Installer Firebase CLI** (si pas déjà fait)

```bash
npm install -g firebase-tools
```

---

## **Étape 1 — Se connecter à Firebase**

```bash
firebase login
```

Cela ouvre un navigateur. Connecte-toi avec ton compte Google Firebase. ✅

---

## **Étape 2 — Sélectionner le projet**

```bash
firebase use la-clairiere-3e804
```

Résultat attendu :
```
Now using project la-clairiere-3e804
```

✅ Confirmed.

---

## **Étape 3 — Créer les indexes composites**

### 3a. Index pour `clients.coachUid`

```bash
firebase firestore:indexes:create \
  --collection="clients" \
  --field="coachUid" \
  --order="ASCENDING"
```

Résultat attendu :
```
✅ Created composite index for collection 'clients'
Index ID: [un-id-long]
```

### 3b. Index pour `sessions.coachUid`

```bash
firebase firestore:indexes:create \
  --collection="sessions" \
  --field="coachUid" \
  --order="ASCENDING"
```

---

## **Étape 4 — Publier les Règles de Sécurité**

### 4a. Créer le fichier de règles

Crée un fichier `firestore.rules` à la racine du projet :

```bash
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
```

Vérifie que le fichier existe :
```bash
cat firestore.rules | head -5
```

### 4b. Publier les règles

```bash
firebase deploy --only firestore:rules
```

Résultat attendu :
```
✅ Deployed firestore rules for database (default)
```

---

## **Étape 5 — Vérification finale**

### 5a. Vérifier les indexes

```bash
firebase firestore:indexes:list
```

Tu devrais voir :
```
Collection: clients
  - Field: coachUid (ASCENDING)  ✅ ENABLED

Collection: sessions
  - Field: coachUid (ASCENDING)  ✅ ENABLED
```

### 5b. Vérifier les règles

Ouvre **Firebase Console** → **Firestore** → **Règles**

Tu devrais voir le contenu des règles ci-dessus. ✅

---

## **Troubleshooting**

### "Command not found: firebase"
→ Installer Firebase CLI : `npm install -g firebase-tools`

### "You are not logged in"
→ Faire : `firebase login`

### "Project not found"
→ Vérifier : `firebase use la-clairiere-3e804`

### "Index creation failed"
→ Patienter 2 min et retry (Firestore indexing est async)

### "Permission denied" sur rules
→ Vérifier que tu es **Owner** du projet Firebase

---

## **Une fois terminé**

Envoie-moi :
```
✅ Indexes créés
✅ Règles publiées
✅ Aucune erreur
```

Je validerai l'état de Firebase et on passe à l'étape suivante. 🚀

---

**Est-ce clair? Tu as besoin d'aide pour une commande?**
