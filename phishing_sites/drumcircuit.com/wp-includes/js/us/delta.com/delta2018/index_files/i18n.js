DeltaUtils.LanguageOptions = {
	en: "English",
	zh: "\u7B80\u4F53\u4E2D\u6587 ",
	fr: "Fran\u00E7ais",
	de: "Deutsch",
	it: "Italiano",
	pt: "Portugu\u00EAs",
	ru: "\u0440\u0443\u0441\u0441\u043A\u0438\u0439",
	es: "Espa\u00F1ol",
	ja: "\u65E5\u672C\u8A9E",
	ko: "\uD55C\uAD6D\uC5B4",
	zt: "\u7E41\u9AD4\u4E2D\u6587"
};
var welcome_arr = Array();
welcome_arr['en'] = 'WELCOME';
welcome_arr['es'] = 'BIENVENIDO';
welcome_arr['de'] = 'WILLKOMMEN';
welcome_arr['fr'] = 'BIENVENUE';
welcome_arr['it'] = 'BENVENUTO';
welcome_arr['ja'] = '\u3088\u3046\u3053\u305D';
welcome_arr['ko'] = '\uD658\uC601\uD569\uB2C8\uB2E4';
welcome_arr['pt'] = 'BEM-VINDO';
welcome_arr['ru'] = '\u0414\u041E\u0411\u0420\u041E \u041F\u041E\u0416\u0410\u041B\u041E\u0412\u0410\u0422\u042C';
welcome_arr['zt'] = '\u6B61\u8FCE';
welcome_arr['zh'] = '\u6B22\u8FCE';
var selCountryLan_arr = Array();
selCountryLan_arr['en'] = 'PLEASE SELECT YOUR COUNTRY/REGION & LANGUAGE';
selCountryLan_arr['zh'] = '\u8bf7\u9009\u62e9\u60a8\u6240\u5728\u7684\u56fd\u5bb6\u002f\u5730\u533a\u53ca\u6240\u4f7f\u7528\u7684\u8bed\u8a00';
selCountryLan_arr['ko'] = '\uAD6D\uAC00\uC640 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD574\uC8FC\uC2ED\uC2DC\uC624';
selCountryLan_arr['pt'] = 'SELECIONE SEU PA\u00CDS E IDIOMA';
selCountryLan_arr['fr'] = 'VEUILLEZ SELECTIONNER VOTRE PAYS ET VOTRE LANGUE';
selCountryLan_arr['ru'] = '\u0412\u042B\u0411\u0415\u0420\u0418\u0422\u0415 \u0421\u0422\u0420\u0410\u041D\u0423 \u0418 \u042F\u0417\u042B\u041A';
selCountryLan_arr['es'] = 'SELECCIONE SU PA\u00CDS E IDIOMA';
selCountryLan_arr['ja'] = '\u56FD\u3068\u8A00\u8A9E\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044';
selCountryLan_arr['de'] = 'BITTE W\u00C4HLEN SIE IHR LAND UND IHRE SPRACHE';
selCountryLan_arr['it'] = 'SELEZIONARE IL PAESE E LA LINGUA';
selCountryLan_arr['zt'] = '\u8acb\u9078\u64c7\u60a8\u7684\u570b\u5bb6\u002f\u5730\u5340\u548c\u8a9e\u8a00';
var currSetting_arr = Array();
currSetting_arr['en'] = 'Is this the current setting for you?';
currSetting_arr['zh'] = '\u8FD9\u662F\u60A8\u7684\u5F53\u524D\u8BBE\u7F6E\u5417\u003F';
currSetting_arr['ko'] = '\uC774\uAC83\uC774 \uACE0\uAC1D\uB2D8\uC5B4 \uD604\uC7AC \uC124\uC815\uC778\uAC00\uC694\u003F';
currSetting_arr['pt'] = 'Esta \u00E9 a atual configura\u00E7\u00E3o para voc\u00EA\u003F';
currSetting_arr['fr'] = 'Ces param\u00E8tres correspondent-ils \u00E0 votre situation&nbsp;\u003F';
currSetting_arr['ru'] = '\u042D\u0442\u043E \u0442\u0435\u043A\u0443\u0449\u0430\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0434\u043B\u044F \u0432\u0430\u0441?';
currSetting_arr['es'] = '\u00BFEs esta su configuraci\u00F3n actual\u003F';
currSetting_arr['ja'] = '\u3053\u308C\u306F\u73FE\u5728\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u8A2D\u5B9A\u3067\u3059\u304B\u003F';
currSetting_arr['de'] = 'Ist dies dies Ihre aktuelle Einstellung?';
currSetting_arr['it'] = '\u00C8 questa la tua configurazione attuale?';
currSetting_arr['zt'] = '\u9019\u662F\u60A8\u7684\u76EE\u524D\u8A2D\u5B9A\u55CE\u003F';
var yes_arr = Array();
yes_arr['en'] = 'YES';
yes_arr['zh'] = '\u662F';
yes_arr['ko'] = '\uB124 ';
yes_arr['pt'] = 'SIM';
yes_arr['fr'] = 'OUI';
yes_arr['ru'] = '\u0414\u0410';
yes_arr['es'] = 'S\u00CD';
yes_arr['ja'] = '\u306F\u3044';
yes_arr['de'] = 'JA';
yes_arr['it'] = 'S\u00CC';
yes_arr['zt'] = '\u662F';
var profmsg_arr = Array();
profmsg_arr['en'] = 'You have selected language different from your <a href="/profile/index.action">Delta Profile</a> preferences.';
profmsg_arr['zh'] = '\u60A8\u9009\u62E9\u7684\u8BED\u8A00\u4E0D\u540C\u4E8E\u60A8\u5728<a href="/profile/index.action">\u8FBE\u7F8E\u8D44\u6599\u5E93</a>\u4E2D\u7684\u504F\u597D\u8BBE\u7F6E\u3002';
profmsg_arr['ko'] = '\uACE0\uAC1D\uB2D8\uC740 <a href="/profile/index.action">\uB378\uD0C0 \uACE0\uAC1D\uC815\uBCF4</a>\uC5D0 \uC788\uB294 \uC120\uD638 \uC5B8\uC5B4\uC640 \uB2E4\uB978 \uC5B8\uC5B4\uB97C \uC120\uD0DD\uD558\uC168\uC2B5\uB2C8\uB2E4.';
profmsg_arr['pt'] = 'Voc\u00EA selecionou um idioma diferente do seu <a href="/profile/index.action">Perfil da Delta </a>prefer\u00EAncias.';
profmsg_arr['fr'] = 'Vous avez choisi une langue diff\u00E9rente de celle d\u00E9finie dans les pr\u00E9férences de votre <a href="/profile/index.action">Profil Delta</a>.';
profmsg_arr['ru'] = '\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u044F\u0437\u044B\u043A, \u043E\u0442\u043B\u0438\u0447\u043D\u044B\u0439 \u043E\u0442 \u0432\u0430\u0448\u0438\u0445 <a href=\"/profile/index.action\"> \u0414\u0435\u043B\u044C\u0442\u0430 \u041F\u0440\u043E\u0444\u0438\u043B\u044C </a> \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u0439.';
profmsg_arr['es'] = 'Seleccion\u00F3 un idioma diferente al de sus preferencias en el <a href="/profile/index.action">Perfil de Delta</a>';
profmsg_arr['ja'] = '<a href="/profile/index.action">\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB</a>\u306E\u8A2D\u5B9A\u3068\u7570\u306A\u308B\u8A00\u8A9E\u304C\u9078\u629E\u3055\u308C\u307E\u3057\u305F\u3002';
profmsg_arr['de'] = 'Sie haben eine Sprache ausgesucht, die von den Pr\u00E4ferenzen in Ihrem <a href="/profile/index.action"> Delta-Profil</a> abweicht.';
profmsg_arr['it'] = 'Hai selezionato una lingua diversa da quella indicata nelle preferenze del tuo <a href="/profile/index.action">Profilo Delta</a>.';
profmsg_arr['zt'] = '\u60A8\u5DF2\u9078\u64C7\u4E0D\u540C\u65BC\u60A8\u7684<a href="/profile/index.action">\u9054\u7F8E\u500B\u4EBA\u6A94\u6848</a>\504F\597D\8A2D\5B9A\4E2D\7684\8A9E\8A00\3002';
var profconf_arr = Array();
profconf_arr['en'] = 'Do you want to save this change to your profile?';
profconf_arr['zh'] = '\u60A8\u662F\u5426\u5E0C\u671B\u5C06\u6B64\u9879\u66F4\u6539\u4FDD\u5B58\u81F3\u60A8\u7684\u8D44\u6599\u5E93\uFF1F';
profconf_arr['ko'] = '\uACE0\uAC1D\uB2D8\uC5B4 \uD504\uB85C\uD544\uC815\uBCF4\uC5D0 \uC774 \uBCC0\uACBD\uC0AC\uD56D\uC744 \uC800\uC7A5\uD558\uACE0 \uC2F6\uC73C\uC2E0\uAC00\uC694\u003F';
profconf_arr['pt'] = 'Deseja salvar isso em seu perfil\u003F';
profconf_arr['fr'] = 'D\u00E9sirez-vous sauvegarder ces changements dans votre profil&nbsp;\u003F';
profconf_arr['ru'] = '\u0425\u043E\u0442\u0438\u0442\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F \u0432 \u0432\u0430\u0448 \u043F\u0440\u043E\u0444\u0438\u043B\u044C?';
profconf_arr['es'] = '\u00BFDesea guardar este cambio en su perfil\u003F';
profconf_arr['ja'] = '\u3053\u306E\u5909\u66F4\u3092\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u306B\u4FDD\u5B58\u3057\u307E\u3059\u304B\uFF1F';
profconf_arr['de'] = 'M\u00F6chten Sie diese \u00C4nderung in Ihrem Profil speichern?';
profconf_arr['it'] = 'Vuoi salvare queste modifiche al tuo profilo?';
profconf_arr['zt'] = '\u60A8\u8981\u5C07\u6B64\u8B8A\u66F4\u5132\u5B58\u81F3\u60A8\u7684\u500B\u4EBA\u6A94\u6848\u4E2D\u55CE\uFF1F';
var profremember_arr = Array();
profremember_arr['en'] = "Don't ask me this again";
profremember_arr['zh'] = '\u4E0D\u8981\u518D\u6B21\u8BE2\u95EE\u6211';
profremember_arr['ko'] = '\uB2E4\uC2DC \uBB3B\uC9C0 \uC54A\uAE30';
profremember_arr['pt'] = 'N\u00E3o perguntar novamente';
profremember_arr['fr'] = 'Ne plus me demander';
profremember_arr['ru'] = '\u041D\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0439\u0442\u0435 \u043C\u0435\u043D\u044F, \u044D\u0442\u043E \u0441\u043D\u043E\u0432\u0430';
profremember_arr['es'] = 'No volver a preguntar';
profremember_arr['ja'] = '\u6B21\u56DE\u304B\u3089\u8868\u793A\u3057\u306A\u3044';
profremember_arr['de'] = 'Bitte stellen Sie mir diese Frage nicht mehr.';
profremember_arr['it'] = 'Non ripetere pi\u00F9 questa domanda';
profremember_arr['zt'] = '\u4E0D\u8981\u518D\u554F\u6211\u9019\u500B\u554F\u984C';
var profileCntry_arr = Array();
profileCntry_arr['en'] = 'You have selected a Country different from your <a href="/profile/index.action">Delta Profile</a> preference';
profileCntry_arr['zh'] = '\u60A8\u9009\u62E9\u4E86\u4E00\u4E2A\u56FD\u5BB6<a href="/profile/index.action">\u4E09\u89D2\u6D32\u7B80\u4ECB</ a>\u7684\u504F\u597D\u4E0D\u540C';
profileCntry_arr['ko'] = '\uACE0\uAC1D\uB2D8\uC758 \uB378\uD0C0 \uD504\uB85C\uD544 \uC124\uC815\uACFC \uB2E4\uB978 \uAD6D\uAC00\uB97C \uC120\uD0DD\uD558\uC168\uC2B5\uB2C8\uB2E4.';
profileCntry_arr['pt'] = 'Voc\u00EAselecionou um pa\u00EDsdiferente de suaprefer\u00EAncia no <a href="/profile/index.action">perfil da Delta</a>.';
profileCntry_arr['fr'] = 'Vous avez s\u00E9lectionn\u00E9 un pays diff\u00E9rent de celui sp\u00E9cifi\u00E9 dans les pr\u00E9f\u00E9rences de votre <a href="/profile/index.action">profil Delta</a>.';
profileCntry_arr['ru'] = '\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u0441\u0442\u0440\u0430\u043D\u0435, \u043E\u0442\u043B\u0438\u0447\u043D\u043E\u0439 \u043E\u0442 \u0432\u0430\u0448\u0435\u0439 <a href=\"/profile/index.action\"> \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0435\u043D\u0438\u044F \u0414\u0435\u043B\u044C\u0442\u0430 \u041F\u0440\u043E\u0444\u0438\u043B\u044C </a>';
profileCntry_arr['es'] = 'Ha seleccionado un país diferente al de su preferencia en el <a href="/profile/index.action">Perfil de Delta</a>.';
profileCntry_arr['ja'] = '\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u306E\u8A2D\u5B9A\u3068\u7570\u306A\u308B\u56FD\u304C\u9078\u629E\u3055\u308C\u307E\u3057\u305F\u3002';
profileCntry_arr['de'] = 'Ihr ausgew\u00E4hltes Land entspricht nicht den Pr\u00E4ferenzen Ihres <a href="/profile/index.action">Delta-Profils</a>.';
profileCntry_arr['it'] = 'Hai selezionato un Paese diverso rispetto alle preferenze del tuo <a href="/profile/index.action">Profilo Delta</a>';
profileCntry_arr['zt'] = '\u60A8\u5DF2\u9078\u64C7\u8207\u60A8\u300C\u9054\u7F8E\u500B\u4EBA\u6A94\u6848\u300D\u559C\u597D\u8A2D\u5B9A\u4E0D\u540C\u7684\u570B\u5BB6\uFF0F\u5340\u57DF\u3002';
var nothnks_arr = Array();
nothnks_arr['en'] = 'No Thanks';
nothnks_arr['zh'] = '\u4E0D\uFF0C\u8C22\u8C22';
nothnks_arr['ko'] = '\uC544\uB2C8\uC694.';
nothnks_arr['pt'] = 'N\u00E3o, obrigado.';
nothnks_arr['fr'] = 'Non, merci';
nothnks_arr['ru'] = '\u041D\u0435\u0442, \u0441\u043F\u0430\u0441\u0438\u0431\u043E';
nothnks_arr['es'] = 'No gracias';
nothnks_arr['ja'] = '\u3044\u3044\u3048';
nothnks_arr['de'] = 'Nein danke';
nothnks_arr['it'] = 'No grazie';
nothnks_arr['zt'] = '\u4E0D\uFF0C\u8B1D\u8B1D';
var yesupdateprof_arr = Array();
yesupdateprof_arr['en'] = 'Yes, Update My Profile ';
yesupdateprof_arr['zh'] = '\u662F\uFF0C\u66F4\u65B0\u201C\u6211\u7684\u8D44\u6599\u5E93\u201D';
yesupdateprof_arr['ko'] = '\uB124\uFF0C\uD504\uB85C\uD544 \uC815\uBCF4\uB97C \uC5C5\uB370\uC774\uD2B8\uD574\uC8FC\uC138\uC694';
yesupdateprof_arr['pt'] = 'Sim, atualizar meu perfil';
yesupdateprof_arr['fr'] = 'Oui, actualiser mon Profil';
yesupdateprof_arr['ru'] = '\u0414\u0430, \u043E\u0431\u043D\u043E\u0432\u0438\u0442e \u043C\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C';
yesupdateprof_arr['es'] = 'S\u00ED, actualizar mi perfil';
yesupdateprof_arr['ja'] = '\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u66F4\u65B0\u3059\u308B';
yesupdateprof_arr['de'] = 'Ja, aktualisieren Sie Mein Profil';
yesupdateprof_arr['it'] = 'S\u00EC, aggiorna il mio profilo';
yesupdateprof_arr['zt'] = '\u662F\uFF0C\u66F4\u65B0\u6211\u7684\u500B\u4EBA\u6A94\u6848';
var yesgotoprof_arr = Array();
yesgotoprof_arr['en'] = 'Yes, Go To My Profile';
yesgotoprof_arr['zh'] = '\u662F\uFF0C\u8FDB\u5165\u201C\u6211\u7684\u8D44\u6599\u5E93\u201D';
yesgotoprof_arr['ko'] = '\uC608. \u2018\uB0B4 \uD504\uB85C\uD544\u2019\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4.';
yesgotoprof_arr['pt'] = 'Sim, v\u00E1 para o meu perfil';
yesgotoprof_arr['fr'] = 'Oui, aller dans Mon profil';
yesgotoprof_arr['ru'] = '\u0414\u0430, \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u044C';
yesgotoprof_arr['es'] = 'S\u00ED, ir a Mi Perfil';
yesgotoprof_arr['ja'] = '\u30DE\u30A4\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u8868\u793A';
yesgotoprof_arr['de'] = 'Jetzt zu meinem Profil gehen';
yesgotoprof_arr['it'] = 'S\u00EC, vai al Mio Profilo';
yesgotoprof_arr['zt'] = '\u662F\uFF0C\u8ACB\u524D\u5F80\u300C\u6211\u7684\u500B\u4EBA\u6A94\u6848\u300D';
var popularCountry_arr = Array();
popularCountry_arr['cn'] = '\u4E2D\u56FD';
popularCountry_arr['br'] = 'Brasil';
popularCountry_arr['jp'] = '\u65E5\u672C';
popularCountry_arr['de'] = 'Deutschland';
popularCountry_arr['us'] = '';
