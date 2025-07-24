COLOR='\033[0;33m'
COLOR_ERR='\033[0;31m'
COLOR_EMPHASIZE='\033[1;95m'

COLOR_FAINT='\033[2;97m'

NC='\033[0m' # No Color


echo_c() { # echo with color
    echo -e "${COLOR}${1}${NC}"
}
echo_e() { # echo with error color
    echo -e "${COLOR_ERR}${1}${NC}"
}
echo_em() { # echo with emphasize color
    echo -e "${COLOR_EMPHASIZE}${1}${NC}"
}
