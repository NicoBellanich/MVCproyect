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
    public class EstanteriaController : ApiController
    {
        // GET: api/Estanteria
        public List<Estanteria> Get()
        {
            return GestorEstanteria.GetEstanterias();
        }

        // GET: api/Estanteria/5
        public Estanteria Get(int id)
        {
            return GestorEstanteria.GetEstanteria(id);
        }

        // POST: api/Estanteria
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Estanteria/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Estanteria/5
        public void Delete(int id)
        {
        }
    }
}
