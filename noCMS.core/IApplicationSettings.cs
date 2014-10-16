using System.Collections.Generic;

namespace noCMS.core
{
    public interface IApplicationSettings
    {
        /// <summary>
        /// Use this to input all the languages that current site instance serves.
        /// Value in the KVP is cosmetic, in case it's needed to display somewhere. 
        /// </summary>
        List<KeyValuePair<string, string>> ImplementedLanguages { get; }
        
        /// <summary>
        /// The is a redirect map to redirect clients to an external web site via culture preference in the browser
        /// </summary>
        List<KeyValuePair<string, string>> RedirectMap { get; }
        
        /// <summary>
        /// This is a local language redirect map, for cultures with different domain names but same site instance.
        /// </summary>
        List<KeyValuePair<string, string>> LocalLanguageDomainMap { get; }
        string DefaultLanguage { get; }
        string NoRedirectCookieName { get; }
        string NoRedirectQueryStringParamName { get; }

        bool ForceCultureDomainRedirect { get; }

        bool CreateContentOnAllLanguages { get; }
        bool ShouldGoToFirstMenuItem { get; }
        bool AllProtected { get; }

        bool MultiLanguage { get; }

        string LanguageConstraint { get; }

        string AdminUrlRoot { get; }

        string BaseHttp { get; }
    }
}
