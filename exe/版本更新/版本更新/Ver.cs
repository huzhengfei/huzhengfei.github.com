using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace 版本更新
{
    public class VerInfo
    {
        private static readonly SHA1CryptoServiceProvider osha1 = new SHA1CryptoServiceProvider();
        public Dictionary<string, string> filehash = new Dictionary<string, string>();
        public int match = 0;

        public VerInfo(string group)
        {
            this.group = group;
        }

        public string group { get; private set; }

        public void GenHash()
        {
            string[] files = Directory.GetFiles(@group, "*.*", SearchOption.AllDirectories);
            foreach (string f in files)
            {
                if (f.IndexOf(".crc.txt") >= 0
                    ||
                    f.IndexOf(".meta") >= 0
                    ||
                    f.IndexOf(".db") >= 0
                    ) continue;
                GenHashOne(f);
            }
        }

        public void GenHashOne(string filename)
        {
            using (Stream s = File.OpenRead(filename))
            {
                byte[] hash = osha1.ComputeHash(s);
                string shash = Convert.ToBase64String(hash) + "@" + s.Length;
                filename = filename.Substring(group.Length + 1);

                filename = filename.Replace('\\', '/');
                filehash[filename] = shash;
            }
        }

        public string SaveToPath(int ver, string path)
        {
            string outstr = "Ver:" + ver + "|FileCount:" + filehash.Count + "\n";
             outstr = filehash.Aggregate(outstr, (current, f) => current + (f.Key + "|" + f.Value + "\n"));

            //foreach (var f in filehash)
            //{
            //    outstr += f.Key + "|" + f.Value + "\n";
            //}
            string g = @group.Replace('/', '_');
            string outfile = Path.Combine(path, g + ".ver.txt");
            File.WriteAllText(outfile, outstr, Encoding.UTF8);
            using (Stream s = File.OpenRead(outfile))
            {
                byte[] hash = osha1.ComputeHash(s);
                string shash = Convert.ToBase64String(hash);
                return shash;
            }
        }

        public bool Read(int ver, string hash, int filecount, string path)
        {
            string g = @group.Replace('/', '_');
            string file = Path.Combine(path, g + ".ver.txt");
            if (File.Exists(file) == false) return false;
            using (Stream s = File.OpenRead(file))
            {
                byte[] rhash = osha1.ComputeHash(s);
                string shash = Convert.ToBase64String(rhash);
                if (shash != hash) return false; //Hash 不匹配
            }
            string txt = File.ReadAllText(file, Encoding.UTF8);
            string[] lines = txt.Split(new[] {"\n", "\r"}, StringSplitOptions.RemoveEmptyEntries);
            foreach (string l in lines)
            {
                if (l.IndexOf("Ver:") == 0)
                {
                    string[] sp = l.Split(new[] {"Ver:", "|FileCount:"}, StringSplitOptions.RemoveEmptyEntries);
                    int mver = int.Parse(sp[0]);
                    int mcount = int.Parse(sp[1]);
                    if (ver != mver) return false;
                    if (mcount != filecount) return false;
                }
                else
                {
                    string[] sp = l.Split('|');
                    filehash[sp[0]] = sp[1];
                }
            }
            return true;
        }
    }

    public class Verall
    {
        public Dictionary<string, VerInfo> groups = new Dictionary<string, VerInfo>();
        public int ver; //版本号

        public override string ToString()
        {
            int useful = 0;
            int filecount = 0;
            int filematch = 0;
            foreach (var i in groups)
            {
                if (i.Value.match > 0) useful++;
                filematch += i.Value.match;
                filecount += i.Value.filehash.Count;
            }
            return "ver=" + ver + " group=(" + useful + "/" + groups.Count + ") file=(" + filematch + "/" + filecount +
                   ")";
        }

        public static Verall Read(string path)
        {
            if (File.Exists(Path.Combine(path, "allver.ver.txt")) == false)
            {
                return null;
            }
            string txt = File.ReadAllText(Path.Combine(path, "allver.ver.txt"), Encoding.UTF8);
            string[] lines = txt.Split(new[] {"\n", "\r"}, StringSplitOptions.RemoveEmptyEntries);
            var var = new Verall();
            foreach (string l in lines)
            {
                if (l.IndexOf("Ver:") == 0)
                {
                    var.ver = int.Parse(l.Substring(4));
                }
                else
                {
                    string[] sp = l.Split('|');
                    var.groups[sp[0]] = new VerInfo(sp[0]);
                    var.groups[sp[0]].Read(var.ver, sp[1], int.Parse(sp[2]), path);
                }
            }
            return var;
        }

        public void SaveToPath(string path)
        {
            var grouphash = new Dictionary<string, string>();
            foreach (VerInfo i in groups.Values)
            {
                grouphash[i.group] = i.SaveToPath(ver, path);
            }

            string outstr = "Ver:" + ver + "\n";
            outstr = grouphash.Aggregate(outstr, (current, g) => current + (g.Key + "|" + g.Value + "|" + groups[g.Key].filehash.Count + "\n"));
            File.WriteAllText(Path.Combine(path, "allver.ver.txt"), outstr, Encoding.UTF8);
        }
    }
}