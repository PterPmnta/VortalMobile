angular.module('salirApp', ['ionic', 'loadingPage'])
    .controller('appExit', appExit)
    .factory('fabricaSalida', fabricaSalida);


appExit.$inject = ['$scope', '$ionicPopup', '$state', 'obtenerVista'];

function appExit($scope, $ionicPopup, $state, obtenerVista) {

    var vista_Anterior;

    obtenerVista.nombreVista();

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
            if (res) {
                $state.go('Loading');
            } else {
                console.log('Cancelando');
            }
        });
    };

}