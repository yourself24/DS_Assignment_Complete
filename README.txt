In order to run the application,need to pull both the backend and the frontend from gitlab
put the devices microservice in a directory, the move the docker-compose in the root directory
you should have it like this:
Root
--deviceMicro
--UserMicro
--frontEnd
--monitoring micro
--docker-compose.yaml
--CSVReader/energymgmt.py
--CSVReaader/sensor.csv
--CSVReader/config.json
open a terminal in root and run: docker compose build
and then run: docker compose up -d
and the run python energymgmt.py after the rabbit container was set up
