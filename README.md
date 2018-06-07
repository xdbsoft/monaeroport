# Monaeroport

English version below

Ce site internet a été réalisé par [Simon HEGE](https://twitter.com/simonhege) dans le cadre du concours Datavizz organisé lors des assises du transport aérien par la [Direction Générale de l'Aviation Civile (DGAC)](https://www.ecologique-solidaire.gouv.fr/direction-generale-laviation-civile-dgac). 

## License
Le code source de cette application est disponible sous licence MIT. Conformément au règlement du concours, L'Organisateur (le Ministère et sa Direction Général de l’Aviation Civile) demeure titulaire de tous les droits sur les données d'études soumises aux Participants dans le cadre du concours. Elles sont constituées par l'ensemble des fichiers JSON situés dans le dossier `src\assets`.

## Installation

### Prérequis
Les outils suivants doivent être installés préalablement:
 - git https://git-scm.com/
 - npm https://www.npmjs.com/

### Procédure d'installation
```bash
# Cloner le dépot git
git clone https://github.com/xdbsoft/monaeroport.git 
cd monaeroport

# Installer les dépendances
npm install

# Générer la version de production
ng build --prod
```
L'application web est générée dans le dossier `dist`.
Il suffit alors d'en déplacer le contenu vers le dossier souhaité du serveur web. 

- Apache: https://httpd.apache.org/docs/trunk/urlmapping.html
- Nginx: https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/

### Serveur de dévelopement
Un serveur de dévelopement est intégré à angular-cli.

Il suffit d'exécuter `ng serve` depuis la racine du dépot pour lancer le serveur. Ouvrir ensuite un navigateur à l'adresse `http://localhost:4201/`. 
L'aplication se rafraichira automatiquement en cas de changement des fichiers sources.



# Engish version

## License
This software is distributed under MIT License, excepted regarding the json files in the `src\assets` folder. The French Civil Aviation Authority remains owner of all rights for this dataset.

## Build & co

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4201/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
