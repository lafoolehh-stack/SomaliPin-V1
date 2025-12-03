import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, Building2, User, BookOpen, Upload, FileText, Image as ImageIcon, Award, PieChart, Newspaper, Globe } from 'lucide-react';
import { BrandPin, VerifiedBadge, HeroBadge, GoldenBadge, StandardBadge } from './components/Icons';
import ProfileCard from './components/ProfileCard';
import Timeline from './components/Timeline';
import { getProfiles, UI_TEXT } from './constants';
import { Profile, Category, ArchiveItem, NewsItem, VerificationLevel, Language } from './types';
import { askArchive } from './services/geminiService';

const App = () => {
  const [view, setView] = useState<'home' | 'profile'>('home');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'archive' | 'news' | 'influence'>('archive');
  const [language, setLanguage] = useState<Language>('en');
  
  // Update document direction based on language
  useEffect(() => {
    if (language === 'ar') {
      document.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = UI_TEXT[language];
  const profiles = getProfiles(language);

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setAiSummary(null);
    setView('profile');
    setActiveTab('archive'); // Reset to default tab
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelectedProfile(null);
    setAiSummary(null);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if we have local results
    const hasLocalResults = profiles.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!hasLocalResults) {
      setIsAiLoading(true);
      const summary = await askArchive(searchQuery, language);
      setAiSummary(summary);
      setIsAiLoading(false);
    } else {
        setAiSummary(null);
    }
  };

  // Mock Upload Handler
  const handleFileUpload = () => {
      alert("System Integration: Files uploaded here would be encrypted and stored in the secure archive database.");
  };

  const getVerificationIcon = (level?: VerificationLevel) => {
      switch (level) {
          case VerificationLevel.HERO: return <HeroBadge className="h-8 w-8 text-red-700" />;
          case VerificationLevel.GOLDEN: return <GoldenBadge className="h-8 w-8 text-gold" />;
          case VerificationLevel.STANDARD: return <StandardBadge className="h-8 w-8 text-navy-light" />;
          default: return <VerifiedBadge className="h-8 w-8 text-gray-400" />;
      }
  };

  const getVerificationLabel = (level?: VerificationLevel) => {
      // These could be translated in the future if needed, currently reusing English logic or basic strings
      // Ideally these strings should be in UI_TEXT if strict localization is required, 
      // but for now keeping logic simple as they are semi-technical terms.
      switch (level) {
          case VerificationLevel.HERO: return "National Hero (Halyey Qaran)";
          case VerificationLevel.GOLDEN: return "Golden Verified (Heerka Sare)";
          case VerificationLevel.STANDARD: return "Verified Entity (Rasmi)";
          default: return "Unverified";
      }
  };

  // Helper for Category translation based on constants keys
  // This is a mapping from the Category Enum to the UI_TEXT keys
  const getCategoryLabel = (cat: Category) => {
      switch (cat) {
          case Category.POLITICS: return t.nav_politics;
          case Category.BUSINESS: return t.nav_business;
          case Category.HISTORY: return t.nav_history;
          default: return cat;
      }
  };

  return (
    <div className={`min-h-screen bg-slate flex flex-col font-sans text-gray-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
      
      {/* Navigation - Sticky */}
      <nav className="sticky top-0 z-50 bg-navy text-white shadow-lg border-b border-navy-light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group"
              onClick={handleBack}
            >
              <BrandPin className="h-8 w-8 text-gold group-hover:text-white transition-colors" />
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold tracking-tight">SomaliPin</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{t.subtitle}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 rtl:space-x-reverse">
                {/* Desktop Nav Links */}
                <div className="hidden md:flex space-x-8 rtl:space-x-reverse text-sm font-medium text-gray-300">
                    <span className="hover:text-gold cursor-pointer transition-colors">{t.nav_politics}</span>
                    <span className="hover:text-gold cursor-pointer transition-colors">{t.nav_business}</span>
                    <span className="hover:text-gold cursor-pointer transition-colors">{t.nav_history}</span>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center bg-navy-light/50 rounded-full px-1 py-1 border border-navy-light">
                    <button 
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'en' ? 'bg-gold text-navy shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        EN
                    </button>
                    <button 
                        onClick={() => setLanguage('so')}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'so' ? 'bg-gold text-navy shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        SO
                    </button>
                    <button 
                        onClick={() => setLanguage('ar')}
                        className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${language === 'ar' ? 'bg-gold text-navy shadow-sm' : 'text-gray-400 hover:text-white'}`}
                    >
                        AR
                    </button>
                </div>

                <div className="hidden md:block">
                     <span className="border border-gold text-gold px-4 py-1.5 rounded-sm hover:bg-gold hover:text-navy transition-all cursor-pointer text-sm font-medium">
                        {t.nav_login}
                     </span>
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        {view === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="bg-navy pb-16 pt-10 px-4 text-center border-b border-gold/20">
              <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                  {t.hero_title_1} <br />
                  <span className="text-gold italic">{t.hero_title_2}</span>
                </h1>
                <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto">
                  {t.hero_desc}
                </p>
                
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto mt-8">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 rtl:pl-0 rtl:right-0 rtl:pr-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400 group-focus-within:text-navy transition-colors" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-4 bg-white border-0 rounded-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gold focus:outline-none shadow-xl text-lg"
                      placeholder={t.search_placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 rtl:right-auto rtl:left-2 top-2 bottom-2 bg-navy text-gold px-4 rounded-sm font-medium hover:bg-navy-light transition-colors"
                    >
                        {t.search_btn}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* AI Search Result (If no local profiles found) */}
            {aiSummary && (
                <section className="max-w-6xl mx-auto px-4 -mt-8 mb-12 relative z-10">
                    <div className="bg-white p-8 rounded-sm shadow-xl border-t-4 border-gold">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                            <BrandPin className="h-6 w-6 text-navy" />
                            <h2 className="text-xl font-serif font-bold text-navy">{t.archive_result}</h2>
                        </div>
                        <div className="prose prose-lg text-gray-600 rtl:text-right">
                             <p className="leading-relaxed">{aiSummary}</p>
                        </div>
                        <div className="mt-4 text-xs text-gray-400 italic text-right rtl:text-left">
                            {t.generated_by}
                        </div>
                    </div>
                </section>
            )}

            {/* Directory Grid - Moved Up */}
            <section className="max-w-6xl mx-auto px-4 py-12 border-b border-gray-200">
               {!aiSummary && searchQuery && filteredProfiles.length === 0 && (
                   <div className="text-center py-12">
                       <p className="text-gray-500 text-lg">{t.no_profiles}</p>
                       <p className="text-sm text-gold mt-2 cursor-pointer hover:underline" onClick={handleSearchSubmit}>{t.click_search}</p>
                   </div>
               )}

              <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-serif font-bold text-navy">{t.featured_dossiers}</h2>
                <div className="hidden md:flex space-x-2 rtl:space-x-reverse">
                   {/* Filter tabs styled as simple text for minimalism */}
                   {Object.values(Category).map((cat) => (
                       <button key={cat} className="text-sm px-3 py-1 text-gray-500 hover:text-navy font-medium">
                           {getCategoryLabel(cat)}
                       </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    onClick={handleProfileClick} 
                  />
                ))}
              </div>
            </section>

            {/* Services / What We Do Section - Moved Down */}
            <section className="max-w-6xl mx-auto px-4 py-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Card 1 */}
                 <div className="bg-white p-6 rounded-sm shadow-sm border-t-4 border-gold hover:shadow-md transition-all">
                    <div className="mb-4 text-gold">
                        <User className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-navy mb-3">{t.service_1_title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                        {t.service_1_desc}
                    </p>
                 </div>
                 
                 {/* Card 2 */}
                 <div className="bg-white p-6 rounded-sm shadow-sm border-t-4 border-gold hover:shadow-md transition-all">
                    <div className="mb-4 text-gold">
                        <VerifiedBadge className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-navy mb-3">{t.service_2_title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                        {t.service_2_desc}
                    </p>
                 </div>

                 {/* Card 3 */}
                 <div className="bg-white p-6 rounded-sm shadow-sm border-t-4 border-gold hover:shadow-md transition-all">
                    <div className="mb-4 text-gold">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-navy mb-3">{t.service_3_title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                         {t.service_3_desc}
                    </p>
                 </div>

                 {/* Card 4 */}
                 <div className="bg-white p-6 rounded-sm shadow-sm border-t-4 border-gold hover:shadow-md transition-all">
                    <div className="mb-4 text-gold">
                        <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-navy mb-3">{t.service_4_title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-sans">
                        {t.service_4_desc}
                    </p>
                 </div>
               </div>
            </section>
          </>
        ) : (
          /* Profile Detail View */
          <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
            <button 
              onClick={handleBack}
              className="group flex items-center text-navy font-medium mb-8 hover:text-gold transition-colors rtl:flex-row-reverse"
            >
              <ChevronLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform rtl:rotate-180 rtl:ml-1 rtl:mr-0" />
              {t.back_directory}
            </button>

            {selectedProfile && (
              <div className="bg-white shadow-xl rounded-sm overflow-hidden mb-12">
                {/* Header Banner */}
                <div className={`h-48 relative ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'bg-red-900' : 'bg-navy'}`}>
                    <div className="absolute inset-0 bg-black/20 pattern-grid-lg"></div>
                </div>

                <div className="px-8 pb-12">
                    <div className="relative flex justify-between items-end -mt-20 mb-8">
                        <div className="relative">
                            <img 
                                src={selectedProfile.imageUrl} 
                                alt={selectedProfile.name}
                                className={`w-40 h-40 object-cover rounded-sm border-4 border-white shadow-md ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'grayscale-0' : ''}`}
                            />
                            {selectedProfile.verified && (
                                <div className="absolute -bottom-3 -right-3 rtl:-left-3 rtl:right-auto bg-white p-1 rounded-full shadow-sm">
                                    {getVerificationIcon(selectedProfile.verificationLevel)}
                                </div>
                            )}
                        </div>
                        <div className="hidden md:block mb-2">
                             <button className="bg-navy text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-navy-light transition-colors shadow-sm">
                                 {t.contact_office}
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2">
                            <div className="mb-8">
                                <span className={`text-sm font-bold tracking-widest uppercase mb-2 block
                                    ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'text-red-700' : 'text-gold'}
                                `}>
                                    {getCategoryLabel(selectedProfile.category)}
                                </span>
                                <h1 className="text-4xl font-serif font-bold text-navy mb-2">
                                    {selectedProfile.name}
                                </h1>
                                <p className="text-xl text-gray-500 font-light">
                                    {selectedProfile.title}
                                </p>
                                {selectedProfile.location && (
                                    <div className="flex items-center text-gray-400 text-sm mt-3">
                                        <MapPin className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                                        {selectedProfile.location}
                                    </div>
                                )}
                            </div>

                            <div className="prose prose-slate max-w-none rtl:text-right">
                                <h3 className="text-navy font-serif text-xl border-b border-gray-200 pb-2 mb-4">{t.about}</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {selectedProfile.fullBio}
                                </p>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-navy font-serif text-xl border-b border-gray-200 pb-2 mb-4">{t.timeline}</h3>
                                <Timeline events={selectedProfile.timeline} />
                            </div>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <div className="bg-slate p-6 rounded-sm border border-gray-200">
                                <h4 className="font-serif font-bold text-navy mb-4">{t.key_info}</h4>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center">
                                        <Building2 className={`h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'text-red-700' : 'text-gold'}`} />
                                        <div>
                                            <span className="block text-gray-400 text-xs uppercase">{t.label_affiliation}</span>
                                            <span className="font-medium text-gray-800">{getVerificationLabel(selectedProfile.verificationLevel)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <User className={`h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'text-red-700' : 'text-gold'}`} />
                                        <div>
                                            <span className="block text-gray-400 text-xs uppercase">{t.label_role}</span>
                                            <span className="font-medium text-gray-800">{getCategoryLabel(selectedProfile.category)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <BookOpen className={`h-5 w-5 mr-3 rtl:ml-3 rtl:mr-0 ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'text-red-700' : 'text-gold'}`} />
                                        <div>
                                            <span className="block text-gray-400 text-xs uppercase">{t.label_id}</span>
                                            <span className="font-medium text-gray-800">SOM-{selectedProfile.id.padStart(4, '0')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`p-6 rounded-sm text-white relative overflow-hidden ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'bg-red-900' : 'bg-navy'}`}>
                                <div className="relative z-10">
                                    <h4 className="font-serif font-bold text-lg mb-2">{t.verify_title}</h4>
                                    <p className="text-gray-300 text-sm mb-4">{t.verify_desc}</p>
                                    <div className="h-24 w-24 bg-white mx-auto rounded-sm p-2">
                                        <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                                            {/* Mock QR */}
                                            <div className="grid grid-cols-4 gap-1 p-1">
                                                {[...Array(16)].map((_, i) => (
                                                    <div key={i} className={`h-full w-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative circle */}
                                <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl ${selectedProfile.verificationLevel === VerificationLevel.HERO ? 'bg-red-500/20' : 'bg-gold/20'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NEW TABBED SECTION: Archive, News, Influence */}
                <div className="bg-slate/30 border-t border-gray-200 px-8 py-8">
                    {/* Tabs Navigation */}
                    <div className="flex space-x-8 rtl:space-x-reverse border-b border-gray-300 mb-8 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('archive')}
                            className={`pb-4 text-sm font-bold tracking-widest transition-colors relative whitespace-nowrap ${
                                activeTab === 'archive'
                                    ? 'text-navy' 
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {t.tab_archive}
                            {activeTab === 'archive' && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-t-sm"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('news')}
                            className={`pb-4 text-sm font-bold tracking-widest transition-colors relative whitespace-nowrap ${
                                activeTab === 'news'
                                    ? 'text-navy' 
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {t.tab_news}
                            {activeTab === 'news' && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-t-sm"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('influence')}
                            className={`pb-4 text-sm font-bold tracking-widest transition-colors relative whitespace-nowrap ${
                                activeTab === 'influence'
                                    ? 'text-navy' 
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {t.tab_influence}
                            {activeTab === 'influence' && (
                                <span className="absolute bottom-0 left-0 w-full h-1 bg-gold rounded-t-sm"></span>
                            )}
                        </button>
                    </div>

                    {/* Tab 1: ARCHIVE (Digital Repository) */}
                    {activeTab === 'archive' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-serif font-bold text-navy">{t.tab_archive}</h3>
                                <button 
                                    onClick={handleFileUpload}
                                    className="text-xs flex items-center bg-white border border-gray-200 px-3 py-2 rounded-sm text-navy hover:bg-slate hover:border-gold transition-colors"
                                >
                                    <Upload className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                                    {t.upload_doc}
                                </button>
                            </div>
                            
                            {/* Upload Dropzone */}
                            <div 
                                onClick={handleFileUpload}
                                className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center bg-white/50 mb-8 hover:border-gold cursor-pointer transition-colors"
                            >
                                <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                                    <Upload className="h-full w-full" />
                                </div>
                                <p className="text-sm font-medium text-navy">{t.click_upload}</p>
                                <p className="text-xs text-gray-500 mt-1">{t.upload_hint}</p>
                            </div>

                            {/* File List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(selectedProfile.archives && selectedProfile.archives.length > 0) ? (
                                    selectedProfile.archives.map((file) => (
                                        <div key={file.id} className="bg-white p-4 rounded-sm border border-gray-100 flex items-start space-x-3 rtl:space-x-reverse hover:shadow-md transition-shadow">
                                            <div className="bg-slate p-2 rounded-sm text-navy">
                                                {file.type === 'PDF' && <FileText className="h-5 w-5" />}
                                                {file.type === 'IMAGE' && <ImageIcon className="h-5 w-5" />}
                                                {file.type === 'AWARD' && <Award className="h-5 w-5 text-gold" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{file.title}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 rounded">{file.type}</span>
                                                    <span className="text-[10px] text-gray-400">{file.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="col-span-3 text-center text-gray-400 italic text-sm py-4">{t.no_docs}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: NEWS (Related Reports) */}
                    {activeTab === 'news' && (
                        <div className="animate-fade-in">
                            <h3 className="text-lg font-serif font-bold text-navy mb-6">{t.related_reports}</h3>
                            <div className="space-y-4">
                                {(selectedProfile.news && selectedProfile.news.length > 0) ? (
                                    selectedProfile.news.map((news) => (
                                        <div key={news.id} className="bg-white p-5 rounded-sm border-l-4 rtl:border-l-0 rtl:border-r-4 border-gold shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-navy text-base">{news.title}</h4>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-4 rtl:ml-0 rtl:mr-4">{news.date}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gold font-bold uppercase tracking-wider mb-3">
                                                <Newspaper className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                                                {news.source}
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {news.summary}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-white border border-dashed border-gray-200 rounded-sm">
                                        <p className="text-gray-400 text-sm">{t.no_news}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: INFLUENCE SCORE (Sentiment Analysis) */}
                    {activeTab === 'influence' && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <h3 className="text-lg font-serif font-bold text-navy">{t.sentiment_title}</h3>
                                <p className="text-sm text-gray-500 mt-2">{t.sentiment_desc}</p>
                            </div>

                            {selectedProfile.influence ? (
                                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-navy">{t.sentiment_support}</span>
                                        <span className="text-sm font-bold text-navy">{selectedProfile.influence.support}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                                        <div className="bg-navy h-3 rounded-full" style={{ width: `${selectedProfile.influence.support}%` }}></div>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-gold-dark">{t.sentiment_neutral}</span>
                                        <span className="text-sm font-bold text-gold-dark">{selectedProfile.influence.neutral}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
                                        <div className="bg-gold h-3 rounded-full" style={{ width: `${selectedProfile.influence.neutral}%` }}></div>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-red-900">{t.sentiment_oppose}</span>
                                        <span className="text-sm font-bold text-red-900">{selectedProfile.influence.opposition}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                                        <div className="bg-red-900 h-3 rounded-full" style={{ width: `${selectedProfile.influence.opposition}%` }}></div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                                        <span>{t.last_updated}</span>
                                        <div className="flex items-center">
                                            <PieChart className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                                            SomaliPin Analytics
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-white rounded-sm shadow-sm">
                                    <p className="text-gray-400">Not enough data to generate an influence score for this profile.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white pt-16 pb-8 border-t border-gold">
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                         <BrandPin className="h-6 w-6 text-gold" />
                         <span className="text-xl font-serif font-bold">SomaliPin</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {t.footer_desc}
                    </p>
                </div>
                <div>
                    <h5 className="font-serif font-bold mb-4 text-gold">{t.footer_platform}</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="hover:text-white cursor-pointer">{t.footer_directory}</li>
                        <li className="hover:text-white cursor-pointer">{t.footer_verify}</li>
                        <li className="hover:text-white cursor-pointer">{t.footer_membership}</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-serif font-bold mb-4 text-gold">{t.footer_legal}</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="hover:text-white cursor-pointer">{t.footer_privacy}</li>
                        <li className="hover:text-white cursor-pointer">{t.footer_terms}</li>
                        <li className="hover:text-white cursor-pointer">{t.footer_act}</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-serif font-bold mb-4 text-gold">{t.footer_contact}</h5>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li>Mogadishu, Somalia</li>
                        <li>registry@somalipin.so</li>
                        <li>+252 61 500 0000</li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} {t.rights}</p>
                <div className="mt-4 md:mt-0">
                    <span className="mr-4">{t.design_integrity}</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;