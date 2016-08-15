angular.module('modulo_Oficina', ['ionic'])
    .controller('iniciarTabs', iniciarTabs)
    .factory('informacionTabs', informacionTabs);

iniciarTabs.$inject = ['$scope', 'informacionTabs', '$stateParams'];

function iniciarTabs($scope, informacionTabs, $stateParams) {

    var Departamentos, Facultades, Administracion;

    Departamentos = informacionTabs.programas;
    Facultades = informacionTabs.decanaturas;
    Administracion = informacionTabs.admon;


    $scope.currentTab = 'programas';
    $scope.programas = Departamentos;
    $scope.decanaturas = Facultades;
    $scope.admon = Administracion;

}


informacionTabs.$inject = ['$ionicHistory', '$ionicPlatform', '$state'];

function informacionTabs($ionicHistory, $ionicPlatform, $state) {

    return {

        programas: [{
            director: 'Alvaro Oñate',
            oficina: 'Dep. de Ing. de Sistemas',
            telefono: 5849233,
            correo: 'alvaroonate@unicesar.edu.co'
        }, {
            director: 'Ada Almenares',
            oficina: 'Dep. de Derecho',
            telefono: 5546706,
            correo: 'derecho@unicesar.edu.co'
        }, {
            director: 'Josefina Cuello',
            oficina: 'Dep. de Sociologia',
            telefono: 5846706,
            correo: 'sociología@unicesar.edu.co'
        }, {
            director: 'Iranis Urbina',
            oficina: 'Dep. de Idiomas',
            telefono: 5850296,
            correo: 'idiomas@unicesar.edu.co'
        }, {
            director: 'Ineris Cuello',
            oficina: 'Dep. de Arte y folclor',
            telefono: 585045,
            correo: 'bellasartes@unicesar.edu.co'
        }, {
            director: 'Doris Celchar',
            oficina: 'Dep. de Enfermeria',
            telefono: 5848935,
            correo: 'enfermería@unicesar.edu.co'
        }],

        decanaturas: [{
            director: 'Efrain Quintero',
            oficina: 'Dec. de Bellas Artes',
            telefono: 5850411,
            correo: 'efrainquintero@unicesar.edu.co'
        }, {
            director: 'Jaime Maestre',
            oficina: 'Dec. de Ciencias de la educación',
            telefono: 5849456,
            correo: 'faceeducacion@unicesar.edu.co'
        }, {
            director: 'Nancy Hernandez',
            oficina: 'Dec. de Salud',
            telefono: 5850464,
            correo: '*'
        }],

        admon: [{
            director: 'Norberto Diaz',
            oficina: 'Cefontev',
            telefono: 3145357278,
            correo: '*'
        }, {
            director: 'Averiguar',
            oficina: 'Sala de profesores',
            telefono: 5847128,
            correo: '*'
        }]

        /*   obtenerVista: function() {

            var vista;
            vista = $ionicHistory.currentStateName();
            return vista;

        },

        salirApp: function() {

            var BackButton = 0;
            var atrasMenu;

            atrasMenu = $ionicHistory.backView();

            $ionicPlatform.onHardwareBackButton(function() {

                if ($ionicHistory.currentStateName() == 'oficinas.jefaturas' || $ionicHistory.currentStateName() == 'oficinas.decanaturas' || $ionicHistory.currentStateName() == 'oficinas.admon') {

                    if (atrasMenu.stateName == "menuestu") {
                        $state.go('menuestu');
                    } else {
                        $state.go('menuprof')
                    }

                }

            });

        },

        infoDepartamentos: function() {

            var programas;

            programas = [{
                director: 'Alvaro Oñate',
                oficina: 'Dep. de Ing. de Sistemas',
                telefono: 5849233,
                correo: 'alvaroonate@unicesar.edu.co'
            }, {
                director: 'Ada Almenares',
                oficina: 'Dep. de Derecho',
                telefono: 5546706,
                correo: 'derecho@unicesar.edu.co'
            }, {
                director: 'Josefina Cuello',
                oficina: 'Dep. de Sociologia',
                telefono: 5846706,
                correo: 'sociología@unicesar.edu.co'
            }, {
                director: 'Iranis Urbina',
                oficina: 'Dep. de Idiomas',
                telefono: 5850296,
                correo: 'idiomas@unicesar.edu.co'
            }, {
                director: 'Ineris Cuello',
                oficina: 'Dep. de Arte y folclor',
                telefono: 585045,
                correo: 'bellasartes@unicesar.edu.co'
            }, {
                director: 'Doris Celchar',
                oficina: 'Dep. de Enfermeria',
                telefono: 5848935,
                correo: 'enfermería@unicesar.edu.co'
            }, {
                director: 'Aura Parada',
                oficina: 'Dep. de Microbiologia',
                telefono: 5848938,
                correo: 'enfermería@unicesar.edu.co'
            }, {
                director: 'Arquimedez Mendoza',
                oficina: 'Dep. de Contaduria',
                telefono: 0,
                correo: '*'
            }, {
                director: 'Felix Movilla',
                oficina: 'Dep. de Matematicas',
                telefono: 0,
                correo: '*'
            }, {
                director: 'Reynaldo Ruiz',
                oficina: 'Dep. de Fisica',
                telefono: 0,
                correo: '*'
            }, {
                director: 'Trinidad Montero',
                oficina: 'Dep. de Ciencias naturales',
                telefono: 0,
                correo: '*'
            }, {
                director: 'Omaira Tapia',
                oficina: 'Dep. de Ing. Electronica',
                telefono: 5847328,
                correo: '*'
            }];

            return programas;

        },

        infoDecanaturas: function() {

            var decanaturas;

            decanaturas = [{
                director: 'Efrain Quintero',
                oficina: 'Dec. de Bellas Artes',
                telefono: 5850411,
                correo: 'efrainquintero@unicesar.edu.co'
            }, {
                director: 'Jaime Maestre',
                oficina: 'Dec. de Ciencias de la educación',
                telefono: 5849456,
                correo: 'faceeducacion@unicesar.edu.co'
            }, {
                director: 'Nancy Hernandez',
                oficina: 'Dec. de Salud',
                telefono: 5850464,
                correo: '*'
            }];

        },

        infoAdmon: function() {

            var admon;

            admon = [{
                director: 'Norberto Diaz',
                oficina: 'Cefontev',
                telefono: 3145357278,
                correo: '*'
            }, {
                director: 'Averiguar',
                oficina: 'Sala de profesores',
                telefono: 5847128,
                correo: '*'
            }];

        } */

    };

}