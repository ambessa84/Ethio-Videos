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
pnpm install
cp .env.example .env
```

Modifie `.env` :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ethio_videos"
YOUTUBE_API_KEY="your_youtube_api_key"
AI_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:3b"
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL="gpt-5.4-mini"
ADMIN_PASSWORD="change_me"
AUTH_SECRET="generate_a_random_secret_of_at_least_32_characters"
CRON_SECRET="change_this_secret"
PUBLIC_SITE_URL="http://localhost:5173"
```

Puis lance Prisma :

```bash
pnpm prisma migrate dev --name init
pnpm prisma db seed
```

Lance le projet :

```bash
pnpm dev
```

## Flux principal

1. Va sur `/admin/login`.
2. Connecte-toi avec `ADMIN_PASSWORD`.
3. Va sur `/admin/videos/new`.
4. Colle une URL YouTube.
5. Choisis catégorie, langue, statut `PUBLISHED`.
6. La vidéo apparaît sur la homepage.

## Import automatique depuis les chaînes YouTube

L'admin peut ajouter une chaîne à surveiller depuis `/admin/channels/new` avec son
YouTube Channel ID. Le projet récupère l'uploads playlist ID via YouTube Data API,
puis l'utilise pour importer les dernières vidéos sans passer par `search.list`.

Depuis `/admin/channels`, clique sur `Import latest videos` pour importer les
dernières vidéos d'une chaîne. Il est recommandé de commencer avec le statut par
défaut `DRAFT`, puis de publier les vidéos après vérification.

Pour tester le cron localement :

```bash
curl -H "Authorization: Bearer change_this_secret" http://localhost:5173/api/cron/import-youtube
```

L'endpoint cron peut être appelé par Vercel Cron, GitHub Actions ou un cron serveur.
Configure `CRON_SECRET` dans l'environnement de production.

## AI summaries

La Phase 1 genere des resumes IA uniquement depuis les metadonnees YouTube deja
stockees : titre, description, chaine, categorie, langue et date de publication.
Elle n'utilise pas de transcription, ne telecharge pas les videos et ne recupere
pas les captions YouTube.

Par defaut, la generation utilise Ollama en local avec un modele gratuit. Installe
Ollama, puis telecharge le modele recommande :

```bash
ollama pull qwen2.5:3b
```

Configure `.env` :

```env
AI_PROVIDER="ollama"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="qwen2.5:3b"
```

Si Ollama n'est pas lance, demarre-le avant de generer un resume :

```bash
ollama serve
```

OpenAI reste disponible en option, par exemple pour une meilleure qualite en
production :

```env
AI_PROVIDER="openai"
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL="gpt-5.4-mini"
```

`AI_PROVIDER` accepte `ollama` ou `openai`. Si la variable est absente ou
inconnue, le projet utilise Ollama. `OLLAMA_MODEL` est optionnel et vaut
`qwen2.5:3b` par defaut. `OPENAI_MODEL` est optionnel et vaut `gpt-5.4-mini`
par defaut.

Apres avoir installe les dependances, lance la migration Prisma :

```bash
pnpm prisma migrate dev --name add_ai_summary_fields
pnpm prisma generate
```

Flux admin :

1. Va dans `/admin/videos/[id]/edit`.
2. Choisis la langue de metadata IA (`fr`, `en` ou `am`).
3. Clique sur `Generate AI Summary`.
4. Verifie le resume court, le resume long, les points cles, les tags, les
   champs SEO, la confiance et le flag de revue humaine.
5. Clique sur `Copy AI short summary to public summary` pour copier le resume
   court IA dans le champ public `summary`.

Les metadonnees IA sont stockees par video et par langue de site. Generer les
metadonnees `fr` n'ecrase donc pas les metadonnees `en`, et inversement.

La page publique affiche uniquement `summary`. Les champs `ai*` restent reserves
a l'admin tant que le resume court n'est pas copie manuellement.

## Routes

### Public

```txt
/
 /latest
 /trending
 /category/[slug]
 /tag/[slug]
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
/admin/channels/new
/admin/suggestions
```

## Remarques importantes

Ce MVP utilise l'intégration YouTube officielle via iframe. Il ne télécharge pas les vidéos.

L'admin utilise Auth.js avec un provider Credentials. `ADMIN_PASSWORD` reste le mot de passe
admin du MVP, et `AUTH_SECRET` doit être une chaîne aléatoire d'au moins 32 caractères pour
signer les sessions.

Pour utiliser l'API YouTube Data v3 :

1. Crée un projet dans Google Cloud.
2. Active YouTube Data API v3.
3. Crée une API key.
4. Ajoute la clé dans `.env`.

## Améliorations futures

- Import automatique depuis des chaînes YouTube.
- Résumés IA.
- Publicités directes.
- Newsletter automatisée.
- Pages événements diaspora.
