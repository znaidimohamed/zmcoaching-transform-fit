# ZM Coaching – Kit de marque (pour le développeur)

Logo : **Z noir carbone en lames** + **M rouge foncé** dans le creux, nom **ZM Coaching**, signature **HYBRID TRAINING**.
Couleurs reprises du site zmcoaching.online (thème sombre, rouge). Police : **Inter** (800 pour le nom, 600 pour la signature).

## Où mettre chaque fichier

| Emplacement sur le site | Fichier |
|---|---|
| Navbar (carré à côté du texte "ZM Coaching") | `logos/png/zm-icone-sombre.png` (affiché en 44×44) |
| Hero / page d'accueil (fond sombre) | `logos/svg/zm-logo-sombre-transparent.svg` (ou `.png`) |
| Footer (fond sombre) | `logos/svg/zm-logo-monochrome-blanc.svg` |
| Écran de chargement, login, dashboard admin | `logos/png/zm-icone-sombre.png` |
| Fond clair / documents / factures | `logos/svg/zm-logo-clair-transparent.svg` |
| Impression noir & blanc, tampon, broderie | `logos/svg/zm-logo-monochrome-noir.svg` |
| Favicon & icônes | tout le dossier `favicon/` **à la racine** du site |
| Partage réseaux (WhatsApp, Facebook, Google) | `social/og-image-1200x630.png` à la racine |
| Photo de profil Instagram / Facebook / TikTok / YouTube | `social/profile-1080x1080.png` |
| Bannière Facebook / X / YouTube | `social/cover-1500x500.png` |

Remplacer partout l'ancien `/Logo.png`.

## Favicon + partage
Copier le contenu de `code/head-snippet.html` dans le `<head>` (les chemins supposent les fichiers à la racine).
Variables de couleur : `code/brand.css` (ou `code/tokens.json`).

## Fichiers
- `logos/svg/` : sources vectorielles (le nom "ZM Coaching" est déjà converti en tracés : aucune police à installer).
- `logos/png/` : mêmes logos en PNG haute définition (2000 px de large pour les logos complets, 1600 px symboles, 1024 px icônes). Les `*-transparent` et `monochrome` ont un fond transparent.
- `zm-symbole-*` : le symbole seul (Z + M), sans texte.
- `favicon/` : `favicon.ico`, `favicon.svg`, 16/32/48 px, `apple-touch-icon.png` (180), `android-chrome` (192, 512), `site.webmanifest`.

## Règles d'usage
- Fond sombre : version `sombre`. Fond clair : version `clair`. Une seule couleur : `monochrome`.
- Espace libre autour du logo : au moins 10 % de sa largeur.
- Taille minimale : logo complet 120 px de large, symbole seul 24 px.
- Ne pas déformer, pivoter, recolorer ni ajouter d'ombre au logo.
- Le Z est noir : sur fond sombre, toujours utiliser la version `sombre` (contour clair + halo rouge) pour qu'il reste visible.
