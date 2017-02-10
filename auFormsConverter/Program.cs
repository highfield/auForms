using Cet.Aurora.Web.PageBuilder;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace auFormsConverter
{
    class Program
    {
        static Program()
        {
            InitConverter();
        }


        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("*** Please specify the source XML file.");
            }

            string fin = args[0];

            string fout;
            if (args.Length > 1)
            {
                fout = args[1];
            }
            else
            {
                fout = Path.ChangeExtension(fin, ".json");
            }

            var xin = XDocument.Load(fin);
            JObject jout = AuFormsHelpers.ConvertRoot(xin);

            using (StreamWriter file = File.CreateText(fout))
            using (JsonTextWriter writer = new JsonTextWriter(file))
            {
                jout.WriteTo(writer);
            }

            Console.WriteLine("Conversione complete.");
        }


        static void InitConverter()
        {
        }
    }
}
