let isInfoEdited = false
let customers

const urlParams = new URLSearchParams(window.location.search)
const myParam = urlParams.get('success')

if (myParam === '1')
  $('.success-alert').className = 'success-alert bg-success show-class'

Array.from(document.querySelectorAll('[data-amount]')).forEach(dataAmountElement => {
  dataAmountElement.addEventListener('change', updateTotalAmount)
  dataAmountElement.addEventListener('keyup', updateTotalAmount)
})

feedServiceOptions()

loadAuthorBackup()
loadTherapistBackup()
loadCustomersBackup()
loadServicePriceBackup()

updateTotalAmount()

function feedServiceOptions() {
  const template = document.querySelector('#service-template').innerHTML
  const htmlOptions = services.map(service => template.replace(/\{\{\s*(.*)\s*}}/g, (_, match) => eval(match))).join('')
  Array.from(document.querySelectorAll('[id^=service-code-]')).forEach(select => select.innerHTML += htmlOptions)
}

function loadAuthorBackup() {
  const author = JSON.parse(localStorage.getItem('author'))

  if (author) {
    $('.author-column .show-class').className = 'hide-class'
    $('#author-name-display').innerHTML = author.name
    $('#author-name').value = author.name
    $('#author-rcc-number').value = author.RCCNumber
    $('#author-street').value = author.street
    $('#author-npa').value = author.NPA
    $('#author-city').value = author.city
    $('.btn-edit-info').className = 'btn btn-sm btn-primary btn-edit-info show-class'
  }
}

function loadTherapistBackup() {
  const therapist = JSON.parse(localStorage.getItem('therapist'))

  if (therapist) {
    $('.therapist-column .show-class').className = 'hide-class'
    $('#therapist-name-display').innerHTML = `${therapist.firstName} ${therapist.lastName}`
    $('#therapist-first-name').value = therapist.firstName
    $('#therapist-last-name').value = therapist.lastName
    $('#therapist-rcc-number').value = therapist.RCCNumber
    $('#therapist-street').value = therapist.street
    $('#therapist-npa').value = therapist.NPA
    $('#therapist-city').value = therapist.city
    $('.btn-edit-info').className = 'btn btn-sm btn-primary btn-edit-info show-class'
  }
}

function loadCustomersBackup() {
  customers = JSON.parse(localStorage.getItem('customers'))

  if (customers) {
    customers.sort((a, b) => b.frequency - a.frequency)

    $('.customers-list-container').className = 'customers-list-container show-class'

    customers.forEach((customer, i) => {
      $('.customers-list').innerHTML +=
        `<div class="card customer-card" id="customer-${i}" onclick=selectCustomer(${i})>
          <div class="card-body">
            ${customer.firstName}<br>
            ${customer.lastName}
          </div>
        </div>`
    })
  }
}

function loadServicePriceBackup() {
  const servicePrice = JSON.parse(localStorage.getItem('servicePrice'))

  if (servicePrice) $('#service-price').value = servicePrice
}

function editInfo(e) {
  e.preventDefault()

  $('.author-column .hide-class').className = 'show-class'
  $('.therapist-column .hide-class').className = 'show-class'
  $('.btn-edit-info').className = 'btn btn-sm btn-primary btn-edit-info hide-class'

  isInfoEdited = true
}

function selectCustomer(i) {
  $('#customer-first-name').value = customers[i].firstName
  $('#customer-last-name').value = customers[i].lastName
  $('#customer-street').value = customers[i].street
  $('#customer-npa').value = customers[i].NPA
  $('#customer-city').value = customers[i].city
  $('#customer-birthdate').value = dateObjectToDateInput(new Date(customers[i].birthdate))
}

function onPriceEdit() {
  isInfoEdited = true
}

function updateTotalAmount() {
  let totalAmount = 0
  const price = Number($('#service-price').value) / 12

  for (let i = 1; i <= 5; i++)
    totalAmount += (Number($(`#service-duration-${i}`).value) / 5) * price

  $('#total-amount').innerHTML = totalAmount.toFixed(2)
}

function generateReceipt(e) {
  e.preventDefault()

  const author = getAuthorData()
  const therapist = getTherapistData()
  const customer = getCustomerData()

  const servicePrice = $('#service-price').value

  const receiptContent = {
    author: author,
    therapist: therapist,
    customer: customer,
    servicePrice: servicePrice,
    services: getServicesData()
  }

  saveData('author', author)
  saveData('therapist', therapist)
  saveData('servicePrice', servicePrice)
  saveCustomer(customer)

  const receiptContentBase64 = btoa(JSON.stringify(receiptContent))
  const receiptFilename = `facture-${Date.now()}.pdf`
  const receiptURL = encodeURIComponent(`http://app.aposto.ch/receipt/receipt.html?receiptContent=${receiptContentBase64}`)
  const url = `http://f.terrapeute.ch/pdf/${receiptURL}/${receiptFilename}`

  const link = document.createElement('a')
  link.download = receiptFilename
  link.href = url
  link.target = '_blank'
  link.click()

  window.location.href = '?success=1'
}

function getAuthorData() {
  return {
    name: $('#author-name').value,
    RCCNumber: $('#author-rcc-number').value,
    street: $('#author-street').value,
    NPA: $('#author-npa').value,
    city: $('#author-city').value
  }
}

function getTherapistData() {
  return {
    firstName: $('#therapist-first-name').value,
    lastName: $('#therapist-last-name').value,
    RCCNumber: $('#therapist-rcc-number').value,
    street: $('#therapist-street').value,
    NPA: $('#therapist-npa').value,
    city: $('#therapist-city').value
  }
}

function getCustomerData() {
  return {
    firstName: $('#customer-first-name').value,
    lastName: $('#customer-last-name').value,
    street: $('#customer-street').value,
    NPA: $('#customer-npa').value,
    city: $('#customer-city').value,
    birthdate: $('#customer-birthdate').value,
    frequency: 1
  }
}

function getServicesData() {
  const services = []

  for (let i = 1; i <= 5; i++) {
    const serviceCode = $(`#service-code-${i}`).value

    if (serviceCode) {
      const service = {
        code: serviceCode,
        duration: $(`#service-duration-${i}`).value
      }

      services.push(service)
    }
  }

  return services
}

function saveData(dataName, data) {
  if (!localStorage.getItem(dataName) || isInfoEdited)
    localStorage.setItem(dataName, JSON.stringify(data))
}

function saveCustomer(customer) {
  const customers = JSON.parse(localStorage.getItem('customers'))

  if (customers) {
    const matchingCustomer = customers.find(existingCustomer => {
      return existingCustomer.firstName === customer.firstName
        && existingCustomer.lastName === customer.lastName
        && existingCustomer.street === customer.street
        && existingCustomer.NPA === customer.NPA
        && existingCustomer.city === customer.city
        && existingCustomer.birthdate === customer.birthdate
    })

    if (matchingCustomer)
      matchingCustomer.frequency++
    else
      customers.push(customer)

    localStorage.setItem('customers', JSON.stringify(customers))
  } else
    localStorage.setItem('customers', JSON.stringify([customer]))
}

function dateObjectToDateInput(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}