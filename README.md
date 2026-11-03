# Portfolio ETSIN EKOH

Portfolio de ETSIN EKOH, développeur agentique (web, données et IA) à Abidjan.

🌐 **En ligne** : [ekoh225-dev.github.io/portfolio-ekoh-etsin](https://ekoh225-dev.github.io/portfolio-ekoh-etsin/)

## Fonctionnalités

- Présentation, compétences, projets (dont SAFE-SECURITE, logiciel pour un client réel) et parcours
- Fiche profil qui s'ouvre au clic sur le portrait de l'en-tête
- Visionneuse photo : zoom (boutons, molette, double-clic, pincement), déplacement et navigation
- Contact direct par WhatsApp ou e-mail, avec message prérempli
- Formulaire de contact (Formspree) avec champ anti-robots
- Halo lumineux qui suit le curseur sur les cartes
- CV téléchargeable en PDF et aperçu de partage (Open Graph) pour WhatsApp et LinkedIn
- Responsive (testé à 375 px), accessible au clavier, animations désactivées si le visiteur le demande

## Choix techniques

- **HTML, CSS et JavaScript sans framework ni dépendance** : site léger, rapide sur les connexions lentes
- **Images WebP** compressées ; versions haute définition chargées seulement à l'ouverture de la visionneuse
- **Balise `<dialog>` native** pour la fiche profil et la visionneuse (gestion d'Échap et du focus par le navigateur)
- **Hébergement GitHub Pages** : chaque push sur `main` met le site à jour

## Structure

- `index.html` : structure et contenu
- `css/style.css` : styles, couleurs définies en variables (`:root`)
- `js/script.js` : contact, fiche profil, visionneuse, halo, animations d'apparition
- `assets/` : images, icône et CV

## Lancer en local

```bash
python -m http.server 8765
```

Puis ouvrir <http://127.0.0.1:8765>.
