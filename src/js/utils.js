import bigInt from 'big-integer'

export function getServiceLightLabel(code) {
  const match = serviceCodes.find(serviceCode => serviceCode.code === code)

  return match ? match.lightLabel : ''
}

export function getDurationLabel(duration) {
  if (duration < 60)
    return `${duration}'`

  const durationHours = Math.floor(duration / 60)
  const durationMinutes = Math.round(((duration / 60) - durationHours) * 60)

  return `${durationHours}h${durationMinutes || ''}`
}

export function getCantonOptions() {
  return [
    { value: '', label: '' },
    ...cantons.map(canton => ({ value: canton, label: canton }))
  ]
}

export const genderOptions = [
  { value: '', label: '' },
  { value: 'man', label: 'Homme' },
  { value: 'woman', label: 'Femme' }
]

export function isAuthorValid(author) {
  const errors = []
  if(!(author.name && author.name.length <= 70)) errors.push("name invalid: " + author.name)
  if(!(author.street && author.street.length <= 35)) errors.push("street invalid: " + author.street)
  if(!(author.zipcode && author.zipcode.length <= 9)) errors.push("zipcode invalid: " + author.zipcode)
  if(!(author.city && author.city.length <= 25)) errors.push("city invalid: " + author.city)
  if(!isPhoneValid(author.phone)) errors.push("phone invalid: " + author.phone)
  if(!isEmailValid(author.email)) errors.push("email invalid: " + author.email)
  if(!isIBANValid('CH' + author.iban)) errors.push("iban invalid: CH" + author.iban)
  if(!isRCCValid(author.rcc)) errors.push("rcc invalid: " + author.rcc)
  if(errors.length) console.error('author is not valid:', errors)
  return errors.length === 0
}

export function isTherapistValid(therapist) {
  return Boolean(
    therapist.firstname && therapist.firstname.length <= 35 && therapist.lastname &&
    therapist.lastname.length <= 35 && therapist.street && therapist.street.length <= 35 &&
    therapist.zipcode && therapist.zipcode.length <= 9 && therapist.city && therapist.city.length <= 35 &&
    therapist.phone && therapist.phone.length <= 25 && isRCCValid(therapist.rcc)
  )
}

export function isServicePriceValid(servicePrice) {
  return servicePrice > 0
}

export function isPreferredServicesValid(preferredServices) {
  return preferredServices.length &&
    !(preferredServices.length === 1 && preferredServices[0].code === 1200)
}

export function isPatientValid(patient) {
  const errors = []

  if(!(patient.firstname && patient.firstname.length <= 35)) errors.push('firstname invalid: ' + patient.firstname)
  if(!(patient.lastname && patient.lastname.length <= 35)) errors.push('lastname invalid: ' + patient.lastname)
  if(!(patient.street && patient.street.length <= 35)) errors.push('street invalid: ' + patient.street)
  if(!(patient.zipcode && String(patient.zipcode).length <= 9)) errors.push('zipcode invalid: ' + patient.zipcode)
  if(!(patient.city && patient.city.length <= 35)) errors.push('city invalid: ' + patient.city)
  if(!(isCantonValid(patient.canton))) errors.push('canton invalid: ' + patient.canton)
  if(!(isGenderValid(patient.gender))) errors.push('gender invalid: ' + patient.gender)
  if(!(isEmailValid(patient.email))) errors.push('email invalid: ' + patient.email)
  if(!(!isNaN(patient.birthdate))) errors.push('birthdate invalid: ' + patient.birthdate)
  if(!(!isNaN(patient.id))) errors.push('id invalid: ' + patient.id)

  if(errors.length) console.error("patient invalid", errors)
  return errors.length === 0
}

function isEmailValid(email) {
  return email && email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*/)
}

export function isIBANValid(iban) {
  const matches = iban.match(/^CH(\d{2})(\d{5})([A-Z0-9]{12})$/)
  return Boolean(matches)
}

function isRCCValid(RCC) {
  return RCC.match(/^((?!.)|[A-Z][0-9]{6})$/)
}

function isCantonValid(canton) {
  return cantons.includes(canton)
}

function isPhoneValid(phone) {
  return phone.replaceAll(' ', '').length <= 12
}

function isGenderValid(gender) {
  return gender === 'man' || gender === 'woman'
}

export function getDateInput(timestamp) {
  const date = new Date(timestamp)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

export function range(start, end, step) {
  const length = Math.floor((end - start) / step) + 1

  return Array.from(Array(length), (x, index) => start + index * step)
}

export function getServiceHeight(serviceDuration, totalDuration) {
  return Math.max((20 * 12) * (serviceDuration / totalDuration), 36)
}

export const serviceCodes = [
  { code: 1003, lightLabel: 'Acupressure' },
  { code: 1004, lightLabel: 'Acupuncture' },
  { code: 1005, lightLabel: 'Massage des points d’acupuncture' },
  { code: 1006, lightLabel: 'Technique Alexander' },
  {
    code: 1008,
    lightLabel: 'Médécine anthroposophique, traitement/consultation'
  },
  { code: 1010, lightLabel: 'Aromathérapie' },
  { code: 1012, lightLabel: 'Thérapie respiratoire' },
  { code: 1013, lightLabel: 'Atlaslogie' },
  { code: 1014, lightLabel: 'Audio-psycho-phonologie/Tomatis' },
  { code: 1017, lightLabel: 'Training autogène' },
  { code: 1021, lightLabel: 'Massage ayurvédique' },
  { code: 1022, lightLabel: 'Thérapie des fleurs de Bach' },
  { code: 1024, lightLabel: 'Thérapie par le mouvement (intégrat./cliniq.)' },
  { code: 1025, lightLabel: 'Massage du tissu conjonctif' },
  { code: 1026, lightLabel: 'Biofeedback' },
  { code: 1027, lightLabel: 'Biorésonance' },
  { code: 1028, lightLabel: 'Biochimie selon Schüssler' },
  { code: 1029, lightLabel: 'Psychologie biodynamique/Biodynamique' },
  { code: 1030, lightLabel: 'Sangsues' },
  { code: 1032, lightLabel: 'Hydrothérapie du côlon' },
  { code: 1033, lightLabel: 'Massage du côlon' },
  { code: 1034, lightLabel: 'Thérapie crâniosacrale' },
  { code: 1039, lightLabel: 'Électrothérapie' },
  { code: 1045, lightLabel: 'Massage ésalien' },
  { code: 1047, lightLabel: 'Eutonie Gerda Alexander' },
  { code: 1048, lightLabel: 'Chromopuncture' },
  { code: 1049, lightLabel: 'Thérapie par la couleur' },
  { code: 1050, lightLabel: 'Fasciathérapie' },
  { code: 1051, lightLabel: 'Méthode Feldenkrais' },
  { code: 1052, lightLabel: 'Massage des zones réflexes du pied' },
  { code: 1054, lightLabel: 'Yoga thérapie' },
  { code: 1055, lightLabel: 'Eurythmie thérapeutique' },
  { code: 1056, lightLabel: 'Hippothérapie' },
  { code: 1057, lightLabel: 'Homéopathie' },
  { code: 1058, lightLabel: 'Hydrothérapie' },
  { code: 1060, lightLabel: 'Kinésiologie' },
  { code: 1061, lightLabel: 'Thérapie sonore' },
  { code: 1062, lightLabel: 'Massage classique' },
  { code: 1063, lightLabel: 'Thérapie selon Kneipp' },
  { code: 1064, lightLabel: 'Acupuncture par laser' },
  { code: 1065, lightLabel: 'Thérapie par la lumière' },
  { code: 1066, lightLabel: 'Drainage lymphatique (manuel)' },
  {
    code: 1067,
    lightLabel: 'Magnétothérapie/thérapie par champs magnétiques'
  },
  { code: 1068, lightLabel: 'Thérapie par la peinture' },
  { code: 1069, lightLabel: 'Mésothérapie' },
  { code: 1070, lightLabel: 'Massage métamorphique' },
  { code: 1071, lightLabel: 'Moxibustion' },
  { code: 1072, lightLabel: 'Musicothérapie' },
  { code: 1076, lightLabel: 'Neurofeedback' },
  { code: 1077, lightLabel: 'Acupuncture des oreilles' },
  { code: 1079, lightLabel: 'Otothérapie par les bougies' },
  { code: 1080, lightLabel: 'Formation du mouvement rythmo-organique Medau' },
  { code: 1081, lightLabel: 'Ortho-Bionomy' },
  { code: 1082, lightLabel: 'Thérapie orthomoléculaire' },
  { code: 1084, lightLabel: 'Thérapie par l’ozone' },
  { code: 1085, lightLabel: 'Phytothérapie' },
  { code: 1087, lightLabel: 'Polarité' },
  { code: 1088, lightLabel: 'Intégration posturale' },
  { code: 1089, lightLabel: 'Psychomotricité' },
  { code: 1091, lightLabel: 'Thérapie de théâtre de marionnettes' },
  { code: 1092, lightLabel: 'Qi Gong' },
  { code: 1093, lightLabel: 'Rééquilibration' },
  { code: 1094, lightLabel: 'Thérapie par nouvelle naissance' },
  { code: 1096, lightLabel: 'Reiki' },
  { code: 1097, lightLabel: 'Rolfing/intégration structurelle' },
  { code: 1098, lightLabel: 'Massages rythmiques anthrop.' },
  { code: 1100, lightLabel: 'Shiatsu' },
  { code: 1102, lightLabel: 'Sophrologie' },
  { code: 1104, lightLabel: 'Thérapie Sumathu' },
  { code: 1105, lightLabel: 'Sympathicothérapie' },
  { code: 1106, lightLabel: 'Tai Chi' },
  { code: 1111, lightLabel: 'Massage thaï' },
  { code: 1114, lightLabel: 'Médecine tibétaine, traitement/consultation' },
  { code: 1115, lightLabel: 'Touch for Health' },
  { code: 1117, lightLabel: 'Massage selon Trager' },
  { code: 1120, lightLabel: 'Vitalpratique selon Vuille' },
  { code: 1121, lightLabel: 'Cataplasmes/enveloppements/fango' },
  { code: 1122, lightLabel: 'Équilibration vertébrale' },
  { code: 1123, lightLabel: 'Zilgrei' },
  { code: 1131, lightLabel: 'Thérapie à médiation plastique' },
  { code: 1132, lightLabel: 'Thérapie intermédiale' },
  { code: 1134, lightLabel: 'Réflexothérapie' },
  { code: 1140, lightLabel: 'Microkinésithérapie' },
  { code: 1141, lightLabel: 'Thérapie Dorn/Breuss' },
  { code: 1142, lightLabel: 'Spagyrie' },
  {
    code: 1200,
    lightLabel: 'Anamnèse'
  },
  { code: 1202, lightLabel: 'Art de parole thérapeutique' },
  { code: 1203, lightLabel: 'Ostéopathie' },
  { code: 1204, lightLabel: 'Etiopathie' },
  { code: 1205, lightLabel: 'Méthodes de détoxication, par période de 5 minutes' },
  { code: 1206, lightLabel: 'Thérapie nutritionnelle' },
  { code: 1207, lightLabel: "Thérapie de l'ordre / Diététique" },
  { code: 1210, lightLabel: 'Spiraldynamik' }
].sort((a, b) => a.code - b.code)

const cantons = [
  'AG',
  'AI',
  'AR',
  'BE',
  'BL',
  'BS',
  'FR',
  'GE',
  'GL',
  'GR',
  'JU',
  'LU',
  'NE',
  'NW',
  'OW',
  'SG',
  'SH',
  'SO',
  'SZ',
  'TI',
  'TG',
  'UR',
  'VD',
  'VS',
  'ZG',
  'ZH',
  'LI',
  'A',
  'D',
  'F',
  'I'
]

export const serviceColors = [
  '#f46d6d',
  '#75b79e',
  '#f8a978',
  '#424874',
  '#baabda',
  '#679b9b',
  '#856c8b',
  '#a8d3da',
  '#d77fa1',
  '#6e5773'
]
