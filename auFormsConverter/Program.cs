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
            JObject jout = ConvertRoot(xin);

            using (StreamWriter file = File.CreateText(fout))
            using (JsonTextWriter writer = new JsonTextWriter(file))
            {
                jout.WriteTo(writer);
            }

            Console.WriteLine("Conversione complete.");
        }


        static JObject ConvertRoot(XDocument xin)
        {
            XElement xroot = xin.Root;
            if (xroot == null ||
                xroot.Name != (XName)"auForm"
                )
            {
                throw new InvalidDataException("Bad or missing root element.");
            }

            var ctx = new ConvContext();

            var jout = new JObject();
            foreach (XElement xsct in xroot.Elements("section"))
            {
                JProperty jsct = ConvertSection(ctx, xsct);
                if (jout.Property(jsct.Name) != null)
                {
                    throw new InvalidDataException($"Duplicate section name: {jsct.Name}");
                }
                jout.Add(jsct);
            }
            return jout;
        }


        static JProperty ConvertSection(ConvContext ctx, XElement xsct)
        {
            var name = (string)xsct.Attribute("name");
            if (string.IsNullOrEmpty(name))
            {
                throw new InvalidDataException("Missing section name.");
            }

            var xnode = xsct.Elements().FirstOrDefault();
            if (xnode != null)
            {
                return new JProperty(name, ConvertNode(ctx, xnode));
            }
            else
            {
                return new JProperty(name, new JObject());
            }
        }


        static JObject ConvertNode(ConvContext ctx, XElement xnode)
        {
            var jnode = new JObject();

            var name = xnode.Name.LocalName;
            ConvInfo cvInfo = _cvInfoMap[name];
            jnode["type"] = name;

            var id = (string)xnode.Attribute("id");
            if (string.IsNullOrEmpty(id) == false)
            {
                ctx.IdMap[id] = true;
                jnode["id"] = id;
            }

            cvInfo.Handler(ctx, xnode, jnode);

            bool hasChildren = xnode.Elements().Any();
            if (cvInfo.AllowsChildren)
            {
                if (hasChildren)
                {
                    jnode["nodes"] = new JArray(
                        xnode.Elements().Select(_ => ConvertNode(ctx, _))
                        );
                }
                else
                {
                    jnode["nodes"] = new JArray();
                }
            }
            else if (hasChildren)
            {
                throw new InvalidDataException($"The element {name} does not allow children elements.");
            }

            return jnode;
        }


        static void ConvertHStack(ConvContext ctx, XElement xnode, JObject jnode)
        {
            //
        }


        static void ConvertButton(ConvContext ctx, XElement xnode, JObject jnode)
        {
            jnode["label"] = (string)xnode.Attribute("label");
            jnode["icon"] = (string)xnode.Attribute("icon");
        }


        static readonly Dictionary<string, ConvInfo> _cvInfoMap = new Dictionary<string, ConvInfo>();


        static void InitConverter()
        {
            _cvInfoMap["hstack"] = new ConvInfo { Handler = ConvertHStack, AllowsChildren = true };
            _cvInfoMap["button"] = new ConvInfo { Handler = ConvertButton };
        }


        private class ConvInfo
        {
            public Action<ConvContext, XElement, JObject> Handler;
            public bool AllowsChildren;
        }


        private class ConvContext
        {
            public readonly Dictionary<string, bool> IdMap = new Dictionary<string, bool>();
        }

    }
}
