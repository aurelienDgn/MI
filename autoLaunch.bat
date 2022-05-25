@echo off
echo "lancement de HouseCraft, veuillez patienter"
cd %~p0
echo "chemin vers le jeu trouve, lancement de l'installation/verification des dependances"
call npm install
echo "dependances ok, lancement du jeu"
call npm run dev
pause