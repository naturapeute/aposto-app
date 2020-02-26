const urlParams = new URLSearchParams(window.location.search)
const receiptContent = JSON.parse(atob(urlParams.get('receiptContent')))

const date = new Date()
const timestamp = `${date.getTime()}`.slice(0, -3)
const fullDateString = getFullDateString(date)
const dateString = getDateString(date)

$('#identification').innerHTML = `${timestamp}  ${fullDateString}`
$('#author-names').innerHTML = receiptContent.author.name
$('#author-rcc').innerHTML = receiptContent.author.RCCNumber
$('#author-address').innerHTML = `${receiptContent.author.street}, ${receiptContent.author.NPA}, ${receiptContent.author.city}`
$('#service-performer-names').innerHTML = `${receiptContent.therapist.firstName} ${receiptContent.therapist.lastName}`
$('#service-performer-rcc').innerHTML = receiptContent.therapist.RCCNumber
$('#service-performer-address').innerHTML = `${receiptContent.therapist.street}, ${receiptContent.therapist.NPA}, ${receiptContent.therapist.city}`
$('#customer-last-name').innerHTML = receiptContent.customer.lastName
$('#customer-first-name').innerHTML = receiptContent.customer.firstName
$('#customer-street').innerHTML = receiptContent.customer.street
$('#customer-npa').innerHTML = receiptContent.customer.NPA
$('#customer-city').innerHTML = receiptContent.customer.city
$('#customer-birthdate').innerHTML = getDateString(new Date(receiptContent.customer.birthdate))
$('#therapy-start-date').innerHTML = dateString
$('#therapy-end-date').innerHTML = dateString
$('#receipt-date').innerHTML = dateString
$('#receipt-number').innerHTML = `/ ${timestamp}  ${fullDateString}`
$('#therapy-type').innerHTML = 'Thérapie individuelle'

let totalAmount = 0

for (let i = 0; i < receiptContent.services.length; i++) {
  const quantity = Number(receiptContent.services[i].duration) / 5
  const price = Number(receiptContent.servicePrice) / 12

  $(`.service-${i + 1}.service-date`).innerHTML = dateString
  $(`.service-${i + 1}.service-rate-type`).innerHTML = '590'
  $(`.service-${i + 1}.service-code`).innerHTML = receiptContent.services[i].code
  $(`.service-${i + 1}.service-quantity`).innerHTML = quantity.toFixed(2)
  $(`.service-${i + 1}.service-price`).innerHTML = price.toFixed(2)
  $(`.service-${i + 1}.service-point-value`).innerHTML = '1.00'
  $(`.service-${i + 1}.service-tax`).innerHTML = '0.0%'
  $(`.service-${i + 1}.service-amount`).innerHTML = (quantity * price).toFixed(2)
  $(`.service-${i + 1}.service-code-label`).innerHTML = serviceCodes.find(serviceCode => serviceCode.value === Number(receiptContent.services[i].code)).label

  totalAmount += quantity * price
}

$('#total-amount').innerHTML = totalAmount.toFixed(2)
$('#owed-amount').innerHTML = totalAmount.toFixed(2)

function getFullDateString(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${getDateString(date)} ${hours}:${minutes}:${seconds}`
}