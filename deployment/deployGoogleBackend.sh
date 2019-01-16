#!/bin/sh


ssh -o StrictHostKeyChecking=no ryan_medlin@35.236.78.59 'cd ~/grip/grip-cleint &&  sudo rm -rf *'

rsync -avz -e "ssh -o StrictHostKeyChecking=no" /home/circleci/repo/ ryan_medlin@35.236.78.59:/home/ryan_medlin/grip/grip-client

ssh -o StrictHostKeyChecking=no ryan_medlin@35.236.78.59 'cd ~/grip/grip-client && git clean -xfd  && cp ~/.grip/grip-client/.env.integration .env && docker-compose up --build -d'



