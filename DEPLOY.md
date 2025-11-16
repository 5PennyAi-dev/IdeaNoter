# Guide de déploiement sur Vercel

## Prérequis
- Compte GitHub (gratuit)
- Compte Vercel (gratuit)

## Étapes de déploiement

### 1. Pousser le code sur GitHub (si ce n'est pas déjà fait)

```bash
git add .
git commit -m "Prepare for deployment"
git push origin claude/mobile-ux-ui-design-01Hp6b2pWHS8MmxkxYgj8wZv
```

### 2. Déployer sur Vercel

**Option A: Via l'interface web (Recommandé)**

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" (ou "Login" si vous avez déjà un compte)
3. Connectez-vous avec votre compte GitHub
4. Cliquez sur "Add New Project"
5. Sélectionnez le dépôt `IdeaNoter`
6. Sélectionnez la branche `claude/mobile-ux-ui-design-01Hp6b2pWHS8MmxkxYgj8wZv`
7. Cliquez sur "Deploy"
8. Attendez 2-3 minutes

**Vercel va automatiquement:**
- Détecter que c'est un projet Next.js
- Installer les dépendances
- Construire l'application
- Déployer sur un URL HTTPS

### 3. Accéder à votre application

Une fois le déploiement terminé, Vercel vous donnera un URL comme:
```
https://idea-noter-[random].vercel.app
```

Vous pourrez accéder à cette URL depuis votre iPhone, votre ordinateur, ou n'importe où!

## Avantages de Vercel

- ✅ URL HTTPS sécurisé
- ✅ Accessible de n'importe où
- ✅ Déploiement automatique sur chaque push
- ✅ Gratuit pour les projets personnels
- ✅ Performance optimale (CDN global)
- ✅ Support complet de Next.js 15

## Note sur InstantDB

Votre application utilise InstantDB avec l'APP_ID déjà configuré dans le code (`b4000325-ee7c-4fb1-a80b-aace7ab11bac`). Aucune configuration supplémentaire n'est nécessaire - vos données seront accessibles depuis l'URL Vercel.

## Redéployer après des modifications

Chaque fois que vous poussez du code sur GitHub, Vercel redéploiera automatiquement votre application.

```bash
git add .
git commit -m "Update features"
git push
```

L'application sera mise à jour en 2-3 minutes.
