//var app = angular.module("tareasApp", ['angularUtils.directives.dirPagination']);

var app = angular.module("tareasApp", ['ui.bootstrap']);
app.controller("productosController", function ($scope, $http) {

  
    $scope.NOduplicado;
    $scope.productos = [];
    $scope.estanterias = [];
    $scope.PSelec = {
        Id: null,
        NumeroOrden: null,
        Nombre: null,
        Fecha: null,
        Proveedor: null,
        Precio: null,
        EnUso: null,
        IdEstanteria: null,

    };

    $scope.errorNumeroOrden = null;
    $scope.errorNombre = null;
    $scope.errorPrecio = null;
    $scope.errorProveedor = null;
    $scope.errorFecha = null;
    $scope.errorIdEstanteria = null;
    $scope.errorFiltroNumOrd = null;

    $scope.PFiltro = {};
    $scope.PFiltro.Nombre = "";
    $scope.PFiltro.EnUso = null;
    $scope.PFiltro.NumeroOrden = "";
    //va a contener las opciones de filtrado

    $scope.PaginaActual = 1;

    //LOS QUE TRAEN TODO
    $scope.traerEstanterias = function () {
        $http.get("/api/Estanteria/").then(function (response) {
            $scope.estanterias = response.data;
        });
    }


    $scope.cargarProductos = function () {
        $scope.errorFiltroNumOrd = false;

        if (isNaN($scope.PFiltro.NumeroOrden) == true) {
            $scope.errorFiltroNumOrd = true;
            return;
        }

        $scope.mostrar = "tabla";
        params = { Nombre: $scope.PFiltro.Nombre, EnUso: $scope.PFiltro.EnUso, NumeroOrden: $scope.PFiltro.NumeroOrden, numeroPagina: $scope.PaginaActual };
        $http.get("/api/Producto", { params: params }).then(function (response) {
            $scope.productos = response.data.Lista;
            $scope.RegistrosTotal = response.data.RegistrosTotal;
            for (p in $scope.productos) {
                for (e in $scope.estanterias) {
                    if ($scope.productos[p].idEstanteria === $scope.estanterias[e].Id) {
                        $scope.productos[p].NombreEstanteria = $scope.estanterias[e].Ubicacion;
                    }
                }
                //if ($scope.productos[p].idEstanteria === 1) {
                //    $scope.productos[p].NombreEstanteria = "A:A"
                //};
                //if ($scope.productos[p].idEstanteria === 2) {
                //    $scope.productos[p].NombreEstanteria = "A:B"
                //};
                //if ($scope.productos[p].idEstanteria === 3) {
                //    $scope.productos[p].NombreEstanteria = "A:C"
                //};
            }

            
        });
        
    };
    //----------------------------------------

    $scope.limpiarErrores = function () {
        $scope.errorNumeroOrden = false;
        $scope.errorNombre = false;
        $scope.errorFecha = false;
        $scope.errorPrecio = false;
        $scope.errorProveedor = false;
        $scope.errorIdEstanteria = false;
    };

    //Este es cuando haces click en nuevo de la principal/ limpia 
    $scope.nuevo = function () {
        $scope.FormReg.$setUntouched();
        $scope.FormReg.$setPristine();
        $scope.limpiarErrores();
        $scope.mostrar = "alta";
        $scope.PSelec = {
            Id: 0,
            NumeroOrden: 0,
            Nombre: "",
            Fecha: "",
            Proveedor: "",
            Precio: 0,
            EnUso: false,
            IdEstanteria: 0

        }
    };

    ///editar y buscar por ID se encarga de traer las cosas. sin la parte de guardar y modificar
    $scope.editar = function (Dto) {
        $scope.FormReg.$setUntouched();
        $scope.FormReg.$setPristine();//Limpia la grilla
        $scope.mostrar = "editar"; //esto hace que deje de mostrar la lista
        $scope.NOduplicado = Dto.numeroOrden;
        Dto.fecha = new Date(Dto.fecha);
        $scope.buscarPorId(Dto)

    };

    $scope.buscarPorId = function (Dto) {
        $http.get("/api/Producto/" + Dto.id)
            .then(function (response) {
                response.data.Fecha = new Date(response.data.Fecha) //dejar esta conversion si no no lo carga
                $scope.PSelec = response.data; //aca hace que el seleccionado se MAPEE con el que trae la consulta
                console.log(response.data)
        });
    }
    ///--------------------------------------------------------------------

    //Eliminar
    $scope.eliminar = function (Dto) {

        if (confirm("¿Seguro desea eliminar? " + Dto.nombre)) {
            $http.delete("/api/Producto/" + Dto.id).then(function (response) {
                $scope.cargarProductos();
            });
        }
    }

    //se usan para el grabar
    $scope.validar = function () {

        if (isNaN($scope.PSelec.NumeroOrden) == true) {
            alert("Error numero de orden no numerico");
            return true;
        };

        if ($scope.PSelec.NumeroOrden === 0) {
            alert("Error numero de orden no definido");
            $scope.errorNumeroOrden = true;
            return true;
        };

        if ($scope.PSelec.Proveedor === "") {
            $scope.errorProveedor = true;
            return true;
        };

        if ($scope.PSelec.Nombre === "") {
            $scope.errorNombre = true;

            return true;
        };

        if ($scope.PSelec.Fecha == null) {
            $scope.errorFecha = true;

            return true;
        };
        if ($scope.PSelec.Precio === "") {
            $scope.errorPrecio = true;

            return true;
        };

        if ($scope.PSelec.IdEstanteria === 0) {
            $scope.errorIdEstanteria = true;

            return true;
        };

        
        return false;
    };


    //ESTE VA A HACER LAS DOS ! grabar y modificar
    $scope.Grabar = function () {

        $scope.limpiarErrores();

        $scope.PSelec.NumeroOrden = Math.trunc($scope.PSelec.NumeroOrden);
        $scope.PSelec.Precio = Math.trunc($scope.PSelec.Precio);

        var bandera = $scope.validar();
        if (bandera == true) {
            return;
        };
            

        if ($scope.PSelec.Id == 0) { //significa que quiero agregar uno nuevo

            $http.post("/api/Producto/", $scope.PSelec).then(function (response) {

                $scope.mensaje = response.data;

                if ($scope.mensaje === "NOOK") {
                    alert("Numero de Orden duplicado");
                    return;
                }

                alert("Se cargo correctamente");
                
                location.reload();

            });
        }
        else { //significa que quiero modificar

            if (confirm("¿Seguro desea modificar? " + $scope.PSelec.Nombre)) {
                params = { Id: $scope.PSelec.Id, NOduplicado: $scope.NOduplicado };
                $http.put("/api/Producto/" + $scope.PSelec.Id , $scope.PSelec).then(
                    function (response) {

                        $scope.mensaje = response.data;
                        if ($scope.mensaje === "NOOK") {
                            alert("Numero de Orden duplicado");
                            return;
                        }

                        $scope.mostrar = "tabla";
                        $scope.cargarProductos();
                        console.log($scope.producto);
                    });
            }
        }
    }

    //$scope.editarProducto = function () {

    //    //validaciones
    //    if ($scope.producto.Nombre == "") {

    //        alert("debe completar el Nombre");
    //        return;
    //    }
    //    if ($scope.producto.NumeroOrden == "") {

    //        alert("debe completar numero de orden");
    //        return;
    //    }
    //    if (isNaN($scope.producto.NumeroOrden) == true) {

    //        alert("Numero de orden no numerico");
    //        return;
    //    }
    //    if ($scope.producto.Proveedor == "") {

    //        alert("debe seleccionar un proveedor");
    //        return;
    //    }
    //    if ($scope.producto.Fecha == "") {

    //        alert("debe seleccionar un proveedor");
    //        return;
    //    }
    //    if ($scope.producto.Precio == "") {

    //        alert("debe seleccionar un proveedor");
    //        return;
    //    }
    //    if ($scope.producto.IdEstanteria == "") {

    //        alert("debe seleccionar un proveedor");
    //        return;
    //    }
        
    //    if (confirm("¿Seguro desea modificar? "+ $scope.producto.Nombre)) {
    //        $http.put("/api/Producto/" + $scope.producto.Id, $scope.producto).then(
    //            function (response) {
                    
    //                $scope.mensaje = response.data;
    //                if ($scope.mensaje === "NOOK") {
    //                    alert("Numero de Orden duplicado");
    //                    return;
    //                }

    //                $scope.mostrar = "tabla";
    //                $scope.cargarProductos();
    //                console.log($scope.producto);
    //            });
    //    }

    //}

    //$scope.agregarProducto = function () {


    //    if ($scope.Pnuevo.EnUso === null) {
    //        $scope.Pnuevo.EnUso = false;
    //    };


    //    console.log($scope.Pnuevo);



    //    //VALIDACIONES

    //    if (isNaN($scope.Pnuevo.NumeroOrden) == true) {
    //        alert("Error numero de orden no numerico");
    //        
    //        return;
    //    }

    //    if ($scope.Pnuevo.NumeroOrden = null) {
    //        alert("Error numero de orden no definido");
    //        return;
    //    }

    //    if ($scope.Pnuevo.Nombre == null) {
    //        alert("Error Nombre no definido");
    //        return;
    //    }

    //    if ($scope.Pnuevo.Proveedor == null) {
    //        alert("Error Proveedor no definido");
    //        return;
    //    }
    //    if ($scope.Pnuevo.Fecha == null) {
    //        alert("Error Fecha no definido");
    //        return;
    //    }
    //    if ($scope.Pnuevo.Precio == null) {
    //        alert("Error Precio no definido");
    //        return;
    //    }
    //    if ($scope.Pnuevo.IdEstanteria == null) {
    //        alert("Error Id estanteria no definido");
    //        return;
    //    }

    //    $http.post("/api/Producto/", $scope.Pnuevo).then(function (response) {

    //        $scope.mensaje = response.data;

    //        if ($scope.mensaje === "NOOK") {
    //            alert("Numero de Orden duplicado");
    //            return;
    //        }

    //        alert("Se cargo correctamente");
    //       
    //        location.reload();

    //    });

    //};


 ///------------- Funciones extras

    $scope.enviarConsulta = function () {
        document.getElementById("e-mailUsr").value = "";
        document.getElementById("comment").value = "";
        alert("Se ha enviado el mail")
    };

    $scope.volver = function () {

        $scope.mostrar = "tabla";
        $scope.cargarProductos(); //este cargar es para que se cargue la fecha, no tocar
    };

    $scope.impresion = function () {
        window.print();
    };

    $scope.limpiarFiltro = function () {
        $scope.PFiltro.Nombre = "";
        $scope.PFiltro.NumeroOrden = "";
        $scope.PFiltro.EnUso = "";
        $scope.cargarProductos();

    };
    ///FUNCIONES QUE CARGAN COSAS- DEJAR AL FINAL

    
    $scope.traerEstanterias();
    $scope.cargarProductos();

});
