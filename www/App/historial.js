angular.module('historialApp', ['ionic', 'ngCordova'])
    .controller('borrarHistorial', borrarHistorial)
    .factory('salirApp', salirApp);


borrarHistorial.$inject = ['$scope', '$ionicHistory', 'salirApp', '$ionicPopup', '$state', '$timeout', '$window'];

function borrarHistorial($scope, $ionicHistory, salirApp, $ionicPopup, $state, $timeout, $window) {


    $scope.showConfirm = function() {

        var confirmPopup = $ionicPopup.confirm({
            title: 'Cerrar sesion',
            template: 'Esta seguro que desea cerrar sesion?',
            cancelText: 'Cancelar',
            cancelType: 'button-assertive',
            okText: 'Salir',
            okType: 'button-balanced'
        });

        confirmPopup.then(function(res) {

            var nombreVista;

            if (res) {

                //var mensaje = "Cerrando sesion";
                // mostrarMensaje.setMensaje(mensaje);

                delete $window.localStorage.logged;
                console.log($window.localStorage.logged);

                $state.go('Loading');

                if (nombreVista == 'menuestu') {
                    salirApp.eliminarTablasEstu();
                } else {
                    salirApp.eliminarTablasProf();
                }


                $timeout(function() {
                    $state.go('login');
                }, 2500);

            } else {
                console.log('Cancelando');
            }

        });
    };

    salirApp.salida();
    $ionicHistory.clearHistory();

};


salirApp.$inject = ['$ionicPlatform', '$ionicHistory', '$timeout', '$cordovaSQLite'];

function salirApp($ionicPlatform, $ionicHistory, $timeout, $cordovaSQLite) {

    function salida() {

        var BackButton = 0;

        $ionicPlatform.registerBackButtonAction(function() {

            if ($ionicHistory.currentStateName() == 'menuestu' || $ionicHistory.currentStateName() == 'menuprof') {

                if (BackButton == 0) {

                    BackButton++;
                    window.plugins.toast.showLongCenter('Presione nuevamente para salir');

                    $timeout(function() {
                        BackButton = 0;
                    }, 2500);

                } else {
                    navigator.app.exitApp();
                }

            } else {
                $ionicHistory.goBack();
            }

        }, 100);

    };

    function eliminarTablasEstu() {

        var db, dropPerfil, dropHorario, dropTareasEstu;

        db = $cordovaSQLite.openDB({
            name: "unicesar.db"
        });

        dropPerfil = "DROP TABLE Estudiante";
        dropHorario = "DROP TABLE Horario";
        dropTareasEstu = "DROP TABLE TareasEstu";

        $cordovaSQLite.execute(db, dropPerfil);
        $cordovaSQLite.execute(db, dropHorario);
        $cordovaSQLite.execute(db, dropTareasEstu);

    };

    function eliminarTablasProf() {

        var db, dropPerfil_P, dropHorario_P, dropGrupos, dropTareasProf;

        db = $cordovaSQLite.openDB({
            name: "unicesar.db"
        });

        dropPerfil_P = "DROP TABLE Profesor";
        dropHorario_P = "DROP TABLE HorarioP";
        dropGrupos = "DROP TABLE GruposP";
        dropTareasProf = "DROP TABLE TareasProf";

        $cordovaSQLite.execute(db, dropPerfil_P);
        $cordovaSQLite.execute(db, dropHorario_P);
        $cordovaSQLite.execute(db, dropGrupos);
        $cordovaSQLite.execute(db, dropTareasProf);

    };


    return {
        salida: salida,
        eliminarTablasEstu: eliminarTablasEstu,
        eliminarTablasProf: eliminarTablasProf
    };

};