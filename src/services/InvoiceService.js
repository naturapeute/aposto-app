export async function previewInvoice(invoiceContent) {
  const response =
    await fetch(`${process.env.API_URL}/pdf/facture-${invoiceContent.timestamp}.pdf`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: process.env.APP_URL
      },
      body: JSON.stringify(invoiceContent)
    })

  if (!response.ok) {
    const body = await response.text()

    throw Error(body)
  }

  return response.blob()
}

export async function sendInvoice(invoiceContent) {
  const response = await fetch(`${process.env.API_URL}/email`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: process.env.APP_URL
    },
    body: JSON.stringify(invoiceContent)
  })

  if (!response.ok) {
    const body = await response.text()

    throw Error(body)
  }
}

export function generateInvoiceContent(
  naturapeuteID,
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
    author: { ...author, IBAN: `CH${author.IBAN}` },
    therapist: { ...therapist },
    patient: { ...patient },
    servicePrice,
    services: APIServices,
    timestamp: Date.now()
  }

  if (naturapeuteID)
    invoiceContent.naturapeuteID = naturapeuteID

  if (!invoiceContent.author.RCC.length)
    delete invoiceContent.author.RCC

  if (!invoiceContent.therapist.RCC.length)
    delete invoiceContent.therapist.RCC

  delete invoiceContent.patient.id

  // FIXME : The API does not support negative JavaScript timestamps for now.
  //          Remove this code once it is supported.
  //          See https://github.com/samuelcolvin/pydantic/issues/1600
  if (invoiceContent.patient.birthday < 0)
    invoiceContent.patient.birthday /= 1000

  return invoiceContent
}
