# Ethio Videos MVP

MVP SvelteKit pour créer un site de curation de vidéos YouTube autour de l'Éthiopie :
- pages publiques : accueil, catégorie, vidéo, chaîne, recherche, suggestion vidéo ;
- admin simple protégé par mot de passe ;
- ajout manuel d'une vidéo YouTube ;
- récupération automatique des métadonnées YouTube ;
- Prisma + PostgreSQL ;
- SEO de base ;
- newsletter simple ;
- sitemap et robots.txt.

## Stack

- SvelteKit
- Svelte 5
- TypeScript
- Prisma
- PostgreSQL
- YouTube Data API v3

## Installation

```bash
npm install
cp .env.example .env
```

Modifie `.env` :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ethio_videos"
YOUTUBE_API_KEY="your_youtube_api_key"
ADMIN_PASSWORD="change_me"
PUBLIC_SITE_URL="http://localhost:5173"
```

Puis lance Prisma :

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Lance le projet :

```bash
npm run dev
```

## Flux principal

1. Va sur `/admin/login`.
2. Connecte-toi avec `ADMIN_PASSWORD`.
3. Va sur `/admin/videos/new`.
4. Colle une URL YouTube.
5. Choisis catégorie, langue, statut `PUBLISHED`.
6. La vidéo apparaît sur la homepage.

## Routes

### Public

```txt
/
 /latest
 /trending
 /category/[slug]
 /video/[slug]
 /channel/[slug]
 /search
 /submit-video
 /newsletter
 /sitemap.xml
 /robots.txt
```

### Admin

```txt
/admin
/admin/login
/admin/logout
/admin/videos
/admin/videos/new
/admin/videos/[id]/edit
/admin/categories
/admin/channels
/admin/suggestions
```

## Remarques importantes

Ce MVP utilise l'intégration YouTube officielle via iframe. Il ne télécharge pas les vidéos.

Pour utiliser l'API YouTube Data v3 :
1. Crée un projet dans Google Cloud.
2. Active YouTube Data API v3.
3. Crée une API key.
4. Ajoute la clé dans `.env`.

## Améliorations futures

- Auth plus robuste avec Auth.js.
- Import automatique depuis des chaînes YouTube.
- Résumés IA.
- Tags.
- Publicités directes.
- Newsletter automatisée.
- Pages événements diaspora.
