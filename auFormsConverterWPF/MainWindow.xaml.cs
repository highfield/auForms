using Cet.Aurora.Web.PageBuilder;
using Cet.UI;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Xml.Linq;

namespace auFormsConverterWPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            this.Loaded += MainWindow_Loaded;
            this.BtnSelectFolder.Click += BtnSelectFolder_Click;
            this.BtnRefresh.Click += BtnRefresh_Click;
            this.BtnReload.Click += BtnReload_Click;
            this.BtnCopy.Click += BtnCopy_Click;
            this.LstFiles.ItemsSource = this._files;
            this.LstFiles.SelectionChanged += LstFiles_SelectionChanged;
        }


        private void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            this.TxtPath.Text = Properties.Settings.Default.SelectedPath;
            this.ScanFolder();
            this.OpenSourceFile(null);
        }


        private ObservableCollection<string> _files = new ObservableCollection<string>();
        private string _currentSourceFile;
        private string _minifiedOutput;


        private void BtnSelectFolder_Click(object sender, RoutedEventArgs e)
        {
            string[] folders = CommonDialogs.ChooseFolder(
                this,
                this.TxtPath.Text,
                Environment.SpecialFolder.Desktop,
                showNewFolderButton: true,
                title: "Select source files folder"
                );

            if (folders.Any())
            {
                this.TxtPath.Text = folders[0];
                this.ScanFolder();
            }
        }


        private void BtnRefresh_Click(object sender, RoutedEventArgs e)
        {
            this.ScanFolder();
        }


        private void BtnReload_Click(object sender, RoutedEventArgs e)
        {
            this.OpenSourceFile(this._currentSourceFile);
        }


        private void BtnCopy_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(this._minifiedOutput) == false)
            {
                Clipboard.SetText(this._minifiedOutput);
            }
        }


        private void ScanFolder()
        {
            Properties.Settings.Default.SelectedPath = this.TxtPath.Text;
            Properties.Settings.Default.Save();

            this._files.Clear();
            this._currentSourceFile = null;
            this._minifiedOutput = null;
            try
            {
                var path = this.TxtPath.Text ?? string.Empty;
                var folder = new System.IO.DirectoryInfo(path);
                foreach (System.IO.FileInfo fi in folder.EnumerateFiles("*.xml"))
                {
                    this._files.Add(fi.Name);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    this,
                    ex.Message,
                    "Error!",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                    );
            }
        }

        private void LstFiles_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var fname = this.LstFiles.SelectedItem as string;
            this._currentSourceFile = string.IsNullOrEmpty(fname)
                ? string.Empty
                : System.IO.Path.Combine(this.TxtPath.Text, fname);
            this.OpenSourceFile(this._currentSourceFile);
        }


        private void OpenSourceFile(string fileIn)
        {
            this._minifiedOutput = null;
            this.TxtSource.Text = string.Empty;
            this.TxtTarget.Text = string.Empty;
            this.TxtSource.Background = this.Background;
            this.TxtTarget.Background = this.Background;
            if (string.IsNullOrEmpty(fileIn)) return;

            XDocument xin;
            try
            {
                xin = XDocument.Load(fileIn);
            }
            catch (Exception ex)
            {
                this.TxtSource.Text = ex.Message;
                this.TxtSource.Background = Brushes.LightPink;
                return;
            }

            if (xin.Root?.Name.LocalName != "auForm")
            {
                this.TxtSource.Text = "Not a valid 'auForm' template.";
                this.TxtSource.Background = Brushes.LightPink;
                return;
            }

            this.TxtSource.Text = xin.ToString();
            this.TxtSource.Background = Brushes.PaleGreen;

            JObject jout;
            try
            {
                jout = AuFormsHelpers.ConvertRoot(xin);
            }
            catch (Exception ex)
            {
                this.TxtTarget.Text = ex.Message;
                this.TxtTarget.Background = Brushes.LightPink;
                return;
            }

            try
            {
                string fileOut = System.IO.Path.ChangeExtension(fileIn, ".json");
                using (System.IO.StreamWriter file = System.IO.File.CreateText(fileOut))
                using (var writer = new Newtonsoft.Json.JsonTextWriter(file))
                {
                    jout.WriteTo(writer);
                }
            }
            catch (Exception ex)
            {
                this.TxtTarget.Text = ex.Message;
                this.TxtTarget.Background = Brushes.LightPink;
            }

            var sb = new StringBuilder();
            using (var sw = new System.IO.StringWriter(sb))
            using (var writer = new Newtonsoft.Json.JsonTextWriter(sw))
            {
                jout.WriteTo(writer);
            }
            this._minifiedOutput = sb.ToString();

            this.TxtTarget.Text = jout.ToString(Newtonsoft.Json.Formatting.Indented);

            this.TxtTarget.Background = Brushes.PaleGreen;
        }

    }
}
