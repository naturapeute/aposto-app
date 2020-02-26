function $(query) {
  return document.querySelector(query);
}

function getDateString(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}

const services = [
  {value: 1203, label: "Ostéopathie, par période de 5 minutes"},
  {value: 1200, label: "Anamnèse / bilan / diagnostic / constatations médicales, par période de 5 minutes"},
  {value: 1250, label: "Consultation manquée"},
  {value: 1251, label: "Supplément pour consultations de nuit et dimanches et jours fériés"},
  {value: 1252, label: "Supplément pour consultation extraordinaire dans des situations aiguës"},
  {value: 1253, label: "Rapport officiel"},
  {value: 1128, label: "Thérapie Adveda-Eugemed"}, {value: 1002, label: "Thérapie Akumat"}, {value: 1003, label: "Acupressure"}, {value: 1004, label: "Acupuncture"}, {value: 1005, label: "Massage des points d’acupuncture"}, {value: 1006, label: "Technique Alexander"}, {value: 1007, label: "Tui-Na / An-Mo"}, {value: 1008, label: "Médécine anthroposophique"}, {value: 1010, label: "Aromathérapie"}, {value: 1208, label: "Traitement médicamenteux"}, {value: 1011, label: "Travail asiatique d’énergie et du corps"}, {value: 1012, label: "Thérapie respiratoire"}, {value: 1013, label: "Atlaslogie"}, {value: 1014, label: "Audio-psycho-phonologie / Tomatis"}, {value: 1016, label: "Auro-Soma thérapie"}, {value: 1205, label: "Méthodes de détoxication"}, {value: 1017, label: "Training autogène"}, {value: 1021, label: "Massage ayurvédique"}, {value: 1209, label: "Jets ayurvédiques"}, {value: 1022, label: "Thérapie des fleurs de Bach"}, {value: 1024, label: "Thérapie par le mouvement"}, {value: 1025, label: "Massage du tissu conjonctif"}, {value: 1026, label: "Biofeedback"}, {value: 1027, label: "Biorésonance"}, {value: 1028, label: "Biochimie selon Schüssler"}, {value: 1029, label: "Psychologie biodynamique / Biodynamique"}, {value: 1030, label: "Sangsues"}, {value: 1031, label: "Brain Gym"}, {value: 1143, label: "Thérapie Cantharide"}, {value: 1032, label: "Hydrothérapie du côlon"}, {value: 1033, label: "Massage du côlon"}, {value: 1034, label: "Thérapie crâniosacrale"}, {value: 1035, label: "Deep Draining"}, {value: 1207, label: "Thérapie de l’ordre / Diététique"}, {value: 1141, label: "Thérapie Dorn / Breuss"}, {value: 1036, label: "Autohémothérapie / Thérapie autosanguine"}, {value: 1037, label: "Électroacupuncture"}, {value: 1038, label: "Électroacupuncture selon Voll"}, {value: 1039, label: "Électrothérapie"}, {value: 1041, label: "Conseil diététique"}, {value: 1206, label: "Thérapie nutritionnelle"}, {value: 1045, label: "Massage ésalien"}, {value: 1204, label: "Etiopathie"}, {value: 1047, label: "Eutonie Gerda Alexander"}, {value: 1048, label: "Chromopuncture"}, {value: 1049, label: "Thérapie par la couleur"}, {value: 1050, label: "Fasciathérapie"}, {value: 1051, label: "Méthode Feldenkrais"}, {value: 1052, label: "Massage des zones réflexes du pied"}, {value: 1053, label: "Thérapie d’oxydation hématogène"}, {value: 1054, label: "Yoga thérapie"}, {value: 1055, label: "Eurythmie thérapeutique"}, {value: 1056, label: "Hippothérapie"}, {value: 1057, label: "Homéopathie"}, {value: 1058, label: "Hydrothérapie"}, {value: 1060, label: "Kinésiologie"}, {value: 1061, label: "Thérapie sonore"}, {value: 1062, label: "Massage classique"}, {value: 1063, label: "Thérapie selon Kneipp"}, {value: 1201, label: "Thérapie par le drame"}, {value: 1131, label: "Thérapie à médiation plastique"}, {value: 1132, label: "Thérapie intermédiale"}, {value: 1064, label: "Acupuncture par laser"}, {value: 1065, label: "Thérapie par la lumière"}, {value: 1066, label: "Drainage lymphatique manuel"}, {value: 1067, label: "Magnétothérapie / Thérapie par champs magnétiques"}, {value: 1068, label: "Thérapie par la peinture"}, {value: 1133, label: "Thérapie des méridiens"}, {value: 1069, label: "Mésothérapie"}, {value: 1070, label: "Massage métamorphique"}, {value: 1140, label: "Microkinésithérapie"}, {value: 1071, label: "Moxibustion"}, {value: 1072, label: "Musicothérapie"}, {value: 1073, label: "Massage des zones réflexes musculaires"}, {value: 1074, label: "Thérapie myofonctionelle"}, {value: 1075, label: "Thérapie neurale"}, {value: 1076, label: "Neurofeedback"}, {value: 1077, label: "Acupuncture des oreilles"}, {value: 1079, label: "Otothérapie par les bougies"}, {value: 1080, label: "Formation du mouvement rythmo-organique Medau"}, {value: 1081, label: "Ortho-Bionomy"}, {value: 1082, label: "Thérapie orthomoléculaire"}, {value: 1203, label: "Ostéopathie"}, {value: 1084, label: "Thérapie par l’ozone"}, {value: 1085, label: "Phytothérapie"}, {value: 1087, label: "Polarité"}, {value: 1088, label: "Intégration posturale"}, {value: 1089, label: "Psychomotricité"}, {value: 1090, label: "Massage des zones psychogènes"}, {value: 1091, label: "Thérapie de théâtre de marionnettes"}, {value: 1092, label: "Qi Gong"}, {value: 1093, label: "Rééquilibration"}, {value: 1094, label: "Thérapie par nouvelle naissance"}, {value: 1134, label: "Réflexothérapie"}, {value: 1096, label: "Reiki"}, {value: 1097, label: "Rolfing / Intégration structurelle"}, {value: 1098, label: "Massages rythmiques anthrop."}, {value: 1099, label: "Oxygénotherapie en plusieurs étapes"}, {value: 1100, label: "Shiatsu"}, {value: 1101, label: "Shin Tai"}, {value: 1102, label: "Sophrologie"}, {value: 1142, label: "Spagyrie"}, {value: 1210, label: "Spiraldynamik"}, {value: 1104, label: "Thérapie Sumathu"}, {value: 1105, label: "Sympathicothérapie"}, {value: 1106, label: "Tai Chi"}, {value: 1108, label: "Thérapie par la danse"}, {value: 1111, label: "Massage thaï"}, {value: 1202, label: "Art de parole thérapeutique"}, {value: 1113, label: "Thermographie"}, {value: 1114, label: "Médecine tibétaine"}, {value: 1115, label: "Touch for Health"}, {value: 1117, label: "Massage selon Trager"}, {value: 1118, label: "Thérapie par du sang irradié (UV)"}, {value: 1120, label: "Vitalpratique selon Vuille"}, {value: 1121, label: "Cataplasmes / Enveloppements / Fango"}, {value: 1122, label: "Équilibration vertébrale"}, {value: 1123, label: "Zilgrei"}
]
  .sort((a,b) => a.value - b.value)

function feedServiceOptions() {
  const template = document.querySelector('#service-template').innerHTML
  const htmlOptions = services.map(service => template.replace(/\{\{\s*(.*)\s*}}/g, (_, match) => eval(match))).join('')
  Array.from(document.querySelectorAll('[id^=service-code-]')).forEach(select => select.innerHTML += htmlOptions)
}

feedServiceOptions()
