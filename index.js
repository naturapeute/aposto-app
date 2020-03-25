loadMatomo()

const invoiceDate = Date.now()
const intRandom = Math.floor(Math.random() * (100 - 10 + 1) + 10)
let isInfoEdited = false
let patients

listenServiceAmountChange()
initPatientId()
initServiceDates()
feedServiceOptions()
feedCantonOptions()
loadAuthorAndTherapistBackup()
loadPatientsBackup()
loadServicePriceBackup()
updateTotalAmount()

function listenServiceAmountChange() {
  $$('[data-amount]').forEach(dataAmountElement => {
    dataAmountElement.addEventListener('change', updateTotalAmount)
    dataAmountElement.addEventListener('keyup', updateTotalAmount)
  })
}

function initPatientId() {
  $('#patient-id').value = Date.now()
}

function initServiceDates() {
  $$('.date-col input').forEach(dateInput => {
    dateInput.value = dateObjectToDateInput(new Date())
  })
}

function feedServiceOptions() {
  const template = document.querySelector('#service-template').innerHTML
  const htmlOptions = serviceCodes
    .map(service => template.replace(/\{\{\s*(.*)\s*}}/g, (_, match) => eval(match)))
    .join('')
  $$('[id^=service-code-]').forEach(select => (select.innerHTML += htmlOptions))
}

function feedCantonOptions() {
  document.querySelector('#patient-canton').innerHTML += cantons.map(
    canton => `<option value="${canton}">${canton}</option>`
  )
}

function loadAuthorAndTherapistBackup() {
  const author = JSON.parse(localStorage.getItem('author'))
  const therapist = JSON.parse(localStorage.getItem('therapist'))

  if (author) {
    $('.author-form').hidden = true
    $('#author-name-display').textContent = author.name
    $('.btn-edit-info').hidden = false
    bindWriteForPrefix('author', author)
  }


  if (therapist) {
    $('.therapist-form').hidden = true
    $('#therapist-name-display').textContent = `${therapist.firstName} ${therapist.lastName}`
    $('.btn-edit-info').hidden = false
    bindWriteForPrefix('therapist', therapist)
  }

}

function loadPatientsBackup() {
  patients = JSON.parse(localStorage.getItem('patients'))

  if (patients) {
    patients.sort((a, b) => b.frequency - a.frequency)

    $('.patients-list-container').hidden = false

    patients.forEach((patient) => {
      $(
        '.patients-list'
      ).innerHTML += `<button type="button" class="btn btn-sm btn-patient" onclick="selectPatient(event)" value="${patient._id}">
          ${patient.firstName}
          ${patient.lastName}
        </button>`
    })
  }
}

function loadServicePriceBackup() {
  const servicePrice = JSON.parse(localStorage.getItem('servicePrice'))

  if (servicePrice) bindWriteForPrefix('servicePrice', { servicePrice })
}

function loadGLNNumber(entity) {
  if ($(`#${entity}-gln-number`).value) return

  let name = ''
  let firstName = ''
  let lastName = ''

  if (entity === 'author') name = $('#author-name').value
  else {
    firstName = $('#therapist-first-name').value
    lastName = $('#therapist-last-name').value
  }

  const ZIP = $(`#${entity}-zip`).value
  const city = $(`#${entity}-city`).value

  if (!(name || (firstName && lastName)) || !ZIP || !city) return

  const body = {
    ZIP: encodeURIComponent(ZIP),
    city: encodeURIComponent(city)
  }

  if (entity === 'author') body.name = encodeURIComponent(name)
  else {
    body.firstName = encodeURIComponent(firstName)
    body.lastName = encodeURIComponent(lastName)
  }

  ;(async () => {
    let GLNNumber = await fetchGLN(body)

    if (GLNNumber) return fillGLN(entity, GLNNumber)

    delete body.ZIP
    delete body.city

    GLNNumber = await fetchGLN(body)

    if (GLNNumber) fillGLN(entity, GLNNumber)
  })()
}

async function fetchGLN(data) {
  try {
    const response = await fetch(`${apiURL}/gln`, {
      method: 'POST',
      headers: {
        Origin: appURL
      },
      body: JSON.stringify(data)
    })

    const GLNResult = document.createElement('div')
    GLNResult.innerHTML = await response.text()

    const resultTable = GLNResult.querySelector('#GVResult')

    if (!resultTable) return

    const resultRows = resultTable.querySelectorAll('tr:not(.dgHeader)')

    if (resultRows.length > 1) return

    return resultRows[0].querySelector('td').innerText
  } catch (err) {
    console.error(err.message)
  }
}

function fillGLN(entity, GLNNumber) {
  const GLNInput = $(`#${entity}-gln-number`)
  GLNInput.value = GLNNumber
  GLNInput.disabled = true
  $(`.${entity}-form .form-input-hint-success`).hidden = false
  $(`.${entity}-form .form-input-hint-primary`).hidden = true
}

function editInfo(e) {
  $('.author-form').hidden = false
  $('.therapist-form').hidden = false
  $('.btn-edit-info').hidden = true

  isInfoEdited = true
}

function emptyPatientInfo(e) {
  bindWriteForPrefix('patient', {})
  initPatientId()
}

function selectPatient(e) {
  bindWriteForPrefix(
    'patient',
    patients.find(patient => patient._id === e.currentTarget.value)
  )
}

function onPriceEdit() {
  isInfoEdited = true
}

function updateTotalAmount() {
  const price = Number($('#service-price').value) / 60

  const totalAmount = $$('[id^=service-duration-]').reduce(
    (total, duration) => total + Number(duration.value) * price,
    0
  )

  $('#total-amount').textContent = totalAmount.toFixed(2)
}

function onServiceCodeSelected(e, serviceIndex) {
  if (!e.currentTarget.value) {
    $(`#service-duration-${serviceIndex}`).value = ''
    updateTotalAmount()
  }

  $(`#service-duration-${serviceIndex}`).required = Boolean(e.currentTarget.value)
}

function generateInvoiceBase64() {
  const author = bindReadForPrefix('author')
  const therapist = bindReadForPrefix('therapist')
  const patient = getPatientData()
  const servicePrice = Number($('#service-price').value)

  const invoiceContent = {
    intRandom,
    author,
    therapist,
    patient,
    servicePrice,
    services: getServicesData(),
    timestamp: invoiceDate
  }

  saveData('author', author)
  saveData('therapist', therapist)
  saveData('servicePrice', servicePrice)
  savePatient(patient)

  return btoa(JSON.stringify(invoiceContent))
}

function submitInvoice(e) {
  e.preventDefault()

  // NOTE : submitAction is initialized in the onclick event of the submit buttons. It can
  // be downloadInvoice or sendInvoice functions
  submitAction()
}

function downloadInvoice() {
  const invoiceContentBase64 = generateInvoiceBase64()
  const invoiceFilename = `facture-${Date.now()}.pdf`

  const link = document.createElement('a')
  link.download = invoiceFilename
  link.href = `${apiURL}/pdf/${invoiceContentBase64}/${invoiceFilename}`
  link.target = '_blank'
  link.click()

  $('#success-alert-download').hidden = false
}

function sendInvoice() {
  const invoiceContentBase64 = generateInvoiceBase64()

  ;(async () => {
    try {
      const response = await fetch(`${apiURL}/email/${invoiceContentBase64}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Origin: appURL
        }
      })

      if (!response.ok) {
        console.error('Email sending has failed. Try again later.')
        $('#error-alert-email').hidden = false

        try {
          const errorContent = await response.json()
          console.error(errorContent)
        } catch (err) {
          console.error(`Body JSON parsing has failed: ${err.message}`)
        }
      } else $('#success-alert-email').hidden = false
    } catch (err) {
      console.error(`Fetch has failed: ${err.message}`)
      $('#error-alert-email').hidden = false
    }
  })()
}

function getPatientData() {
  return Object.assign(bindReadForPrefix('patient'), {
    birthdate: new Date($('#patient-birthdate').value).getTime()
  })
}

function getServicesData() {
  return $$('[id^=service-code-]').reduce((service, serviceCode, i) => {
    if (!serviceCode.value) return service

    return [
      ...service,
      {
        date: new Date($(`#service-date-${i + 1}`).value).getTime(),
        code: Number(serviceCode.value),
        duration: Number($(`#service-duration-${i + 1}`).value)
      }
    ]
  }, [])
}

function saveData(dataName, data) {
  if (!localStorage.getItem(dataName) || isInfoEdited) localStorage.setItem(dataName, JSON.stringify(data))
}

function savePatient(patient) {
  const patients = JSON.parse(localStorage.getItem('patients')) || []

  const matchingPatient = patients.find(existingPatient => existingPatient._id === patient._id)

  if (matchingPatient) matchingPatient.frequency++
  else patients.push(Object.assign(patient, { frequency: 1 }))

  localStorage.setItem('patients', JSON.stringify(patients))
}

function dateObjectToDateInput(date) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')

  return `${date.getFullYear()}-${month}-${day}`
}

function toDateInput(dateString) {
  return dateObjectToDateInput(new Date(dateString))
}

/**
 * // NOTE //
 * Write down properties from data to 'value' atrtibute of matching HTML element
 *
 * Exemple :
 * <input id="input-1" type="text" bind="myPrefix.myProperty1" />
 * <input id="input-2" type="text" bind="myPrefix.myProperty2" />
 * bindWriteForPrefix('myPrefix', { myProperty1: 'value1', myProperty2: 'value2' })
 * writes "value1" in the 'value' attribute of input #input-1 and "value2" in 'value' attribute of input #input-2.
 *
 * In details : It selects all HTML elements having attribute 'bind' equal to "myPrefix.*". It gets the 'bind' attribute
 * and parse it to collect the property name and the transformer. The transformer is a function that is applied to the
 * value to format it. It is provided as a pipe in the 'bind' attribute (ex :
 *                                                <input ... bind="myPrefix.myProperty | myTransformer" />)
 * Then, it gets the value from the provided data object and the collected key, applying or not the transformer.
 * It finally affects the computed value to the 'value' attribute of the element.
 *
 * @param prefix The bind attribute prefix
 * @param data The data object that contains the data to bind with HTML elements
 */
function bindWriteForPrefix(prefix, data) {
  $$(`[bind^="${prefix}."]`).forEach(element => {
    const [_, key, transformer] = element.getAttribute('bind').match(/\w+\.(\w+)\s*\|?\s*(\w*)/)
    const value = transformer ? eval(transformer)(data[key]) : data[key]

    element.value = value || ''
  })
}

/**
 * // NOTE //
 * Read 'value' atrtibute of matching HTML element and collect it in a data object
 *
 * Exemple :
 * <input id="input-1" type="text" bind="myPrefix.myProperty1" value="value1" />
 * <input id="input-2" type="text" bind="myPrefix.myProperty2" value="value2" />
 * bindWriteForPrefix('myPrefix') returns the object { myProperty1: 'value1', myProperty2: 'value2' }.
 *
 * In details : It selects all HTML elements having attribute 'bind' equal to "myPrefix.*". It gets the 'bind' attribute
 * and parse it to collect the property name. The transformer is not handled on read.
 * Finally, it gets the value from the HTML element and add it to the data object
 *
 * @param prefix The bind attribute prefix
 */
function bindReadForPrefix(prefix) {
  return $$(`[bind^="${prefix}."]`).reduce((obj, element) => {
    const [_, key, transformer] = element.getAttribute('bind').match(/\w+\.(\w+)\s*\|?\s*(\w*)/)

    return Object.assign(obj, { [key]: element.value })
  }, {})
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
