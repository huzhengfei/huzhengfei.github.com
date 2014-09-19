using System;
using System.Collections.Generic;
using System.IO;
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

namespace 版本更新
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        Verall _ver = null;
        Verall _vernew = null;
        public MainWindow()
        {
            InitializeComponent();
           
            
        }
        private void Win_Load(object sender, EventArgs e)
        {
            InitVerAndPath();
            ListBoxConsole.Items.Add(_ver.ToString());
            foreach (var v in _ver.groups)
            {
                ListBoxGroup.Items.Add(v.Key);
            }
        }

        void InitVerAndPath()
        {
            _ver = Verall.Read("./");
            if (_ver == null)
            {
                _ver = new Verall();
                string[] groups = Directory.GetDirectories("./");
                foreach (var g in groups)
                {
                    string path = g.Substring(2).ToLower();
                    if (path.IndexOf("path") == 0)
                    {
                        continue;
                    }
                    _ver.groups[path] = new VerInfo(path);
                }
                _ver.ver = 0;
            }
        }
        void FileToTower(string rootp)
        {
            string[] sDirectories = Directory.GetDirectories(rootp);
            DirectoryInfo dir = new DirectoryInfo(rootp);

            foreach (string path in sDirectories)
            {

                FileToTower(path);
            }

            FileInfo[] files = dir.GetFiles(); // 获取所有文件信息。。
            foreach (FileInfo file in files)
            {

                if (file.Name == file.Name.ToLower()) continue;

                string newfilefull = file.Directory + "\\" + file.Name.ToLower();
                ListBoxConsole.Items.Add("修改了" + file.Name);
                File.Move(file.FullName, newfilefull);

            }

        }

        void CheckVer()
        {
            _vernew = new Verall();
            string[] groups = Directory.GetDirectories("./");
            foreach (var g in groups)
            {
                string path = g.Substring(2).ToLower();
                if (path.IndexOf("path") == 0)
                {
                    continue;
                }
                if (_ver.groups.ContainsKey(path) == false)
                {
                    ListBoxConsole.Items.Add("目录未包含:" + path + " 如果需要增加，修改allver增加一行");
                }

            }
            int delcount = 0;
            int updatecount = 0;
            int addcount = 0;
            foreach (var g in _ver.groups)
            {
                _vernew.groups[g.Key] = new VerInfo(g.Key);
                _vernew.groups[g.Key].GenHash();
                foreach (var f in g.Value.filehash)
                {
                    if (_vernew.groups[g.Key].filehash.ContainsKey(f.Key) == false)
                    {
                        ListBoxConsole.Items.Add("文件被删除：" + g.Key + ":" + f.Key);
                        delcount++;
                    }
                    else
                    {
                        string hash = _vernew.groups[g.Key].filehash[f.Key];
                        string oldhash = g.Value.filehash[f.Key];
                        if (hash != oldhash)
                        {
                            ListBoxConsole.Items.Add("文件更新：" + g.Key + ":" + f.Key);
                            updatecount++;
                        }
                    }
                }
                foreach (var f in _vernew.groups[g.Key].filehash)
                {
                    if (g.Value.filehash.ContainsKey(f.Key) == false)
                    {
                        ListBoxConsole.Items.Add("文件增加：" + g.Key + ":" + f.Key);
                        addcount++;
                    }
                }

            }

            if (addcount == 0 && delcount == 0 && updatecount == 0)
            {
                _vernew.ver = _ver.ver;
                ListBoxConsole.Items.Add("无变化 ver=" + _vernew.ver);
            }
            else
            {
                _vernew.ver = _ver.ver + 1;
                ListBoxConsole.Items.Add("检查变化结果 add:" + addcount + " remove:" + delcount + " update:" + updatecount);
                ListBoxConsole.Items.Add("版本号变为:" + _vernew.ver);
            }
            //ver = vernew;
        }
        void GenVer()
        {
            if (_vernew == null)
            {
                ListBoxConsole.Items.Add("先检查一下版本再生成");
                return;
            }
            if (_vernew.ver == _ver.ver)
            {
                ListBoxConsole.Items.Add("版本无变化");
                //return;
            }
            _vernew.SaveToPath("./");

            ListBoxConsole.Items.Add("生成OK Ver:" + _vernew.ver);
            _ver = _vernew;
            ListBoxGroup.Items.Clear();
            foreach (var v in _ver.groups)
            {
                ListBoxGroup.Items.Add(v.Key);
            }
        }

        private void listBoxGroup_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_ver.groups.ContainsKey(ListBoxGroup.SelectedItem as string))
            {
                var group = _ver.groups[ListBoxGroup.SelectedItem as string];
                ListBoxFiles.Items.Clear();
                foreach (var f in group.filehash)
                {
                    ListBoxFiles.Items.Add(f.Key + "|" + f.Value);
                }
            }
        }

        private void ClearButton_Click(object sender, RoutedEventArgs e)
        {
            ListBoxConsole.Items.Clear();
        }

        private void CreateButton_Click(object sender, RoutedEventArgs e)
        {
            GenVer();
        }

        private void CheckButton_Click(object sender, RoutedEventArgs e)
        {
            CheckVer();
        }


        private void UIElement_OnMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.LeftButton == MouseButtonState.Pressed)
            {
                DragMove();
            }
           
        }
        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            MessageBoxResult result = MessageBox.Show("您真的要退出吗？", "提示", MessageBoxButton.YesNo, MessageBoxImage.Question);
            if (result == MessageBoxResult.Yes)
            {
                Application.Current.Shutdown();
            }
            else
            {
                e.Cancel = true;
            }
        }

       
    }
}
