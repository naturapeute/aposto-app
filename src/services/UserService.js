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
  terrapeuteID,
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

  const response = await fetch(`https://terrapeute.ch/api/therapist/${terrapeuteID}`, {
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
