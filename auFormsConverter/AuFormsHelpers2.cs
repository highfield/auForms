using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Cet.Aurora.Web.PageBuilder
{
    public static class AuFormsHelpers
    {
        static AuFormsHelpers()
        {
            _cvInfoMap["row"] = new ConvInfo { Handler = ConvertRow, ElementsAllowed = "*" };
            _cvInfoMap["stack"] = new ConvInfo { Handler = ConvertStack, ElementsAllowed = "*" };
            _cvInfoMap["grid-layout"] = new ConvInfo { Handler = ConvertGridLayout, ElementsAllowed = "*" };
            _cvInfoMap["host"] = new ConvInfo { Handler = ConvertHost };
            _cvInfoMap["icon"] = new ConvInfo { Handler = ConvertIcon };
            _cvInfoMap["textblock"] = new ConvInfo { Handler = ConvertTextBlock };
            _cvInfoMap["textbox"] = new ConvInfo { Handler = ConvertTextBox };
            _cvInfoMap["numbox"] = new ConvInfo { Handler = ConvertNumBox };
            _cvInfoMap["colorbox"] = new ConvInfo { Handler = ConvertColorBox };
            _cvInfoMap["textarea"] = new ConvInfo { Handler = ConvertTextArea };
            _cvInfoMap["checkbox"] = new ConvInfo { Handler = ConvertCheckBox };
            _cvInfoMap["radiobox"] = new ConvInfo { Handler = ConvertRadioBox };
            _cvInfoMap["radioselect"] = new ConvInfo { Handler = ConvertRadioSelect, ElementsAllowed = "option" };
            _cvInfoMap["select"] = new ConvInfo { Handler = ConvertSelect, ElementsAllowed = "option" };
            _cvInfoMap["select2"] = new ConvInfo { Handler = ConvertSelect, ElementsAllowed = "option" };
            _cvInfoMap["multiselect"] = new ConvInfo { Handler = ConvertSelect, ElementsAllowed = "option" };
            _cvInfoMap["pillselect"] = new ConvInfo { Handler = ConvertSelect, ElementsAllowed = "option" };
            _cvInfoMap["option"] = new ConvInfo { Handler = ConvertOption };
            _cvInfoMap["fgdate"] = new ConvInfo { Handler = ConvertPicker };
            _cvInfoMap["fgtime"] = new ConvInfo { Handler = ConvertPicker };
            _cvInfoMap["button"] = new ConvInfo { Handler = ConvertButton };
            _cvInfoMap["panel"] = new ConvInfo { Handler = ConvertPanel, ElementsAllowed = "*" };
        }


        static readonly Dictionary<string, ConvInfo> _cvInfoMap = new Dictionary<string, ConvInfo>();


        public static JObject ConvertRoot(XDocument xin)
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
            jout["type"] = "form";
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


        static JProperty ConvertSection(ConvContext pctx, XElement xsct)
        {
            var name = (string)xsct.Attribute("name");
            if (string.IsNullOrEmpty(name))
            {
                throw new InvalidDataException("Missing section name.");
            }

            var cctx = pctx.CreateChild();
            cctx.XParent = xsct;

            var xnode = xsct.Elements().FirstOrDefault();
            if (xnode != null)
            {
                return new JProperty(name, ConvertNode(cctx, xnode));
            }
            else
            {
                return new JProperty(name, new JObject());
            }
        }


        static JObject ConvertNode(ConvContext pctx, XElement xnode)
        {
            var jnode = new JObject();

            string name = xnode.Name.LocalName;
            int dotpos = name.IndexOf('.');
            if (dotpos >= 0)
            {
                var propName = name.Substring(dotpos + 1);
                var cctx = pctx.CreateChild();
                foreach (XElement xchild in xnode.Elements())
                {
                    JObject jc = ConvertNode(cctx, xchild);
                    pctx.JParent[propName] = jc;
                    break;
                }
                return null;
            }
            else
            {
                ConvInfo cvInfo = _cvInfoMap[name];
                jnode["type"] = name;

                var id = (string)xnode.Attribute("id");
                if (string.IsNullOrEmpty(id) == false)
                {
                    pctx.IdMap[id] = true;
                    jnode["id"] = id;
                }

                ConvertParamString(pctx, xnode, jnode, "halign");
                ConvertParamString(pctx, xnode, jnode, "margin");
                //ConvertThickness(pctx, xnode, jnode, "margin");
                ConvertParamBool(pctx, xnode, jnode, "visible");
                ConvertParamBool(pctx, xnode, jnode, "enabled");

                if (pctx.Parent.ColLabel != null)
                {
                    jnode["gcols"] = new JArray(
                        pctx.Parent.ColLabel.Col1,
                        pctx.Parent.ColLabel.Col2
                        );
                }

                JObject jresult = cvInfo.Handler(pctx, xnode, jnode);

                if (jresult != null)
                {
                    var cctx = pctx.CreateChild();
                    cctx.XParent = xnode;
                    cctx.JParent = jnode;

                    if (string.IsNullOrEmpty(cvInfo.ElementsAllowed))
                    {
                        if (xnode.Elements().Any())
                        {
                            throw new InvalidDataException($"The element {name} does not allow any children elements.");
                        }
                    }
                    else
                    {
                        var jarr = new JArray();
                        bool isJolly = cvInfo.ElementsAllowed == "*";
                        string[] parts = cvInfo.ElementsAllowed.Split(' ');
                        foreach (XElement xchild in xnode.Elements())
                        {
                            if (isJolly || parts.Contains(xchild.Name.LocalName) || xchild.Name.LocalName.Contains('.'))
                            {
                                JObject jc = ConvertNode(cctx, xchild);
                                if (jc != null) jarr.Add(jc);
                            }
                            else
                            {
                                throw new InvalidDataException($"The element {name} does not allow the {xchild.Name.LocalName} element as child.");
                            }
                        }
                        if (jarr.Count != 0)
                        {
                            jresult["nodes"] = jarr;
                        }
                    }
                }

                return jresult;
            }
        }


        static JObject ConvertStack(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamBool(ctx, xnode, jnode, "inline");
            ConvertParamString(ctx, xnode, jnode, "bg");
            ConvertParamString(ctx, xnode, jnode, "overflow-y");
            ConvertParamString(ctx, xnode, jnode, "height");
            ConvertGLColLabel(ctx, xnode, jnode);
            return jnode;
        }


        static JObject ConvertGridLayout(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamString(ctx, xnode, jnode, "bg");
            ConvertGLColLabel(ctx, xnode, jnode);
            return jnode;
        }


        static JObject ConvertPanel(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamString(ctx, xnode, jnode, "bg");
            ConvertStringOrJSON(ctx, xnode, jnode, "header");
            return jnode;
        }


        static JObject ConvertRow(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamString(ctx, xnode, jnode, "bg");
            ConvertParamString(ctx, xnode, jnode, "header");
            return jnode;
        }


        static JObject ConvertHost(ConvContext ctx, XElement xnode, JObject jnode)
        {
            return jnode;
        }


        static JObject ConvertIcon(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            return jnode;
        }


        static JObject ConvertTextBlock(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            return jnode;
        }


        static JObject ConvertTextArea(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            return jnode;
        }


        static JObject ConvertTextBox(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamString(ctx, xnode, jnode, "pre");
            ConvertParamString(ctx, xnode, jnode, "post");
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            ConvertParamBool(ctx, xnode, jnode, "readonly");
            return jnode;
        }


        static JObject ConvertNumBox(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertParamString(ctx, xnode, jnode, "pre");
            ConvertParamString(ctx, xnode, jnode, "post");
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            ConvertParamBool(ctx, xnode, jnode, "readonly");
            return jnode;
        }


        static JObject ConvertColorBox(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            return jnode;
        }


        static JObject ConvertPicker(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            ConvertJSON(ctx, xnode, jnode, "options");
            return jnode;
        }


        static JObject ConvertCheckBox(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            ConvertStringOrJSON(ctx, xnode, jnode, "checked");
            return jnode;
        }


        static JObject ConvertRadioBox(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            ConvertStringOrJSON(ctx, xnode, jnode, "checked");
            ConvertParamString(ctx, xnode, jnode, "value");
            ConvertParamString(ctx, xnode, jnode, "group");
            ConvertJSON(ctx, xnode, jnode, "font");
            return jnode;
        }


        static JObject ConvertRadioSelect(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            ConvertParamString(ctx, xnode, jnode, "group");
            ConvertJSON(ctx, xnode, jnode, "options");
            jnode["enum"] = new JArray();
            return jnode;
        }


        static JObject ConvertSelect(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "value");
            ConvertJSON(ctx, xnode, jnode, "options");
            jnode["enum"] = new JArray();
            return jnode;
        }


        static JObject ConvertOption(ConvContext ctx, XElement xnode, JObject jnode)
        {
            switch (ctx.XParent.Name.LocalName)
            {
                case "radioselect":
                case "select":
                case "multiselect":
                case "pillselect":
                    {
                        var jopt = new JObject();
                        ConvertParamString(ctx, xnode, jopt, "key");
                        ConvertParamString(ctx, xnode, jopt, "icon");
                        jopt["value"] = (string)xnode;

                        var jarr = ctx.JParent["enum"] as JArray;
                        jarr.Add(jopt);
                        return null;
                    }

                default:
                    {
                        //

                        return jnode;
                    }
            }
        }


        static JObject ConvertButton(ConvContext ctx, XElement xnode, JObject jnode)
        {
            ConvertStringOrJSON(ctx, xnode, jnode, "text");
            ConvertStringOrJSON(ctx, xnode, jnode, "icon");
            ConvertStringOrJSON(ctx, xnode, jnode, "cssClass");
            ConvertParamString(ctx, xnode, jnode, "width");
            return jnode;
        }


        static void ConvertParamString(ConvContext ctx, XElement xnode, JObject jnode, string name)
        {
            var text = (string)xnode.Attribute(name);
            if (text == null) return;

            jnode[name] = text;
        }


        static void ConvertParamBool(ConvContext ctx, XElement xnode, JObject jnode, string name)
        {
            var value = (bool?)xnode.Attribute(name);
            if (value == null) return;

            jnode[name] = value;
        }


        static void ConvertJSON(ConvContext ctx, XElement xnode, JObject jnode, string name)
        {
            var text = (string)xnode.Attribute(name);
            if (text == null) return;

            jnode[name] = JToken.Parse(text);
        }


        static void ConvertStringOrJSON(ConvContext ctx, XElement xnode, JObject jnode, string name)
        {
            var text = (string)xnode.Attribute(name);
            if (text == null) return;

            if (text.StartsWith("{") && text.EndsWith("}"))
            {
                jnode[name] = JToken.Parse(text);
            }
            else
            {
                jnode[name] = text;
            }
        }


        static void ConvertThickness(ConvContext ctx, XElement xnode, JObject jnode, string name)
        {
            var text = (string)xnode.Attribute(name);
            if (string.IsNullOrEmpty(text)) return;

            var jthick = new JObject();
            var parts = text.Split(',');
            switch (parts.Length)
            {
                case 1:
                    jthick["top"] = ConvertMetric(parts[0]);
                    jthick["right"] = ConvertMetric(parts[0]);
                    jthick["bottom"] = ConvertMetric(parts[0]);
                    jthick["left"] = ConvertMetric(parts[0]);
                    break;

                case 2:
                    jthick["top"] = ConvertMetric(parts[0]);
                    jthick["right"] = ConvertMetric(parts[1]);
                    jthick["bottom"] = ConvertMetric(parts[0]);
                    jthick["left"] = ConvertMetric(parts[1]);
                    break;

                case 4:
                    jthick["top"] = ConvertMetric(parts[0]);
                    jthick["right"] = ConvertMetric(parts[1]);
                    jthick["bottom"] = ConvertMetric(parts[2]);
                    jthick["left"] = ConvertMetric(parts[3]);
                    break;

                default:
                    throw new InvalidDataException($"Invalid thickness format for: {name}");
            }
            jnode[name] = jthick;
        }


        static string ConvertMetric(string text)
        {
            var unitless = text.All(_ => "0123456789.".Contains(_));
            if (unitless)
            {
                text += "px";
            }
            return text;
        }


        static void ConvertGLColLabel(ConvContext ctx, XElement xnode, JObject jnode)
        {
            var text = (string)xnode.Attribute("grid-col-defs");
            if (text == null) return;

            var parts = text.Split(' ');
            if (parts.Length != 2)
            {
                throw new InvalidDataException($"Invalid grid-col-defs format for: {text}");
            }

            var cl = new GLColLabel();
            if (int.TryParse(parts[0], out cl.Col1) == false)
            {
                throw new InvalidDataException($"Invalid grid-col-defs format for: {text}");
            }

            if (int.TryParse(parts[1], out cl.Col2) == false)
            {
                throw new InvalidDataException($"Invalid grid-col-defs format for: {text}");
            }
            ctx.ColLabel = cl;
        }


        private class ConvInfo
        {
            public Func<ConvContext, XElement, JObject, JObject> Handler;
            public string ElementsAllowed;
        }


        private class GLColLabel
        {
            public int Col1;
            public int Col2;
        }


        private class ConvContext
        {
            public ConvContext Parent;
            public Dictionary<string, bool> IdMap = new Dictionary<string, bool>();
            public XElement XParent;
            public JObject JParent;
            public GLColLabel ColLabel;

            public ConvContext CreateChild()
            {
                return new ConvContext()
                {
                    Parent = this,
                    IdMap = this.IdMap,
                };
            }
        }

    }
}
