export async function authenticate(email) {
  const response = await fetch(`https://terrapeute.ch/api/therapist/${email}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Origin: process.env.APP_URL
    }
  })

  if (response.ok)
    return await response.json()
  else {
    const body = await response.text()

    throw Error(body)
  }
}

export async function saveUser(
  terrapeuteUserID,
  author,
  therapist,
  servicePrice,
  preferredServices,
  patients
) {
  const extraData = {
    author: { ...author },
    therapist: { ...therapist },
    servicePrice: servicePrice,
    preferredServices: preferredServices.map(e => ({ ...e })),
    patients: patients.map(e => ({ ...e }))
  }

  const response = await fetch(`https://terrapeute.ch/api/therapist/${terrapeuteUserID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Origin: process.env.APP_URL
    },
    body: JSON.stringify({ extraData: extraData })
  })

  if (response.ok)
    return await response.text()
  else {
    const body = await response.text()

    throw Error(body)
  }
}

export async function getGLN(authorName, therapistFirstName, therapistLastName, ZIP, city) {
  if (!(authorName || (therapistFirstName && therapistLastName)) || !ZIP || !city)
    return ''

  const body = {
    ZIP: encodeURI(ZIP),
    city: encodeURI(city)
  }

  if (authorName)
    body.name = encodeURI(authorName)
  else {
    body.firstName = encodeURI(therapistFirstName)
    body.lastName = encodeURI(therapistLastName)
  }

  try {
    return await fetchGLN(body)
  } catch (e) {
    delete body.ZIP
    delete body.city

    return await fetchGLN(body)
  }
}

async function fetchGLN(data) {
  const response = await fetch(`${process.env.API_URL}/gln`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: process.env.APP_URL
    },
    body: JSON.stringify(data)
  })

  const GLNResult = document.createElement('div')
  GLNResult.innerHTML = await response.text()

  const resultTable = GLNResult.querySelector('#GVResult')

  if (!resultTable)
    throw Error('GLN not found')

  const resultRows = resultTable.querySelectorAll('tr:not(.dgHeader)')

  if (resultRows.length > 1)
    throw Error('GLN not found')

  return resultRows[0].querySelector('td').innerText
}
