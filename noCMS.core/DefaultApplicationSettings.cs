using System.Collections.Generic;
using System.Linq;

namespace noCMS.core
{
    public class DefaultApplicationSettings : IApplicationSettings
    {
        private bool _allProtected;

        public List<KeyValuePair<string, string>> ImplementedLanguages
        {
            get
            {
                return new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("en-US", "USA"),
                    new KeyValuePair<string, string>("es-MX", "MEX"),
                    new KeyValuePair<string, string>("pt-BR", "BRA"),
                    new KeyValuePair<string, string>("es-CL", "CHL"),
                    new KeyValuePair<string, string>("es-AR", "ARG"),
                    new KeyValuePair<string, string>("zh-HK", "HKG"),
                    new KeyValuePair<string, string>("zh-CN", "CHN"),
                    new KeyValuePair<string, string>("zh-TW", "TWN"),
                    new KeyValuePair<string, string>("hi-IN", "IND"),
                    new KeyValuePair<string, string>("ja-JP", "JPN"),
                    new KeyValuePair<string, string>("ko-KR", "KOR"),
                    new KeyValuePair<string, string>("en-PH", "PHL"),
                    new KeyValuePair<string, string>("ms-MY", "MYS"),
                    new KeyValuePair<string, string>("en-SG", "SGP"),
                    new KeyValuePair<string, string>("id-ID", "IDN"),
                    new KeyValuePair<string, string>("vi-VN", "VNM"),
                    new KeyValuePair<string, string>("th-TH", "THA"),
                    new KeyValuePair<string, string>("en-AU", "AUS"),
                    new KeyValuePair<string, string>("en-NZ", "NZL"),
                    new KeyValuePair<string, string>("en-GB", "GBR"),
                    new KeyValuePair<string, string>("sv-SE", "SWE"),
                    new KeyValuePair<string, string>("fi-FI", "FIN"),
                    new KeyValuePair<string, string>("nb-NO", "NOR"),
                    new KeyValuePair<string, string>("de-DE", "DEU"),
                    new KeyValuePair<string, string>("it-IT", "ITA"),
                    new KeyValuePair<string, string>("nl-NL", "NLD"),
                    new KeyValuePair<string, string>("el-GR", "GRC"),
                    new KeyValuePair<string, string>("da-DK", "DNK"),
                    new KeyValuePair<string, string>("de-CH", "CHE"),
                    new KeyValuePair<string, string>("nl-BE", "BEL"),
                    new KeyValuePair<string, string>("fr-FR", "FRA"),
                    new KeyValuePair<string, string>("es-ES", "ESP"),
                    new KeyValuePair<string, string>("pl-PL", "POL"),
                    new KeyValuePair<string, string>("cs-CZ", "CZE"),
                    new KeyValuePair<string, string>("pt-PT", "PRT"),
                    new KeyValuePair<string, string>("de-AT", "AUT"),
                    new KeyValuePair<string, string>("ru-RU", "RUS"),
                    new KeyValuePair<string, string>("uk-UA", "UKR"),
                    new KeyValuePair<string, string>("ar-AE", "ARE"),
                    new KeyValuePair<string, string>("ar-EG", "EGY"),
                    new KeyValuePair<string, string>("he-IL", "ISR"),
                    new KeyValuePair<string, string>("en-ZA", "ZAF"),
                    new KeyValuePair<string, string>("ig-NG", "NGA"),
                    new KeyValuePair<string, string>("tr-TR", "TUR")
                };
            }
        }

        public List<KeyValuePair<string, string>> RedirectMap
        {
            get
            {
                return new List<KeyValuePair<string, string>>
                {
                };
            }
        }

        public List<KeyValuePair<string, string>> LocalLanguageDomainMap
        {
            get
            {
                return new List<KeyValuePair<string, string>>
                {

                };
            }
        }

        public string NoRedirectCookieName
        {
            get { return "bleenComNoRedirect"; }
        }

        public string NoRedirectQueryStringParamName
        {
            get { return "ncr"; }
        }

        public bool ForceCultureDomainRedirect { get { return true;  } }
        public bool CreateContentOnAllLanguages { get { return true; } }
        public bool ShouldGoToFirstMenuItem { get { return true; } }
        public bool AllProtected { get { return _allProtected; } }
        public bool MultiLanguage { get { return true; } }
        public string DefaultLanguage { get { return "en-US".ToLower(); } }


        public string LanguageConstraint
        {
            get
            {
                string res = ImplementedLanguages.Aggregate(string.Empty, (current, implementedLanguage) => current + ("(" + implementedLanguage.Key.ToLower() + ")|"));
                res += RedirectMap.Aggregate(string.Empty,
                    (current, redirectMapEntry) => current + ("(" + redirectMapEntry.Key.ToLower() + ")|"));
                
                if (res.Last() == '|')
                    res = res.Remove(res.Length - 1);
                return res;
            }
        }

        public string AdminUrlRoot
        {
            get { return "admin".ToLower(); }
        }

        public string BaseHttp
        {
            get { return "http://"; }
        }
    }
}