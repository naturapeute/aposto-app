export async function sendInvoice(author, therapist, patient, servicePrice, services) {
  delete patient.id

  services.forEach(service => {
    delete service.color
    service.date = Date.now()
  })

  const invoiceContent = {
    author,
    therapist,
    patient,
    servicePrice,
    services,
    timestamp: Date.now()
  }

  const invoiceContentBase64 = btoa(JSON.stringify(invoiceContent))

  const response = await fetch(`${process.env.API_URL}/email/${invoiceContentBase64}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Origin: process.env.APP_URL
    }
  })

  if (!response.ok) {
    const body = await response.text()

    throw Error(body)
  }
}
