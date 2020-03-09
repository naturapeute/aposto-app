const urlParams = new URLSearchParams(window.location.search)
const receiptContent = JSON.parse(atob(urlParams.get('receiptContent').replace(/\s/g, '+')))

const date = new Date(receiptContent.timestamp)
const timestamp = `${date.getTime()}`.slice(0, -3)
const fullDateString = getFullDateString(date)
const dateString = getDateString(date)
const [therapyStartDate, therapyEndDate] = getTherapyStartEndDates()

$('#identification').textContent = `${timestamp}  ${fullDateString}`
$('#author-names').textContent = receiptContent.author.name
$('#author-rcc').textContent = receiptContent.author.RCCNumber
$(
  '#author-address'
).textContent = `${receiptContent.author.street}, ${receiptContent.author.NPA}, ${receiptContent.author.city}`
$('#author-email').textContent = receiptContent.author.email
$('#author-phone').textContent = receiptContent.author.phone
$('#therapist-names').textContent = `${receiptContent.therapist.firstName} ${receiptContent.therapist.lastName}`
$('#therapist-rcc').textContent = receiptContent.therapist.RCCNumber
$(
  '#therapist-address'
).textContent = `${receiptContent.therapist.street}, ${receiptContent.therapist.NPA}, ${receiptContent.therapist.city}`
$('#therapist-email').textContent = receiptContent.therapist.email
$('#therapist-phone').textContent = receiptContent.therapist.phone
$('#customer-last-name').textContent = receiptContent.customer.lastName
$('#customer-first-name').textContent = receiptContent.customer.firstName
$('#customer-street').textContent = receiptContent.customer.street
$('#customer-npa').textContent = receiptContent.customer.NPA
$('#customer-city').textContent = receiptContent.customer.city
$('#customer-birthdate').textContent = getDateString(new Date(receiptContent.customer.birthdate))
$('#therapy-start-date').textContent = getDateString(therapyStartDate)
$('#therapy-end-date').textContent = getDateString(therapyEndDate)
$('#receipt-date').textContent = dateString
$('#receipt-number').textContent = `/ ${timestamp}  ${fullDateString}`
$('#therapy-type').textContent = 'Thérapie individuelle'

let totalAmount = 0

for (let i = 0; i < receiptContent.services.length; i++) {
  const quantity = Number(receiptContent.services[i].duration) / 5
  const price = Number(receiptContent.servicePrice) / 12

  $(`.service-${i + 1}.service-date`).textContent = getDateString(new Date(receiptContent.services[i].date))
  $(`.service-${i + 1}.service-rate-type`).textContent = '590'
  $(`.service-${i + 1}.service-code`).textContent = receiptContent.services[i].code
  $(`.service-${i + 1}.service-quantity`).textContent = quantity.toFixed(2)
  $(`.service-${i + 1}.service-price`).textContent = price.toFixed(2)
  $(`.service-${i + 1}.service-point-value`).textContent = '1.00'
  $(`.service-${i + 1}.service-tax`).textContent = '0.0%'
  $(`.service-${i + 1}.service-amount`).textContent = (quantity * price).toFixed(2)
  $(`.service-${i + 1}.service-code-label`).textContent = serviceCodes.find(
    serviceCode => serviceCode.value === Number(receiptContent.services[i].code)
  ).label

  totalAmount += quantity * price
}

$('#total-amount').textContent = totalAmount.toFixed(2)
$('#owed-amount').textContent = totalAmount.toFixed(2)

function getFullDateString(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${getDateString(date)} ${hours}:${minutes}:${seconds}`
}

function getDateString(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${day}.${month}.${date.getFullYear()}`
}

function getTherapyStartEndDates() {
  const therapyDates = receiptContent.services.map(service => new Date(service.date))

  return [new Date(Math.min.apply(null, therapyDates)), new Date(Math.max.apply(null, therapyDates))]
}

//=========================================//
//         Datamatrix GENERATION           //
// All below functions are related to the  //
// data matrix generation.                 //
//=========================================//

function generateDataMatrix() {
  const customerBirthdate = new Date(receiptContent.customer.birthdate)
  const strSeparator = '#'
  const strPrefix = '/-/'
  const intRandom = random(10, 100)
  const strDate = getDataMatrixDateString()
  const intChecksum = calculateChecksum(
    totalAmount,
    receiptContent.therapist.RCCNumber,
    receiptContent.customer.NPA,
    customerBirthdate,
    therapyStartDate
  )

  return `${strPrefix}${strSeparator}${intRandom}${strSeparator}${strDate}${strSeparator}${intChecksum}`
}

function getDataMatrixDateString() {
  const strDay = String(date.getDate()).padStart(2, '0')
  const strMonth = String((date.getMonth() + 1)).padStart(2, '0')
  const strYear = String(date.getFullYear()).padStart(2, '0')
  const strHours = String(date.getHours()).padStart(2, '0')
  const strMinutes = String(date.getMinutes()).padStart(2, '0')
  const strSeconds = String(date.getSeconds()).padStart(2, '0')

  return `${strDay}${strMonth}${strYear}${strHours}${strMinutes}${strSeconds}`
}

function calculateChecksum(totalAmount, therapistRCCNumber, customerNPA, customerBirthdate, therapyStartDate) {
  const intRCC = parseInt(therapistRCCNumber.substring(1))
  const intCustomerBirthdate = dateDifferenceInDays(customerBirthdate)
  const intCustomerNPA = parseInt(customerNPA.substring(0, 4))
  const intTotalAmount = Math.round(totalAmount)
  const intTherapyStartDate = dateDifferenceInDays(therapyStartDate)

  const intChecksum = intRCC + intCustomerBirthdate + intCustomerNPA + intTotalAmount + intTherapyStartDate

  return `${intChecksum}${intCustomerNPA}${intTotalAmount}${intTherapyStartDate}`
}

function random(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
}

function dateDifferenceInDays(date1) {
  const dateInit = new Date(1900, 01 - 1, 01)
  const MS_PER_DAY = 1000 * 60 * 60 * 24

  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())
  const utc2 = Date.UTC(dateInit.getFullYear(), dateInit.getMonth(), dateInit.getDate())

  return Math.round(Math.abs((utc2 - utc1) / MS_PER_DAY))
}
