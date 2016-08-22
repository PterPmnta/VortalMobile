angular.module('loadingPage', ['ionic', 'loginApp'])
    .controller('mostrarMensaje', mostrarMensaje)
    .factory('obtenerVista', obtenerVista);

mostrarMensaje.$inject = ['$scope', '$window'];

function mostrarMensaje($scope, $window) {

    $scope.$on('$ionicView.beforeEnter', function() {
        if ($window.localStorage.logged) {
            $scope.mensaje = "Cargando informacion";
        } else {
            $scope.mensaje = "Cerrando sesion";
        }
    });

}


obtenerVista.$inject = ['$ionicHistory'];

function obtenerVista($ionicHistory) {

    return {

        nombreVista: function() {

            var vista;
            vista = $ionicHistory.backView();
            return vista;

        }

    };

}