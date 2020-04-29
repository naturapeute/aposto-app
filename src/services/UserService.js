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
  preferedServices
) {
  const extraData = {
    author: {
      name: author.name,
      RCC: author.RCC,
      GLN: author.GLN
    },
    therapist: {
      RCC: therapist.RCC,
      GLN: therapist.GLN
    },
    servicePrice: servicePrice,
    preferedServices: preferedServices.map(e => ({ ...e }))
  }

  const response = await fetch(`https://terrapeute.ch/api/therapist/${terrapeuteUserID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Origin: process.env.APP_URL
    },
    body: JSON.stringify(extraData)
  })

  if (response.ok)
    return await response.text()
  else {
    const body = await response.text()

    throw Error(body)
  }
}
