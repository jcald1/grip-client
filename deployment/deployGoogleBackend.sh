#!/bin/sh


ssh -o StrictHostKeyChecking=no ryan_medlin@35.236.68.11 'cd ~/grip/grip-client &&  sudo rm -rf *'

rsync -avz -e "ssh -o StrictHostKeyChecking=no" /home/circleci/repo/ ryan_medlin@35.236.68.11:/home/ryan_medlin/grip/grip-client

ssh -o StrictHostKeyChecking=no ryan_medlin@35.236.68.11 'cd ~/grip/grip-client && cd /home/ryan_medlin/grip/grip-client && git clean -xfd  && cp ~/.grip/.env.integration env.production && docker-compose up --build -d'



