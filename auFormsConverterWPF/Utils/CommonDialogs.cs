using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
//using System.Windows.Forms;
using System.Windows.Interop;
using Microsoft.Win32;


namespace Cet.UI
{
    public static class CommonDialogs
    {
        public const string DefaultTextFilter = "Text files (*.txt)|*.txt|All files (*.*)|*.*";
        public const string DefaultXmlFilter = "XML files (*.xml)|*.xml|All files (*.*)|*.*";
        public const string DefaultImageFilter = "Image files (*.bmp, *.gif, *.ico, *.jpg, *.png, *.wdp, *.tiff)|*.bmp;*.gif;*.ico;*.jpg;*.png;*.wdp;*.tiff|All files (*.*)|*.*";

        public const string DefaultImageTitle = "Select image...";


        public static string[] OpenFile(
            DependencyObject owner,
            string initialFileName,
            bool multipleSelection,
            string title,
            string filter
            )
        {
            var dialog = new OpenFileDialog();
            dialog.AddExtension = false;
            dialog.CheckFileExists = true;
            dialog.CheckPathExists = true;
            dialog.DereferenceLinks = false;
            dialog.FileName = initialFileName;
            dialog.Filter = filter;
            dialog.Multiselect = multipleSelection;
            dialog.RestoreDirectory = true;
            dialog.Title = title;

            bool? result;

            if (owner == null)
            {
                result = dialog.ShowDialog();
            }
            else
            {
                result = dialog.ShowDialog(Window.GetWindow(owner));
            }

            if (result == true)
            {
                //conferma la scelta
                return dialog.FileNames;
            }

            return new string[0];
        }


        public static string[] OpenImageFile(
            DependencyObject owner,
            string initialFileName,
            bool multipleSelection,
            string title = DefaultImageTitle,
            string filter = DefaultImageFilter
            )
        {
            var dialog = new OpenFileDialog();
            dialog.AddExtension = false;
            dialog.CheckFileExists = true;
            dialog.CheckPathExists = true;
            dialog.DereferenceLinks = false;
            dialog.FileName = initialFileName;
            dialog.Filter = filter;
            dialog.Multiselect = multipleSelection;
            dialog.RestoreDirectory = true;
            dialog.Title = title;

            bool? result;

            if (owner == null)
            {
                result = dialog.ShowDialog();
            }
            else
            {
                result = dialog.ShowDialog(Window.GetWindow(owner));
            }

            if (result == true)
            {
                //conferma la scelta
                return dialog.FileNames;
            }

            return new string[0];
        }


        public static string[] SaveFile(
            DependencyObject owner,
            string initialFileName,
            bool overwritePrompt,
            string title,
            string filter
            )
        {
            var dialog = new SaveFileDialog();
            dialog.AddExtension = true;
            dialog.CheckFileExists = false;
            dialog.CheckPathExists = true;
            dialog.DereferenceLinks = false;
            dialog.FileName = initialFileName;
            dialog.Filter = filter;
            dialog.OverwritePrompt = overwritePrompt;
            dialog.RestoreDirectory = true;
            dialog.Title = title;

            bool? result;

            if (owner == null)
            {
                result = dialog.ShowDialog();
            }
            else
            {
                result = dialog.ShowDialog(Window.GetWindow(owner));
            }

            if (result == true)
            {
                //conferma la scelta
                return dialog.FileNames;
            }

            return new string[0];
        }


#if true
        public static string[] ChooseFolder(
            DependencyObject owner,
            string selectedPath,
            Environment.SpecialFolder rootFolder,
            bool showNewFolderButton,
            string title
            )
        {
            var collection = new List<string>();

            using (var fsd = new FolderSelectDialog())
            {
                fsd.Title = title;
                fsd.InitialDirectory = selectedPath;

                var window = Window.GetWindow(owner);
                var wih = new WindowInteropHelper(window);

                if (fsd.ShowDialog(wih.Handle))
                {
                    collection.Add(fsd.FileName);
                }
            }

            return collection.ToArray();
        }
#else
        public static string[] ChooseFolder(
            DependencyObject owner,
            string selectedPath,
            Environment.SpecialFolder rootFolder,
            bool showNewFolderButton,
            string description)
        {
            //crea l'istanza di dialog
            using (var browser = new System.Windows.Forms.FolderBrowserDialog())
            {
                //fissa i parametri di visualizzazione
                browser.ShowNewFolderButton = showNewFolderButton;
                browser.RootFolder = rootFolder;
                browser.SelectedPath = selectedPath;
                browser.Description = description;

                //mostra il dialog ed attende il risultato
                System.Windows.Forms.DialogResult result;

                if (owner == null)
                {
                    result = browser.ShowDialog();
                }
                else
                {
                    //e' necessaria una conversione tra Wpf e WinForms
                    var window = Window.GetWindow(owner);
                    var wih = new WindowInteropHelper(window);
                    var win32 = new Win32Window
                    {
                        Handle = wih.Handle
                    };

                    result = browser.ShowDialog(win32);
                }

                if (result == System.Windows.Forms.DialogResult.OK)
                {
                    //conferma la scelta
                    return new[] { browser.SelectedPath };
                }

                return new string[0];
            }
        }

        private class Win32Window
            : System.Windows.Forms.IWin32Window
        {
            public IntPtr Handle { get; set; }
        }
#endif

    }
}
