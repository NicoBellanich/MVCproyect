using Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace Datos
{
    public class GestorProducto
    {
        public static List<producto> GetProductos(string Nombre, bool? EnUso, int numeroPagina, string NumeroOrden, out int RegistrosTotal)
        {
            

            using (pav2Entidades db = new pav2Entidades())
            {
                //var dbEstanterias = db.estanteria;

                IQueryable<producto> consulta =db.producto;

                if (!string.IsNullOrEmpty(Nombre))
                {
                    consulta = consulta.Where(x => x.nombre.ToUpper().Contains(Nombre.ToUpper()));
                }
                if (EnUso != null)
                {
                    consulta = consulta.Where(x => x.enUso == EnUso);
                }
                if (!string.IsNullOrEmpty(NumeroOrden))
                {
                    consulta = consulta.Where(x => x.numeroOrden.ToString().Equals(NumeroOrden));
                }


                RegistrosTotal = consulta.Count();

               

                int RegistroDesde = (numeroPagina - 1) * 5;
                var lista = consulta.OrderBy(x => x.nombre).Skip(RegistroDesde).Take(5).ToList();
                

                return lista;

            }

            //pav2Entidades db = new Datos.pav2Entidades();
            //var dbProducto = db.producto;
            //var dbEstanteria = db.estanteria;
            //var listaProductos = new List<Producto>();
            //var estanteriaNombre = "";
            //{
            //    //devolver TODOS
            //    foreach (var p in dbProducto)
            //    {

            //        foreach (var e in dbEstanteria)
            //        {
            //            if (p.idEstanteria == e.id)
            //            {
            //                estanteriaNombre = e.nombre;
            //            }
            //        }


            //        listaProductos.Add(new Producto()
            //        {
            //            Id = p.id,
            //            NumeroOrden = p.numeroOrden,
            //            Proveedor = p.proveedor,
            //            Nombre = p.nombre,
            //            Fecha = (DateTime)p.fecha,
            //            Precio = (int)p.precio,
            //            EnUso = (bool)p.enUso,
            //            IdEstanteria = (int)p.idEstanteria,
            //            NombreEstanteria = estanteriaNombre


            //        });

            //    }
            //}


            //return listaProductos; //.where
        }


        //OBTENER UNO
        public static Producto GetProducto(int idx)
        {
            pav2Entidades db = new pav2Entidades();
            var dbProducto = db.producto;
            var productoBuscado = new Producto();

            foreach(var p in dbProducto)
            {
                if(p.id== idx)
                {
                    productoBuscado.Id = p.id;
                    productoBuscado.NumeroOrden = p.numeroOrden;
                    productoBuscado.Proveedor = p.proveedor;
                    productoBuscado.Nombre = p.nombre;
                    productoBuscado.Fecha =(DateTime) p.fecha;
                    productoBuscado.Precio = (Int32)p.precio;
                    productoBuscado.EnUso = (bool)p.enUso;
                    productoBuscado.IdEstanteria = p.idEstanteria;
                    //cuidado que esto no devuelve EL NOMBRE DE LA ESTANTERIA, El nombre lo consigue en el ng-options
                    return productoBuscado;
                }
            }
                   
            return productoBuscado;
            


        }



        //ABMC
        public static void EliminarProducto(int idx)
        {
            pav2Entidades db = new pav2Entidades();
            var eliminar = db.producto.Find(idx);
            if (eliminar != null)
            {
                db.producto.Remove(eliminar);
                db.SaveChanges();
            }
        }

        public static String CrearProducto(Producto p)
        {
            pav2Entidades db = new pav2Entidades();
            var mensaje = "";
            foreach (var item in db.producto)
            {
                if (item.numeroOrden == p.NumeroOrden)
                {
                    mensaje = "NOOK";
                    return mensaje;
                }
            }

            var nuevoProducto = new producto()
                {

                    numeroOrden = p.NumeroOrden,
                    proveedor = p.Proveedor,
                    nombre = p.Nombre,
                    fecha = p.Fecha,
                    precio = p.Precio,
                    enUso = p.EnUso,
                    idEstanteria = p.IdEstanteria

                };

             
                db.producto.Add(nuevoProducto);
                db.SaveChanges(); /// aca NO GUARDA
            mensaje = "SIOK";
            return mensaje;
              
        }

        public static String EditarProducto(Producto p)
        {
            pav2Entidades db = new pav2Entidades();
            var producto = db.producto.Find(p.Id);


            var mensaje = "";

            if (producto == null)
            {
                return mensaje = "NOENCONTRADO";
                
            }

            foreach (var item in db.producto )
            {
                if (item.numeroOrden == p.NumeroOrden && producto.numeroOrden != p.NumeroOrden)///555555
                {
                    mensaje = "NOOK";
                    return mensaje;
                }

            }

            if (producto != null)
            {

                if (mensaje == "")
                {
                    producto.numeroOrden = p.NumeroOrden;
                    producto.nombre = p.Nombre;
                    producto.fecha = p.Fecha;
                    producto.precio = p.Precio;
                    producto.proveedor = p.Proveedor;
                    producto.enUso = p.EnUso;
                    producto.idEstanteria = p.IdEstanteria;
                    mensaje = "SIOK";

                }

            }

            db.SaveChanges();
            
            return mensaje;
            
            
        }

    }
}
