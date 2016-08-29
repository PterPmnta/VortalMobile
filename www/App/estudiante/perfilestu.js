angular.module('perfilEstudiante', ['ionic', 'ngCordova'])
    .controller('mostrarPerfilEstu', mostrarPerfilEstu)
    .directive('pickFile', pickFile)
    .factory('obtenerPerfilEstu', obtenerPerfilEstu);


mostrarPerfilEstu.$inject = ['$scope', 'obtenerPerfilEstu'];

function mostrarPerfilEstu($scope, obtenerPerfilEstu, $element) {

    var Perfil, Mes, Periodo_Estu, input, button, evtHandler, dataImage;

    Mes = moment().format('MM');

    if (Mes < 07) {
        Periodo_Estu = "Periodo - I"
    } else {
        Periodo_Estu = "Periodo - II"
    }

    obtenerPerfilEstu.datosPerfil().then(function(data) {

        Perfil = data;

        $scope.Cedula = Perfil.cedula;
        $scope.Nombre = Perfil.nombre;
        $scope.Apellido = Perfil.apellido;
        $scope.Rol = Perfil.rol;
        $scope.Facultad = Perfil.facultad;
        $scope.Programa = Perfil.programa;
        $scope.Semestre = Perfil.semestre;
        $scope.Periodo = Periodo_Estu;

    });

    dataImage = localStorage.getItem("imgData");

    if (dataImage == null) {
        $scope.dataImage = "img/profile_icon.png";
    } else {
        $scope.dataImage = "data:image/png;base64," + dataImage;
    }


    $scope.loadImage = function(file) {

        if (file.type.indexOf('image') < 0) {
            $scope.res = "Tipo inválido";
            $scope.$apply();
            return;
        }

        var fReader = new FileReader();

        fReader.onload = function() {

            var data = fReader.result;
            $scope.dataImage = data;
            $scope.res = "";
            $scope.$apply();
            localStorage.setItem("imgData", data.replace(/^data:image\/(png|jpe?g);base64,/, ""));

        };

        fReader.readAsDataURL(file);
    };

};

function pickFile() {

    return {

        restrict: 'EA',
        scope: {
            onselected: "&"
        },

        template: '<button class="button button-icon icon ion-plus-round pull-right">' +
            '<input type="file" style="display: none !important">' +
            '</button>',

        link: function($scope, $element) {
            var input = $element.find('input');
            var button = $element.find('button');

            var evtHandler = function() {
                input[0].click();
            };

            button.on('click', evtHandler)
            input.on('change', function() {
                var file = input[0].files[0];
                $scope.onselected({
                    file: file
                });
            });
        }

    };

};


obtenerPerfilEstu.$inject = ['$cordovaSQLite', '$ionicHistory'];

function obtenerPerfilEstu($cordovaSQLite, $ionicHistory) {

    return {

        datosPerfil: function() {

            var sqlConsulta, db, perfil, datos, l_perfil, i, fila;

            sqlConsulta = "SELECT * FROM Estudiante"
            perfil = {};

            db = $cordovaSQLite.openDB({
                name: "unicesar.db",
                location: "default"
            });

            perfil = $cordovaSQLite.execute(db, sqlConsulta, []).then(function(resultado) {

                l_perfil = resultado.rows.length;

                for (i = 0; i < l_perfil; i++) {

                    fila = resultado.rows.item(i);

                    datos = {

                        cedula: fila.Cedula,
                        nombre: fila.Nombre,
                        apellido: fila.Apellido,
                        rol: "Estudiante",
                        facultad: fila.Facultad,
                        programa: fila.Programa,
                        semestre: fila.Semestre

                    };

                }

                return datos;

            }, function(err) {
                console.error(err);
            });


            return perfil;

        }

    };

};