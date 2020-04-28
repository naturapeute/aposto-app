export async function authenticate(email) {
  const response = await fetch(`https://terrapeute.ch/api/therapist/${email}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })

  if (response.ok)
    return await response.json()
  else {
    const body = await response.text()

    throw Error(body)
  }
}
