# Feuille de Route - IdeaNoter

**Version actuelle :** 0.1.0
**Dernière mise à jour :** 14 novembre 2025

---

## Vue d'ensemble

IdeaNoter est une application de prise de notes simple et élégante. Cette feuille de route définit les fonctionnalités potentielles pour transformer l'application en un outil de productivité complet tout en préservant sa simplicité d'utilisation.

---

## Fonctionnalités actuelles

- ✅ Création, édition et suppression de notes
- ✅ Éditeur de texte riche (gras, italique, listes, citations, code)
- ✅ Système de tags avec filtrage
- ✅ Recherche en temps réel
- ✅ Épinglage de notes
- ✅ 10 couleurs personnalisées pour les notes
- ✅ Titres optionnels
- ✅ Affichage de la date de création
- ✅ Persistance locale (localStorage)
- ✅ Interface responsive
- ✅ Interface entièrement en français

---

## Phase 1 - Améliorations de base (Court terme - 1-2 mois)

### 🎨 Personnalisation

**Priorité : Haute**

- [ ] **Choix manuel de la couleur de note**
  - Permettre aux utilisateurs de choisir ou modifier la couleur d'une note
  - Ajouter un sélecteur de couleur dans le formulaire d'édition
  - Valeur ajoutée : Organisation visuelle personnalisée

- [ ] **Mode sombre**
  - Implémenter un thème sombre avec basculement
  - Adapter les 10 couleurs de notes pour le mode sombre
  - Valeur ajoutée : Confort visuel et utilisation de nuit

- [ ] **Taille de police ajustable**
  - Ajouter 3 tailles (petit, moyen, grand)
  - Paramètre global dans les préférences
  - Valeur ajoutée : Accessibilité

### 📁 Organisation avancée

**Priorité : Haute**

- [ ] **Dossiers/Catégories**
  - Créer des dossiers pour organiser les notes
  - Navigation par dossier dans la barre latérale
  - Possibilité de déplacer les notes entre dossiers
  - Valeur ajoutée : Organisation hiérarchique pour grandes quantités de notes

- [ ] **Favoris**
  - Marquer des notes comme favorites (étoile)
  - Vue dédiée "Favoris"
  - Différent de l'épinglage (épinglé = en haut, favori = important)
  - Valeur ajoutée : Accès rapide aux notes importantes

- [ ] **Archivage de notes**
  - Archiver des notes sans les supprimer
  - Vue "Archives" séparée
  - Bouton "Restaurer" pour désarchiver
  - Valeur ajoutée : Garder l'historique sans encombrer la vue principale

### 🔍 Recherche améliorée

**Priorité : Moyenne**

- [ ] **Recherche avancée**
  - Recherche dans les titres ET le contenu
  - Filtres combinés (tags + recherche + couleur + date)
  - Recherche par plage de dates
  - Valeur ajoutée : Retrouver rapidement n'importe quelle note

- [ ] **Suggestions de tags**
  - Suggestions automatiques basées sur les tags existants
  - Autocomplétion lors de la saisie de tags
  - Valeur ajoutée : Cohérence des tags et gain de temps

### ⚡ Expérience utilisateur

**Priorité : Haute**

- [ ] **Raccourcis clavier**
  - `Ctrl + N` : Nouvelle note
  - `Ctrl + F` : Rechercher
  - `Ctrl + S` : Sauvegarder (feedback visuel)
  - `Échap` : Fermer modal
  - `Ctrl + E` : Éditer note sélectionnée
  - Valeur ajoutée : Productivité accrue pour utilisateurs avancés

- [ ] **Drag & Drop pour réorganiser**
  - Réorganiser l'ordre des notes par glisser-déposer
  - Maintenir l'ordre personnalisé
  - Valeur ajoutée : Organisation manuelle intuitive

- [ ] **Confirmation avant suppression**
  - Modal de confirmation "Êtes-vous sûr ?"
  - Option "Ne plus demander"
  - Valeur ajoutée : Éviter les suppressions accidentelles

---

## Phase 2 - Fonctionnalités avancées (Moyen terme - 3-5 mois)

### ✅ Productivité

**Priorité : Haute**

- [ ] **Listes de tâches interactives**
  - Cases à cocher cliquables dans les notes
  - Indicateur de progression (3/5 tâches complétées)
  - Filtre pour voir uniquement les notes avec tâches incomplètes
  - Valeur ajoutée : Transformation en outil de gestion de tâches

- [ ] **Templates de notes**
  - Créer et sauvegarder des modèles réutilisables
  - Templates prédéfinis (réunion, idée, todo, journal)
  - Valeur ajoutée : Gain de temps pour notes récurrentes

- [ ] **Notes liées**
  - Créer des liens entre notes avec `[[nom de note]]`
  - Navigation entre notes liées
  - Vue graphique des connexions
  - Valeur ajoutée : Création d'un réseau de connaissances (type Obsidian)

- [ ] **Rappels et alarmes**
  - Définir une date/heure de rappel sur une note
  - Notification navigateur au moment voulu
  - Vue "Rappels à venir"
  - Valeur ajoutée : Ne jamais oublier une tâche importante

### 📊 Vues alternatives

**Priorité : Moyenne**

- [ ] **Vue liste compacte**
  - Basculer entre grille et liste
  - Liste affiche plus d'informations (tags, date, extrait)
  - Valeur ajoutée : Meilleure vue d'ensemble pour nombreuses notes

- [ ] **Vue Kanban**
  - Colonnes personnalisables (À faire, En cours, Terminé)
  - Glisser-déposer entre colonnes
  - Valeur ajoutée : Gestion de projet visuelle

- [ ] **Vue calendrier**
  - Notes organisées par date de création
  - Vue mensuelle
  - Valeur ajoutée : Journal temporel des idées

### 📤 Import / Export

**Priorité : Haute**

- [ ] **Export PDF**
  - Exporter une note en PDF
  - Export groupé (sélection ou toutes)
  - Mise en page propre avec logo
  - Valeur ajoutée : Partage professionnel

- [ ] **Export Markdown**
  - Convertir notes en fichiers .md
  - Conservation de la structure (titres, listes, formatage)
  - Valeur ajoutée : Compatibilité avec autres outils

- [ ] **Sauvegarde complète**
  - Export JSON de toutes les notes et paramètres
  - Import pour restauration
  - Sauvegarde automatique hebdomadaire
  - Valeur ajoutée : Protection des données

### 🔒 Sécurité et confidentialité

**Priorité : Moyenne**

- [ ] **Verrouillage par mot de passe**
  - Protection de l'application par code PIN
  - Verrouillage automatique après inactivité
  - Valeur ajoutée : Confidentialité sur appareils partagés

- [ ] **Notes privées**
  - Marquer des notes comme "privées"
  - Notes privées cachées par défaut
  - Déverrouillage par mot de passe
  - Valeur ajoutée : Protection des informations sensibles

---

## Phase 3 - Fonctionnalités premium (Long terme - 6-12 mois)

### ☁️ Synchronisation et collaboration

**Priorité : Très haute (différenciateur majeur)**

- [ ] **Synchronisation cloud**
  - Sauvegarde automatique sur serveur
  - Synchronisation multi-appareils
  - Backend avec Firebase ou Supabase
  - Valeur ajoutée : Accès depuis n'importe où

- [ ] **Comptes utilisateurs**
  - Authentification par email
  - OAuth (Google, GitHub)
  - Profil utilisateur
  - Valeur ajoutée : Base pour fonctionnalités collaboratives

- [ ] **Partage de notes**
  - Générer lien de partage public
  - Partage avec permissions (lecture/édition)
  - Collaboration en temps réel
  - Valeur ajoutée : Travail d'équipe

### 🎨 Médias et contenu enrichi

**Priorité : Moyenne**

- [ ] **Support des images**
  - Glisser-déposer d'images
  - Stockage optimisé (compression)
  - Galerie d'images par note
  - Valeur ajoutée : Notes visuelles riches

- [ ] **Enregistrement audio**
  - Enregistrer notes vocales directement
  - Lecteur audio intégré
  - Transcription automatique (API)
  - Valeur ajoutée : Capture rapide d'idées vocales

- [ ] **Pièces jointes**
  - Attacher fichiers (PDF, DOCX, etc.)
  - Téléchargement et aperçu
  - Limite de taille configurable
  - Valeur ajoutée : Centralisation des documents

- [ ] **Dessins et croquis**
  - Canvas de dessin intégré
  - Outils de base (stylo, surligneur, formes)
  - Export en image
  - Valeur ajoutée : Notes visuelles et schémas

### 📱 Applications natives

**Priorité : Moyenne-Haute**

- [ ] **Progressive Web App (PWA)**
  - Installation sur mobile/desktop
  - Fonctionnement hors ligne
  - Notifications push
  - Valeur ajoutée : Expérience application native

- [ ] **Application mobile dédiée**
  - React Native ou Flutter
  - Widget pour écran d'accueil
  - Capture rapide
  - Valeur ajoutée : Meilleure intégration mobile

### 📈 Analytics et insights

**Priorité : Basse-Moyenne**

- [ ] **Statistiques d'utilisation**
  - Nombre de notes créées par jour/semaine/mois
  - Tags les plus utilisés
  - Temps de productivité
  - Valeur ajoutée : Comprendre ses habitudes

- [ ] **Recherche intelligente**
  - Suggestions basées sur IA
  - Regroupement automatique de notes similaires
  - Extraction de mots-clés
  - Valeur ajoutée : Organisation assistée par IA

### 🔧 Fonctionnalités avancées

**Priorité : Basse**

- [ ] **Historique de versions**
  - Sauvegarde de chaque modification
  - Retour à version antérieure
  - Comparaison de versions
  - Valeur ajoutée : Sécurité et traçabilité

- [ ] **API publique**
  - API REST pour accès externe
  - Webhooks pour intégrations
  - Documentation complète
  - Valeur ajoutée : Écosystème d'intégrations

- [ ] **Plugins et extensions**
  - Système de plugins
  - Marketplace communautaire
  - SDK pour développeurs
  - Valeur ajoutée : Extensibilité infinie

---

## Phase 4 - Optimisations et performance

### ⚡ Performance

**Priorité : Haute (si >1000 notes)**

- [ ] **Virtualisation de liste**
  - Rendu uniquement des notes visibles
  - Support de milliers de notes
  - Valeur ajoutée : Performances avec grandes collections

- [ ] **Recherche indexée**
  - Index de recherche local (Fuse.js ou similaire)
  - Recherche instantanée même avec 10k+ notes
  - Valeur ajoutée : Rapidité à grande échelle

- [ ] **Lazy loading des médias**
  - Chargement différé des images
  - Miniatures optimisées
  - Valeur ajoutée : Temps de chargement réduit

### 🧪 Qualité et maintenance

**Priorité : Moyenne**

- [ ] **Tests automatisés**
  - Tests unitaires (Jest)
  - Tests end-to-end (Playwright)
  - CI/CD
  - Valeur ajoutée : Fiabilité et maintenabilité

- [ ] **Monitoring des erreurs**
  - Sentry ou similaire
  - Logs structurés
  - Alertes automatiques
  - Valeur ajoutée : Détection proactive des problèmes

---

## Fonctionnalités "Nice to Have"

Ces fonctionnalités sont intéressantes mais non prioritaires :

- **Mode zen/focus** : Masquer interface pour se concentrer sur l'écriture
- **Thèmes personnalisés** : Créer ses propres palettes de couleurs
- **Export vers Notion/Evernote** : Migration facile
- **Dictée vocale** : Dicter au lieu de taper
- **Traduction intégrée** : Traduire notes instantanément
- **Mode lecture** : Vue épurée sans édition
- **Impression optimisée** : Mise en page pour impression papier
- **Nuage de tags** : Visualisation des tags par fréquence
- **Notes géolocalisées** : Associer position GPS
- **Mode collaboratif temps réel** : Édition simultanée à plusieurs

---

## Critères de priorisation

Les fonctionnalités sont priorisées selon :

1. **Impact utilisateur** : Améliore-t-elle significativement l'expérience ?
2. **Complexité technique** : Quelle difficulté de mise en œuvre ?
3. **Différenciation** : Est-ce unique par rapport à la concurrence ?
4. **Demande utilisateurs** : Les utilisateurs la demandent-ils ?
5. **Cohérence** : S'intègre-t-elle naturellement dans l'app ?

---

## Stratégie de monétisation (optionnel)

Si vous souhaitez monétiser IdeaNoter :

### Version gratuite
- Jusqu'à 100 notes
- Toutes fonctionnalités de base
- Stockage local uniquement

### Version Premium (5-10€/mois)
- Notes illimitées
- Synchronisation cloud
- Partage et collaboration
- Export PDF
- Support prioritaire
- Thèmes premium
- 10 GB de stockage

### Version Équipe (20€/mois/utilisateur)
- Tout Premium +
- Espaces de travail partagés
- Permissions avancées
- Analytics d'équipe
- SSO entreprise
- Audit logs

---

## Technologies à considérer

Pour implémenter ces fonctionnalités :

- **Authentification** : NextAuth.js, Clerk, Supabase Auth
- **Base de données** : Supabase, Firebase, PlanetScale
- **Recherche** : Fuse.js, MiniSearch, Algolia
- **Éditeur avancé** : Tiptap, Slate, ProseMirror
- **Drag & Drop** : dnd-kit, react-beautiful-dnd
- **PDF Export** : jsPDF, react-pdf
- **Graphiques** : Recharts, Chart.js
- **IA** : OpenAI API, Anthropic Claude API
- **Mobile** : React Native, Capacitor, Flutter

---

## Roadmap visuelle

```
2025 Q1 (Jan-Mar)
├─ ✅ Éditeur riche
├─ ✅ Système de tags
└─ ✅ Recherche et filtres

2025 Q2 (Avr-Juin)  [Phase 1]
├─ Mode sombre
├─ Choix de couleurs
├─ Dossiers
├─ Raccourcis clavier
└─ Favoris

2025 Q3 (Jul-Sep)  [Phase 2]
├─ Listes de tâches
├─ Templates
├─ Export PDF/Markdown
├─ Vue liste
└─ Rappels

2025 Q4 (Oct-Déc)  [Phase 3]
├─ Synchronisation cloud
├─ Comptes utilisateurs
├─ PWA
├─ Support images
└─ Partage de notes

2026 Q1+  [Phase 4]
├─ Application mobile
├─ Collaboration temps réel
├─ IA assistante
└─ Marketplace plugins
```

---

## Conclusion

Cette feuille de route transforme IdeaNoter d'une simple application de notes en un **outil de productivité complet et moderne**, tout en préservant sa simplicité d'utilisation initiale.

**Prochaines étapes recommandées :**
1. Implémenter le mode sombre (demande fréquente, impact rapide)
2. Ajouter les dossiers (organisation essentielle)
3. Développer les raccourcis clavier (productivité)
4. Préparer l'infrastructure cloud (fondation du futur)

**Principe directeur** : Chaque nouvelle fonctionnalité doit apporter de la valeur réelle sans compromettre la simplicité et la rapidité qui font la force d'IdeaNoter.
