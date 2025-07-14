. ../echo_colors.sh

echo -e "${COLOR_ERR}Did you first run the ${COLOR_EMPHASIZE}migrate.sh${COLOR_ERR} script?${COLOR_FAINT} [y/n] ${NC}"
read ran_migration_script
if ! [ $ran_migration_script == "y" ] || [ $ran_migration_script == "Y" ]; then
    echo_e "Ok bye"
    return 0
fi

echo_c "Great so your local DB contains the currently-running goodpoint1's DB's data, with a structure of goodpoint2. Yay."
echo_e "(This would be a GREAT time to make sure the data has not been corrupted due to the migration!)"
echo_c "This script will take your local DB and update goodpoint2's staging's DB with it."
echo -e ${COLOR_ERR}"OK?${NC} ${COLOR_FAINT}[y/n] ${NC}"
read should_run

if ! [ $should_run == "y" ] || [ $should_run == "Y" ]; then
    echo_e "Ok bye"
    return 0
fi

# this is run after running the migration bash script
#we need to create a dump from the local database and move it to the staging server
#user enters the databse name then we store it in a variable.
echo -e "Enter your local database name: ${COLOR_FAINT}(defualt: good_point)${NC}"
read local_database_name
local_database_name=${local_database_name:-good_point} # default is good_point

#User enters the database user then we store it in a variable.
echo -e "Enter you local database user: ${COLOR_FAINT}(defualt: root)${NC}"
read local_database_user
local_database_user=${local_database_user:-root} # default is root

dump_to_send_to_staging_path="../../dumps/dump_to_send_to_staging_$(date +"%Y-%m-%dT%I:%M%p").sql"

#create a dump from the good_point database
echo_c "Creating dump from the local database..."
echo_c "mysqldump will need your password (most secure):"
mysqldump -u $local_database_user -p $local_database_name >$dump_to_send_to_staging_path
return_code1="$?"
if ! [ $return_code1 -eq 0 ]; then
    echo_e "Dumping your local DB failed... Bye"
    return 1
fi
echo_c "Dumped your local DB"

#now we need to move this dump to the staging DB
staging_database_name="goodpoint2"
staging_database_user="goodpoint2@mysql8b"
staging_database_password="1ed2jvF8pILWg"
staging_database_host="mysql8b.mysql.database.azure.com"
#drop and create the database on the staging server if exists
echo_c "Dropping & Creating database..."
mysql -u$staging_database_user -p$staging_database_password -h$staging_database_host -e "DROP DATABASE IF EXISTS $staging_database_name; CREATE DATABASE $staging_database_name;"
return_code2="$?"
if ! [ $return_code2 -eq 0 ]; then
    echo_e "Dropping and Creating goodpoint2's staging's DB failed... Bye"
    return 1
fi
echo_c "Database dropped and created"

echo_c "Moving dump to staging server..."
mysql -u $staging_database_user -p$staging_database_password -h$staging_database_host $staging_database_name <$dump_to_send_to_staging_path
return_code3="$?"
if ! [ $return_code3 -eq 0 ]; then
    echo_e "Updaing goodpoint2's staging's DB failed... Bye"
    return 1
fi

echo_c "Dump successfully moved to staging DB"
