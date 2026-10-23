# Photos fournies par Pierre : procédure d'import

1. **Dossier hors du dépôt** : `C:\Users\plene\Documents\TSA_photos_a_importer\` (rien n'y est versionné ; les originaux n'entrent jamais dans git).
2. **Une image par fiche**, nommée par l'id exact de la fiche : `<id>.jpg`, `.jpeg`, `.png` ou `.webp` (ex. `head-speed-mp.jpg`).
3. **`photos.json`** dans le même dossier, une entrée par image, sur le modèle `modele-photos.json` ci-contre.
4. Champs obligatoires : `id`, `fichier`, `pageOrigine` (https, la page d'origine, jamais un moteur de recherche), `credit` (la source réelle ; le nom d'une marque seulement pour une image prise sur un site de cette marque), `fourniParPierre: true`, `droits` (prise de responsabilité de Pierre, datée), `date`, `sansFiligrane: true`, `intitule`.
5. Raquette : `tamis`, `plan`, `poids` non cordé (et `ra`, `generation` s'ils sont connus). Cordage : `jauge` (celle de l'emballage photographié) et `coloris` (celui du cordage visible).
6. Import : `python scripts/scraper/tw_product_images.py import-upload` (ou `import-upload <dossier>`). Il refuse une entrée incomplète, une URL de moteur, une image annoncée filigranée, un crédit de marque pour une image de tiers ; il copie les images acceptées dans le cache du collecteur et écrit leurs décisions au mapping (`source: upload:pierre`).
7. Contrôle : `scripts/scraper/out/upload-pierre-rapport.json` (accepté, refusé, avertissement de génération) et la planche `scripts/scraper/out/peek-upload.png` (relecture visuelle : packshot du bon produit, aucun filigrane, aucun joueur).
8. Construction : `python scripts/scraper/tw_product_images.py build` : même association que les sites de marque (tamis, plan, poids, RA, jauge, coloris, génération) ; un écart = quarantaine, jamais une photo voisine. Aplatissement sur blanc et recadrage seulement.
9. Retrait : `python scripts/scraper/tw_product_images.py purge upload:pierre` (tous les envois), puis `npm run audit:ratings`.
10. Rien n'est publié sans le GO de Pierre sur la PR qui porte ses photos.
