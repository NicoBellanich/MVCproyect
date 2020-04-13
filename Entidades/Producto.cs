using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades
{
    public class Producto
    {
        //[Key][DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        //[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public int NumeroOrden { get; set; }
        public string Proveedor { get; set; }
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public int Precio { get; set; }
        public bool EnUso { get; set; }
        public int IdEstanteria { get; set; }
        public String NombreEstanteria { get; set; }
    }
}
