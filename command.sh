
function show_help() {
    printf "

Usage:
$ ./command.sh COMMAND [COMMAND_ARGS...]

commands:
* build
* up
* down
* stop
* restart
* install
* start
* debug
* npx
"
}
function command_docker() {
    COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 \
     docker-compose -f docker-compose.yml "$@"
}

case "$1" in
build)
    shift
    command_docker build "$@"
    ;;
up)
    shift
    command_docker up "$@"
    ;;
down)
    shift
    command_docker down "$@"
    ;;
stop)
    shift
    command_docker stop "$@"
    ;;
restart)
    shift
    command_docker restart "$@"
    ;;
install)
    shift
    command_docker run --rm webpack_cli npm install "$@"
    ;;
npx)
    shift
    command_docker run --rm webpack npx "$@"
    ;;
start)
    shift
    command_docker run --rm webpack npm start "$@"
    ;;
debug)
    shift
    command_docker run --rm webpack npm dev:debug "$@"
    ;;
*)
    show_help
esac