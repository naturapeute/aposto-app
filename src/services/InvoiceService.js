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
  services,
  paid
) {
  const APIServices = services.map(e => ({ ...e }))

  APIServices.forEach(service => {
    delete service.color
    delete service.id
    service.date = Date.now()
  })

  const invoiceContent = {
    author: { ...author, IBAN: `CH${author.iban}` },
    therapist: { ...therapist },
    patient: { ...patient },
    servicePrice,
    services: APIServices,
    timestamp: Date.now(),
    paid
  }

  if (naturapeuteID)
    invoiceContent.naturapeuteID = naturapeuteID

  if (!invoiceContent.author.rcc.length)
    delete invoiceContent.author.rcc

  if (!invoiceContent.therapist.rcc.length)
    delete invoiceContent.therapist.rcc

  delete invoiceContent.patient.id

  return invoiceContent
}
