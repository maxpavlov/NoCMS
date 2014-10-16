using System;
using System.Text.RegularExpressions;
using UnidecodeSharpFork;

namespace noCMS.demo.Areas.Admin
{
    public static class SlugMarker
    {
        public static string MakeUrl(String incoming)
        {
            //if (incoming.Length > 90) incoming = incoming.Substring(0, 90);
            incoming = incoming.Unidecode();
            incoming = incoming.Replace(" ", "_");
            var alphaNum = Regex.Replace(incoming, @"[^A-Za-z0-9_]+", "");
            return alphaNum;
        }
    }
}