angular.module('perfilProfesor', ['ionic', 'ngCordova'])
    .controller('mostrarPerfilProf', mostrarPerfilProf)
    .directive('pickImage', pickImage)
    .factory('obtenerPerfilProf', obtenerPerfilProf);


mostrarPerfilProf.$inject = ['$scope', 'obtenerPerfilProf'];

function mostrarPerfilProf($scope, obtenerPerfilProf, $element) {

    var Perfil, Mes, Periodo_Prof, input, button, evtHandler, dataImage;

    Mes = moment().format('MM');

    if (Mes < 07) {
        Periodo_Prof = "Periodo - I"
    } else {
        Periodo_Prof = "Periodo - II"
    }

    obtenerPerfilProf.datosPerfil().then(function(data) {

        Perfil = data;

        $scope.Cedula = Perfil.cedula;
        $scope.Nombre = Perfil.nombre;
        $scope.Apellido = Perfil.apellido;
        $scope.Rol = Perfil.rol;
        $scope.Facultad = Perfil.facultad;
        $scope.Programa = Perfil.programa;
        $scope.Periodo = Periodo_Prof;

    });

    dataImage = localStorage.getItem("imgData");
    console.log(dataImage);

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

function pickImage() {

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


obtenerPerfilProf.$inject = ['$cordovaSQLite'];

function obtenerPerfilProf($cordovaSQLite) {


    return {

        datosPerfil: function() {

            var sqlConsulta, db, perfil, datos, l_perfil, i, fila;

            sqlConsulta = "SELECT * FROM Profesor"
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
                        rol: "Profesor",
                        facultad: fila.Facultad,
                        programa: fila.Programa

                    };

                }


                return datos;

            }, function(err) {
                console.error(err);
            });


            return perfil;

        },

        obtenerVista: function() {

            var vista;

            vista = $ionicHistory.backView();
            return vista;

        }

    };

};