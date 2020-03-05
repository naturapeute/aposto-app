const urlParams = new URLSearchParams(window.location.search)
const receiptContent = JSON.parse(atob(urlParams.get('receiptContent').replace(/\s/g, '+')))

const date = new Date(receiptContent.timestamp)
const timestamp = `${date.getTime()}`.slice(0, -3)
const fullDateString = getFullDateString(date)
const dateString = getDateString(date)

$('#identification').textContent = `${timestamp}  ${fullDateString}`
$('#author-names').textContent = receiptContent.author.name
$('#author-rcc').textContent = receiptContent.author.RCCNumber
$('#author-address').textContent = `${receiptContent.author.street}, ${receiptContent.author.NPA}, ${receiptContent.author.city}`
$('#author-email').textContent = receiptContent.author.email
$('#author-phone').textContent = receiptContent.author.phone
$('#therapist-names').textContent = `${receiptContent.therapist.firstName} ${receiptContent.therapist.lastName}`
$('#therapist-rcc').textContent = receiptContent.therapist.RCCNumber
$('#therapist-address').textContent = `${receiptContent.therapist.street}, ${receiptContent.therapist.NPA}, ${receiptContent.therapist.city}`
$('#therapist-email').textContent = receiptContent.therapist.email
$('#therapist-phone').textContent = receiptContent.therapist.phone
$('#customer-last-name').textContent = receiptContent.customer.lastName
$('#customer-first-name').textContent = receiptContent.customer.firstName
$('#customer-street').textContent = receiptContent.customer.street
$('#customer-npa').textContent = receiptContent.customer.NPA
$('#customer-city').textContent = receiptContent.customer.city
$('#customer-birthdate').textContent = getDateString(new Date(receiptContent.customer.birthdate))
$('#therapy-start-date').textContent = dateString
$('#therapy-end-date').textContent = dateString
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
  $(`.service-${i + 1}.service-code-label`).textContent = serviceCodes.find(serviceCode => serviceCode.value === Number(receiptContent.services[i].code)).label

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
