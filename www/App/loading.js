angular.module('loadingPage', ['ionic', 'loginApp'])
    .controller('mostrarMensaje', mostrarMensaje)
    .factory('obtenerVista', obtenerVista);

mostrarMensaje.$inject = ['$scope', 'obtenerVista', '$window'];

function mostrarMensaje($scope, obtenerVista, $window) {    

    console.log($window.localStorage.logged);

    if (!$window.localStorage.logged) {
        $scope.mensaje = "Cargando Información";
    } else {
        $scope.mensaje = "Cerrando sesión";
    }
   
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