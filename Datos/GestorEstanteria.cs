using Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Datos
{
    public class GestorEstanteria
    {
        public static List<Estanteria> GetEstanterias()
        {
            pav2Entidades db = new Datos.pav2Entidades();
            var dbEstanteria = db.estanteria;
            var listaEstanteria = new List<Estanteria>();

            foreach (var e in dbEstanteria)
            {
                listaEstanteria.Add(new Estanteria()
                {
                    Id = e.id,
                    Ubicacion = e.nombre
                });
                
            }

            return listaEstanteria;
        }

        public static Estanteria GetEstanteria(int idx)
        {
            pav2Entidades db = new pav2Entidades();
            var dbEstanteria = db.estanteria;
            var estanteriaBuscada = new Estanteria();

            foreach ( var e in dbEstanteria)
            {
                if (idx == e.id)
                {
                    estanteriaBuscada.Id = e.id;
                    estanteriaBuscada.Ubicacion = e.nombre;
                    return estanteriaBuscada;
                }
            }

            return estanteriaBuscada;

        }
    }
}
