using Datos;
using Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Proyecto_Presentacion.Controllers
{
    public class ProductoController : ApiController
    {
        // GET: api/Producto
        public IHttpActionResult Get(string Nombre = "" , bool? EnUso = null, int numeroPagina =1 , string NumeroOrden = "")///NUNCA CAMBIAR EL NOMBRE DEL METODO SI LO Q RETURNEA
        {
            int RegistrosTotal;
            var Lista = GestorProducto.GetProductos(Nombre, EnUso, numeroPagina, NumeroOrden ,out RegistrosTotal);
            return Ok(new { Lista = Lista, RegistrosTotal = RegistrosTotal });
        }

        // GET: api/Producto/5
        public Producto Get(int id)
        {
            return GestorProducto.GetProducto(id);
        }

        // POST: api/Producto
        public String Post(Producto p)
        {
            
             var mensaje =GestorProducto.CrearProducto(p);
            return mensaje;
            
        }

        // PUT: api/Producto/5
        public String Put(int id,Producto p)
        {
            var mensaje = GestorProducto.EditarProducto(p);
            return mensaje;
        }

        // DELETE: api/Producto/5
        public void Delete(int id)
        {
            GestorProducto.EliminarProducto(id);
        }

    }
}
