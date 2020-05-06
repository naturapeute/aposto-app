export async function sendInvoice(
  terrapeuteID,
  author,
  therapist,
  patient,
  servicePrice,
  services
) {
  const APIServices = services.map(e => ({ ...e }))

  APIServices.forEach(service => {
    delete service.color
    delete service.id
    service.date = Date.now()
  })

  const invoiceContent = {
    author,
    therapist,
    patient: { ...patient },
    servicePrice,
    services: APIServices,
    timestamp: Date.now()
  }

  if (terrapeuteID)
    invoiceContent.terrapeuteID = terrapeuteID

  delete invoiceContent.patient.id

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
