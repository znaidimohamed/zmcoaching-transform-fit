# ZM Logo – package developer

## Fichiers
- `svg/zm-logo.svg` : version principale (fond clair). Z = noir carbone, M = rouge foncé.
- `svg/zm-logo-on-dark.svg` : pour fond sombre (Z blanc, M rouge).
- `svg/zm-logo-mono-black.svg` / `zm-logo-mono-white.svg` : monochrome.
- `png/` : exports transparents (2048 / 512) + favicons (`favicon-512.png`, `favicon-64.png`).

## Couleurs
| Élément | Hex |
|---|---|
| Z (noir carbone) | `#1A1214` |
| M (rouge foncé) | `#B00610` |

Chaque lettre est un groupe SVG séparé (`<g id="Z">` et `<g id="M">`) : change le `fill` pour modifier la couleur.

## Notes
- Tout est en paths vectoriels (aucune police / texte), donc portable.
- Géométrie issue de l'outline Canva (Z = 3 formes : barre, diagonale, wedge ; M = 1 forme).
- HTML : `<img src="svg/zm-logo.svg" alt="ZM" height="48">`
