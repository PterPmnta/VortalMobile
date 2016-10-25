angular.module('loginApp', ['ionic', 'ngCordova', 'historialApp'])
    .controller('formulario', formulario)
    .service('obtenerDatos', obtenerDatos)
    .config(config);


config.$inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/login");

    $stateProvider

    //Ingreso

        .state('login', {
            url: '/login',
            templateUrl: "Templates/login.html",
            controller: "formulario"
        })
        .state('Loading', {
            url: '/loading',
            templateUrl: "Templates/loading.html",
            controller: "mostrarMensaje"
        })

    //Estudiante

    .state('menuestu', {
            url: '/menuestu',
            templateUrl: "Templates/Estudiante/menuestu.html",
            controller: "borrarHistorial"
        })
        .state('perfilestu', {
            url: '/perfilestu',
            templateUrl: "Templates/Estudiante/perfilestu.html",
            controller: "mostrarPerfilEstu"
        })
        .state('horarioestu', {
            url: '/horarioestu',
            templateUrl: "Templates/Estudiante/horarioestu.html",
            controller: "mostrarHorarioEstu"
        })
        .state('calificaciones', {
            url: '/calificaciones',
            templateUrl: "Templates/Estudiante/calificaciones.html",
            controller: "mostrarNotasEstu"
        })
        .state('calendarioestu', {
            url: '/calendarioestu',
            templateUrl: "Templates/Estudiante/calendarioestu.html",
            controller: "tareasEstu"
        })

    //Profesor

    .state('menuprof', {
            url: '/menuprof',
            templateUrl: "Templates/Docente/menuprof.html",
            controller: "borrarHistorial"
        })
        .state('perfilprof', {
            url: '/perfilprof',
            templateUrl: "Templates/Docente/perfilprof.html",
            controller: "mostrarPerfilProf"
        })
        .state('horarioprof', {
            url: '/horarioprof',
            templateUrl: "Templates/Docente/horarioprof.html",
            controller: "mostrarHorarioProf"
        })
        .state('grupos', {
            url: '/grupos',
            templateUrl: "Templates/Docente/grupos.html",
            controller: "mostrarGruposProf"
        })
        .state('calendarioprof', {
            url: '/calendarioprof',
            templateUrl: "Templates/Docente/calendarioprof.html",
            controller: "tareasProf"
        })



    .state('oficinas', {
        url: '/oficinas/:tab',
        templateUrl: "Templates/Oficinas/oficinas.html",
        controller: 'iniciarTabs'
    });

};


formulario.$inject = ['$scope', 'obtenerDatos', '$state', '$timeout', '$ionicHistory', '$window', '$cordovaNetwork', 'salirApp'];

function formulario($scope, obtenerDatos, $state, $timeout, $ionicHistory, $window, $cordovaNetwork, salirApp) {

    if ($window.localStorage.estudiante) {
        $state.go('menuestu');
    } else {
        if ($window.localStorage.profesor) {
            $state.go('menuprof');
        } else {
            $state.go('login');
        }

    }

    $scope.networkType = null;
    $scope.connectionType = null;

    $scope.login = function() {

        $window.localStorage.logged = true;

        document.addEventListener("deviceready", function() {
            $scope.networkType = $cordovaNetwork.getNetwork();
            console.log($scope.networkType);
        }, false);

        if ($scope.networkType === 'none') {
            window.plugins.toast.showLongCenter('No existe conexion a internet');
        } else {

            var datos, datosRespuesta, nombreVista, serverStatus;

            datos = {
                Usuario: $scope.usuariotxt,
                Password: $scope.passwordtxt
            };

            if (typeof datos.Usuario === 'undefined' && typeof datos.Password === 'undefined') {

                $scope.respuesta = "Los campos estan vacios";

            } else {

                $state.go('Loading');

                obtenerDatos.Autenticacion(datos).then(function(response) {

                    if (response.data) {

                        datosRespuesta = response.data;
                        serverStatus = response.statusText;

                        if (serverStatus === 'OK') {

                            if (datosRespuesta === "Usuario no registrado" ||
                                datosRespuesta === "Contraseña incorrecta") {

                                $scope.respuesta = datosRespuesta

                                $timeout(function() {
                                    $scope.respuesta = datosRespuesta;
                                    $state.go('login');
                                }, 1000);


                            } else {

                                $scope.usuariotxt = undefined;
                                $scope.passwordtxt = undefined;
                                $scope.respuesta = "";

                                if (datosRespuesta.estudiante) {
                                    $window.localStorage.estudiante = true;
                                    obtenerDatos.insertarDatosEstu(datosRespuesta);
                                } else {
                                    $window.localStorage.profesor = true;
                                    obtenerDatos.insertarDatosDoc(datosRespuesta);
                                };

                                $state.go('Loading');

                                $timeout(function() {
                                    $state.go(datosRespuesta.estudiante ? 'menuestu' : 'menuprof');
                                }, 3000);

                            };

                        } else {
                            $state.go('login');
                            window.plugins.toast.showLongCenter('Problema con el servidor');
                        }


                    } else {

                        console.log(response.status);
                        $scope.respuesta = "Error en la solicitud";
                        $state.go('login');

                    };

                });

            };

        }


    };

    salirApp.salida();

};


obtenerDatos.$inject = ['$http', '$httpParamSerializer', '$cordovaSQLite', '$ionicHistory'];

function obtenerDatos($http, $httpParamSerializer, $cordovaSQLite, $ionicHistory) {

    var datosIngreso, datosUsuario, vista_Actual;

    function Autenticacion(datos) {

        var url = 'http://190.109.185.138/Apipedro/api/login';

        return $http.post(url, $httpParamSerializer(datos), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    };

    function getDatos(info) {
        datosIngreso = info;
    };

    function setDatos() {
        return datosIngreso;
    };


    /*Estudiante*/

    function insertarDatosEstu(datosRespuesta) {

        var db, Perfil, Horario, row, crearTablaPerfil, guardarPerfil, crearTablaHorario, guardarHorario, crearTablaTareasEstu, dropPerfil, dropHorario, dropTareasEstu, Usuario, largo, i;


        Perfil = datosRespuesta.estudiante;
        Horario = datosRespuesta.materias;
        largo = Horario.length;

        crearTablaPerfil = "CREATE TABLE IF NOT EXISTS Estudiante(Cedula integer primary key, Nombre text, Apellido text, Rol integer, Facultad text, Programa text, Semestre integer)";

        guardarPerfil = "INSERT INTO Estudiante(Cedula, Nombre, Apellido, Rol, Facultad, Programa, Semestre) VALUES(?,?,?,?,?,?,?)";

        crearTablaHorario = "CREATE TABLE IF NOT EXISTS Horario(Codigo text primary key, Grupo integer," +
            "Nombre text, Creditos integer, Dia text, Hora text, Lugar text," +
            "Nota1 float, Nota2 float, Nota3 float)";

        guardarHorario = "INSERT INTO Horario(Codigo, Grupo, Nombre, Creditos, Dia, Hora, Lugar, Nota1, Nota2, Nota3)" +
            "VALUES(?,?,?,?,?,?,?,?,?,?)";

        crearTablaTareasEstu = "CREATE TABLE IF NOT EXISTS TareasEstu(Fila integer primary key, Texto text, Fecha text)";

        dropPerfil = "DROP TABLE Estudiante";
        dropHorario = "DROP TABLE Horario";
        dropTareasEstu = "DROP TABLE TareasEstu";

        db = $cordovaSQLite.openDB({
            name: "unicesar.db",
            location: "default"
        });


        $cordovaSQLite.execute(db, dropPerfil);
        $cordovaSQLite.execute(db, dropHorario);
        $cordovaSQLite.execute(db, dropTareasEstu);

        $cordovaSQLite.execute(db, crearTablaPerfil);
        $cordovaSQLite.execute(db, crearTablaHorario);
        $cordovaSQLite.execute(db, crearTablaTareasEstu);

        $cordovaSQLite.execute(db, guardarPerfil, [Perfil.CeduEstu, Perfil.NombEstu, Perfil.ApelEstu, Perfil.RolEstu, Perfil.FacuEstu, Perfil.ProgEstu, Perfil.Semestre]);

        for (i = 0; i < largo; i++) {

            $cordovaSQLite.execute(db, guardarHorario, [Horario[i].CodiAsig, Horario[i].Grupo, Horario[i].NombAsig, Horario[i].Creditos, Horario[i].DiaAsig, Horario[i].HoraAsig, Horario[i].LugarAsig, Horario[i].Nota1, Horario[i].Nota2, Horario[i].Nota3]);

        }

        Usuario = "Estudiante";
        return Usuario;

    };

    /*Docente*/

    function insertarDatosDoc(datosRespuesta) {

        var db, Perfil, Horario, row, crearTablaPerfil_P, guardarPerfil_P, crearTablaHorario_P, guardarHorario_P, crearTablaGrupo,
            insertarGrupos, crearTablaTareasProf, dropPerfil_P, dropHorario_P, dropGrupos, dropTareasProf, Usuario, Largo_Horario, Lista, Largo_Grupo, i, k,
            Cantidad_Estu, Nombre_Asig, Asig_Grupo, Asig_Nsp, Grupo, Grupos;


        Perfil = datosRespuesta.profesor;
        Horario = datosRespuesta.materias;
        Largo_Horario = Horario.length;

        Grupos = [];
        Grupo = {};

        crearTablaPerfil_P = "CREATE TABLE IF NOT EXISTS Profesor(Cedula integer primary key, Nombre text, Apellido text, Rol integer," +
            " Facultad text, Programa text)";

        guardarPerfil_P = "INSERT INTO Profesor(Cedula, Nombre, Apellido, Rol, Facultad, Programa)  VALUES(?,?,?,?,?,?)";

        crearTablaHorario_P = "CREATE TABLE IF NOT EXISTS HorarioP(Codigo text primary key, Grupo integer, Nombre text, Creditos integer," +
            " Dia text, Hora text, Lugar text)";

        guardarHorario_P = "INSERT INTO HorarioP(Codigo, Grupo, Nombre, Creditos, Dia, Hora, Lugar) VALUES(?,?,?,?,?,?,?)";

        crearTablaGrupo = "CREATE TABLE IF NOT EXISTS GruposP(Fila integer primary key, Cedula text, Nombre text," +
            " Apellido text, Nota1 float, Nota2 float, Nota3 float, Habilitacion float, Grupoasig text)";

        insertarGrupos = "INSERT INTO GruposP(Fila, Cedula, Nombre, Apellido, Nota1, Nota2, Nota3, Habilitacion, Grupoasig)" +
            "VALUES(?,?,?,?,?,?,?,?,?)";

        crearTablaTareasProf = "CREATE TABLE IF NOT EXISTS TareasProf(Fila text primary key, Texto text, Fecha text)";

        dropPerfil_P = "DROP TABLE Profesor";
        dropHorario_P = "DROP TABLE HorarioP";
        dropGrupos = "DROP TABLE GruposP";
        dropTareasProf = "DROP TABLE TareasProf";

        Cantidad_Estu = 0;

        db = $cordovaSQLite.openDB({
            name: "unicesar.db",
            location: "default"
        });

        $cordovaSQLite.execute(db, dropPerfil_P);
        $cordovaSQLite.execute(db, dropHorario_P);
        $cordovaSQLite.execute(db, dropGrupos);
        $cordovaSQLite.execute(db, dropTareasProf);

        $cordovaSQLite.execute(db, crearTablaPerfil_P);
        $cordovaSQLite.execute(db, crearTablaHorario_P);
        $cordovaSQLite.execute(db, crearTablaGrupo);
        $cordovaSQLite.execute(db, crearTablaTareasProf);


        $cordovaSQLite.execute(db, guardarPerfil_P, [Perfil.CeduProf, Perfil.NombProf, Perfil.ApelProf, Perfil.RolProf, Perfil.FacuProf,
            Perfil.ProgProf
        ]);

        for (i = 0; i < Largo_Horario; i++) {

            $cordovaSQLite.execute(db, guardarHorario_P, [Horario[i].CodiAsig, Horario[i].Grupo, Horario[i].NombAsig,
                Horario[i].Creditos, Horario[i].DiaAsig, Horario[i].HoraAsig, Horario[i].LugarAsig
            ]);

            Lista = Horario[i].Listado
            Largo_Grupo = Lista.length;

            Nombre_Asig = Horario[i].NombAsig;
            Asig_Nsp = Nombre_Asig.replace(/\s+/g, '');
            Asig_Grupo = (Asig_Nsp + Horario[i].Grupo);

            Grupo = {
                Nombre: Asig_Nsp + '-' + Horario[i].Grupo,
                Codigo: Asig_Grupo
            };

            Grupos.push(Grupo);


            for (k = 0; k < Largo_Grupo; k++) {

                Cantidad_Estu = Cantidad_Estu + 1;

                $cordovaSQLite.execute(db, insertarGrupos, [Cantidad_Estu, Lista[k].CeduEstu, Lista[k].NombEstu, Lista[k].ApelEstu,
                    Lista[k].Nota1, Lista[k].Nota2, Lista[k].Nota3, Lista[k].Habilitacion, Asig_Grupo
                ]);

            }

        }

        localStorage.setItem('GruposProf', JSON.stringify(Grupos));

        Usuario = "Docente";
        return Usuario;

    };


    return {

        Autenticacion: Autenticacion,
        getDatos: getDatos,
        setDatos: setDatos,
        insertarDatosEstu: insertarDatosEstu,
        insertarDatosDoc: insertarDatosDoc

    };

};