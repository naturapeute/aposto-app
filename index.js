loadMatomo()

const receiptDate = Date.now()
const intRandom = Math.floor(Math.random() * (100 - 10 + 1) + 10)
let isInfoEdited = false
let patients

Array.from(document.querySelectorAll('[data-amount]')).forEach(dataAmountElement => {
  dataAmountElement.addEventListener('change', updateTotalAmount)
  dataAmountElement.addEventListener('keyup', updateTotalAmount)
})

Array.from(document.querySelectorAll('.date-col input')).forEach(dateInput => {
  dateInput.value = dateObjectToDateInput(new Date())
})

feedServiceOptions()
feedCantonOptions()

loadAuthorBackup()
loadTherapistBackup()
loadPatientsBackup()
loadServicePriceBackup()

updateTotalAmount()

function feedServiceOptions() {
  const template = document.querySelector('#service-template').innerHTML
  const htmlOptions = serviceCodes
    .map(service => template.replace(/\{\{\s*(.*)\s*}}/g, (_, match) => eval(match)))
    .join('')
  Array.from(document.querySelectorAll('[id^=service-code-]')).forEach(select => (select.innerHTML += htmlOptions))
}

function feedCantonOptions() {
  document.querySelector('#patient-canton').innerHTML += cantons.map(
    canton => `<option value="${canton}">${canton}</option>`
  )
}

function loadAuthorBackup() {
  const author = JSON.parse(localStorage.getItem('author'))

  if (author) {
    $('.author-form').classList.add('hide')
    $('#author-name-display').textContent = author.name
    $('#author-name').value = author.name
    $('#author-rcc-number').value = author.RCCNumber
    $('#author-street').value = author.street
    $('#author-npa').value = author.NPA
    $('#author-city').value = author.city
    $('#author-email').value = author.email
    $('#author-phone').value = author.phone
    $('.btn-edit-info').classList.remove('hide')
  }
}

function loadTherapistBackup() {
  const therapist = JSON.parse(localStorage.getItem('therapist'))

  if (therapist) {
    $('.therapist-form').classList.add('hide')
    $('#therapist-name-display').textContent = `${therapist.firstName} ${therapist.lastName}`
    $('#therapist-first-name').value = therapist.firstName
    $('#therapist-last-name').value = therapist.lastName
    $('#therapist-rcc-number').value = therapist.RCCNumber
    $('#therapist-street').value = therapist.street
    $('#therapist-npa').value = therapist.NPA
    $('#therapist-city').value = therapist.city
    $('#therapist-email').value = therapist.email
    $('#therapist-phone').value = therapist.phone
    $('.btn-edit-info').classList.remove('hide')
  }
}

function loadPatientsBackup() {
  patients = JSON.parse(localStorage.getItem('patients'))

  if (patients) {
    patients.sort((a, b) => b.frequency - a.frequency)

    $('.patients-list-container').classList.remove('hide')

    patients.forEach((patient, i) => {
      $('.patients-list').innerHTML += `<div class="card patient-card" id="patient-${i}" onclick=selectPatient(${i})>
          <div class="card-body">
            ${patient.firstName}<br>
            ${patient.lastName}
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

  $('.author-form').classList.remove('hide')
  $('.therapist-form').classList.remove('hide')
  $('.btn-edit-info').classList.add('hide')

  isInfoEdited = true
}

function selectPatient(i) {
  $('#patient-first-name').value = patients[i].firstName
  $('#patient-last-name').value = patients[i].lastName
  $('#patient-street').value = patients[i].street
  $('#patient-npa').value = patients[i].NPA
  $('#patient-city').value = patients[i].city
  $('#patient-email').value = patients[i].email
  $('#patient-birthdate').value = dateObjectToDateInput(new Date(patients[i].birthdate))
}

function onPriceEdit() {
  isInfoEdited = true
}

function updateTotalAmount() {
  let totalAmount = 0
  const price = Number($('#service-price').value) / 12

  for (let i = 1; i <= 5; i++) totalAmount += (Number($(`#service-duration-${i}`).value) / 5) * price

  $('#total-amount').textContent = totalAmount.toFixed(2)
}

function generateReceiptBase64() {
  const author = getAuthorData()
  const therapist = getTherapistData()
  const patient = getPatientData()

  const servicePrice = Number($('#service-price').value)

  const receiptContent = {
    intRandom: intRandom,
    timestamp: receiptDate,
    author: author,
    therapist: therapist,
    patient: patient,
    servicePrice: servicePrice,
    services: getServicesData()
  }

  saveData('author', author)
  saveData('therapist', therapist)
  saveData('servicePrice', servicePrice)
  savePatient(patient)

  return btoa(JSON.stringify(receiptContent))
}

function downloadReceipt(e) {
  e.preventDefault()

  const receiptContentBase64 = generateReceiptBase64()
  const receiptFilename = `facture-${Date.now()}.pdf`

  const link = document.createElement('a')
  link.download = receiptFilename
  link.href = `${apiURL}/pdf/${receiptContentBase64}/${receiptFilename}`
  link.target = '_blank'
  link.click()

  $('#success-alert-download').classList.toggle('hide')
}

function sendReceipt(e) {
  e.preventDefault()

  const receiptContentBase64 = generateReceiptBase64()

  ;(async () => {
    try {
      const response = await fetch(`${apiURL}/email/${receiptContentBase64}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Origin: 'https://app.aposto.ch'
        }
      })

      if (response.status != 200) {
        console.log('Email sending has failed. Try again later.')

        try {
          const errorContent = await response.json()

          console.log(errorContent)
        } catch (err) {
          console.log(`Body JSON parsing has failed: ${err.message}`)
        }
      } else $('#success-alert-email').classList.toggle('hide')
    } catch (err) {
      console.log(`Fetch has failed: ${err.message}`)
    }
  })()
}

function getAuthorData() {
  return {
    name: $('#author-name').value,
    RCCNumber: $('#author-rcc-number').value,
    street: $('#author-street').value,
    NPA: $('#author-npa').value,
    city: $('#author-city').value,
    email: $('#author-email').value,
    phone: $('#author-phone').value
  }
}

function getTherapistData() {
  return {
    firstName: $('#therapist-first-name').value,
    lastName: $('#therapist-last-name').value,
    RCCNumber: $('#therapist-rcc-number').value,
    street: $('#therapist-street').value,
    NPA: $('#therapist-npa').value,
    city: $('#therapist-city').value,
    email: $('#therapist-email').value,
    phone: $('#therapist-phone').value
  }
}

function getPatientData() {
  return {
    firstName: $('#patient-first-name').value,
    lastName: $('#patient-last-name').value,
    street: $('#patient-street').value,
    NPA: $('#patient-npa').value,
    city: $('#patient-city').value,
    email: $('#patient-email').value,
    birthdate: new Date($('#patient-birthdate').value).getTime(),
    gender: $('#patient-gender').value,
    canton: $('#patient-canton').value,
    frequency: 1
  }
}

function getServicesData() {
  const services = []

  for (let i = 1; i <= 5; i++) {
    const serviceCode = Number($(`#service-code-${i}`).value)

    if (serviceCode) {
      const service = {
        date: new Date($(`#service-date-${i}`).value).getTime(),
        code: serviceCode,
        duration: Number($(`#service-duration-${i}`).value)
      }

      services.push(service)
    }
  }

  return services
}

function saveData(dataName, data) {
  if (!localStorage.getItem(dataName) || isInfoEdited) localStorage.setItem(dataName, JSON.stringify(data))
}

function savePatient(patient) {
  const patients = JSON.parse(localStorage.getItem('patients'))

  if (patients) {
    const matchingPatient = patients.find(existingPatient => {
      return (
        existingPatient.firstName === patient.firstName &&
        existingPatient.lastName === patient.lastName &&
        existingPatient.street === patient.street &&
        existingPatient.NPA === patient.NPA &&
        existingPatient.city === patient.city &&
        existingPatient.email === patient.email &&
        existingPatient.birthdate === patient.birthdate
      )
    })

    if (matchingPatient) matchingPatient.frequency++
    else patients.push(patient)

    localStorage.setItem('patients', JSON.stringify(patients))
  } else localStorage.setItem('patients', JSON.stringify([patient]))
}

function dateObjectToDateInput(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

function loadMatomo() {
  var _paq = window._paq || []
  _paq.push(['trackPageView'])
  _paq.push(['enableLinkTracking'])
  ;(function() {
    var u = '//stats.anonym.dev/'
    _paq.push(['setTrackerUrl', u + 'matomo.php'])
    _paq.push(['setSiteId', '5'])
    var d = document,
      g = d.createElement('script'),
      s = d.getElementsByTagName('script')[0]
    g.type = 'text/javascript'
    g.async = true
    g.defer = true
    g.src = u + 'matomo.js'
    s.parentNode.insertBefore(g, s)
  })()
}
