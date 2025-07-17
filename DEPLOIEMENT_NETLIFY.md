# Déploiement DIGI THR sur Netlify

## Instructions de déploiement

### 1. Préparation du projet

Le projet est maintenant prêt pour le déploiement sur Netlify avec les configurations suivantes :

- ✅ **Build automatique** : Configuration `netlify.toml` avec commande de build
- ✅ **Mode statique** : Application configurée pour fonctionner sans serveur
- ✅ **Données simulées** : Données de démonstration intégrées pour le mode statique
- ✅ **Redirections** : Configuration pour SPA (Single Page Application)

### 2. Étapes de déploiement

1. **Connecter le repository à Netlify**
   - Aller sur [netlify.com](https://netlify.com)
   - Cliquer sur "New site from Git"
   - Connecter votre repository GitHub/GitLab

2. **Configuration automatique**
   - Netlify détectera automatiquement le fichier `netlify.toml`
   - Build command : `npm run build`
   - Publish directory : `dist/public`

3. **Variables d'environnement**
   - Ajouter `VITE_STATIC_MODE=true` dans les variables d'environnement Netlify
   - Aller dans Site settings > Environment variables

4. **Déploiement**
   - Cliquer sur "Deploy site"
   - Le build prendra environ 2-3 minutes

### 3. Fonctionnalités en mode statique

- ✅ **Authentification** : Système de login avec localStorage
- ✅ **Dashboard** : KPIs en temps réel simulés
- ✅ **Production** : Données de production avec états
- ✅ **Maintenance** : Planning de maintenance simulé
- ✅ **Sécurité** : Alertes de sécurité dynamiques
- ✅ **Notifications** : Système de notifications intégré

### 4. Accès à l'application

**Identifiants de connexion :**
- Login : `abdelfattah`
- Mot de passe : `abdelfattah ocp`

### 5. Caractéristiques techniques

- **Framework** : React 18 + TypeScript
- **Styling** : Tailwind CSS avec thème OCP
- **Données** : Simulation complète des données de la mine
- **Responsive** : Compatible mobile et desktop
- **Performance** : Optimisé pour la production

### 6. Résolution des problèmes

Si le déploiement échoue :

1. **Vérifier les logs de build** dans Netlify
2. **S'assurer que Node.js 18** est configuré
3. **Vérifier les variables d'environnement**
4. **Contacter le support** si nécessaire

### 7. URL de démonstration

Une fois déployé, l'application sera accessible via :
`https://[nom-du-site].netlify.app`

---

**Note** : L'application est entièrement fonctionnelle en mode statique avec toutes les fonctionnalités de DIGI THR pour la mine de Sidi Chennane d'OCP.