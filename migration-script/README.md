# How to run these script

For now , you have to `cd` into the migration-script/prod folder to run the scripts

# Step 1

The first step is to run the migrate.sh script , you do that from the migration-script directory and typing the command
`. migrate-prod.sh`
after the Typeorm synchronization is done , exit the server and move to step 2

# Step 2

The second step is to create the dump and move it to production , you do so by running the move_dump_to_production.sh script (`. move_dump_to_production.sh`)
Make sure you are typing the correct password , if you didn't , do the whole process again

## Notice:

Because the script creates a dump from the running-prod's DB (goodpoint.carmel6000.com's DB) and pushes a dump to our staging's DB (goodpoint2-t.carmel6000.com's DB) - it'll only work under the WiFi in the office
