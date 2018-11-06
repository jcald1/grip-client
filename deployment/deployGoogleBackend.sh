#!/bin/sh


rsync -avz -e "ssh -o StrictHostKeyChecking=no" .. ryan_medlin@grip-integration-vm3:~/grip/grip-client@35.236.68.11:/home/ryan_medlin/grip/grip-client

ssh -o StrictHostKeyChecking=no ryan_medlin@grip-integration-vm3:~/grip/grip-client@35.236.68.11 'cd /home/ryan_medlin/grip/grip-client && git clean -xfd  && docker-compose up --build -d'
#&& cp config/production.json config/local.json


