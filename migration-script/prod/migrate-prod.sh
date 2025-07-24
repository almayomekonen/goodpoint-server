. ../echo_colors.sh

echo_e "Should we start the migrate script?"
echo_c "This script will fetch a dump from goodpoint1's prod's DB into your local DB."
echo_c "Then it'll migrate that local DB from goodpoint1 to goodpoint2."
echo_c "Lastly it'll run \`npm run start:dev:preserve\` so TypeOrm will sync your local DB with goodpoint2 enitites & relations."
echo -e ${COLOR_ERR}"OK?${NC} ${COLOR_FAINT}[y/n] ${NC}"
read should_run1

if ! [ $should_run1 == "y" ] || [ $should_run1 == "Y" ]; then
    echo_e "Ok bye!"
    return 0
fi



#run this in the server/migration-script/ root directory
echo -e "${COLOR_ERR}Are you in the ${COLOR_EMPHASIZE}server/migration-script/prod/${COLOR_ERR} directory? ${COLOR_FAINT}[y/n] ${NC}"
read should_run2

if ! [ $should_run2 == "y" ] || [ $should_run2 == "Y" ]; then
    echo_e "Ok bye!"
    return 0
fi

#TODO: switch to prod db

#First create a new dump from the now running project databse in staging
running_db_host="mysql8b.mysql.database.azure.com"
running_db_name="goodpoint"
running_db_user="goodpoint@mysql8b"

running_db_dump_path="../../dumps/running_dump_$(date +"%Y-%m-%dT%I:%M%p").sql"
echo_c "Creating a local dump of the now running goodpoint1's staging's DB..."
echo_c "mysql will need the password to goodpoint1's staging's DB (most secure):"
prod_db_password="gf!JlaSb&U"




#user enters the databse name then we store it in a variable.
echo -e "Enter your local database name: ${COLOR_FAINT}(defualt: good_point)${NC}"
read local_db_name
local_db_name=${local_db_name:-good_point} # default is "good_point".

#User enters the database user then we store it in a variable.
echo -e "Enter you local database user: ${COLOR_FAINT}(defualt: root)${NC}"
read local_db_user
local_db_user=${local_db_user:-root} # default is "root"

echo -e "Enter your local database password:  ${COLOR_FAINT}(defualt: z10mz10m)${NC}"
read local_db_password
local_db_password=${local_db_password:-z10mz10m}

mysqldump -u$running_db_user -p$prod_db_password -h$running_db_host $running_db_name > $running_db_dump_path --no-tablespaces
return_code1="$?"
if ! [ $return_code1 -eq 0 ]; then
    echo_e "Dropping & Creating local databse failed. Bye"
    return 1
fi


# Drop and create the database
echo_c "Dropping & Creating local database..."
echo_c "mysql will need your password (most secure):"
mysql -u$local_db_user -p$local_db_password -e "DROP DATABASE IF EXISTS $local_db_name; CREATE DATABASE $local_db_name;"
return_code2="$?"
if ! [ $return_code2 -eq 0 ]; then
    echo_e "Dropping & Creating local databse failed. Bye"
    return 1
fi

# Dump the database
echo_c "Dumping running_dump into local database..."
echo_c "mysql will need your password again (most secure):"
mysql -u$local_db_user -p$local_db_password $local_db_name < $running_db_dump_path
return_code3="$?"
if ! [ $return_code3 -eq 0 ]; then
    echo_e "Dumping running_dump into local database failed. Bye"
    return 1
fi

# Print a success message
echo_c "Database successfully dropped, created, and dumped."

echo_c "Running migration script (node)"
#running migration script
#passing local database credentials
node ../migration_script.js $local_db_user $local_db_password $local_db_name

return_code4="$?"
if ! [ $return_code4 -eq 0 ]; then
    echo_e "The node script wasn't successfull. Woops. Bye"
    return 1
fi

#synchronizing the database with the typeorm entities
echo_c "The node script finished successfully"
echo_c "Synchronizing the database with the typeorm entities..."
echo_em "(Once nest finished starting, you can stop the script (\`ctrl+c\`) and check that your local DB has been successfully migrated to goodpoint2)."
echo_c ""
echo_c ""
echo_c ""
echo_c ""
#preserve will prevent the console clearing on `nest start`
npm run start:dev:preserve

#after this is run , you need to check if all the data is fine and nothing got deleted , like the text from good_points 
#ideally there would be a test script that would check if the data is fine or not , but for now we will do it manually

#then create a dump of this new db and move it to staging
