import { writable, derived } from 'svelte/store'

import { serviceColors } from './utils'

function userCustomStore() {
  const defaultUser = {
    naturapeuteID: null,
    author: {
      name: '',
      street: '',
      zipcode: '',
      city: '',
      email: '',
      phone: '',
      iban: '',
      rcc: ''
    },
    therapist: {
      firstname: '',
      lastname: '',
      street: '',
      zipcode: '',
      city: '',
      phone: '',
      rcc: ''
    },
    servicePrice: 0,
    preferredServices: [
      { code: 1200, color: serviceColors[0] }
    ]
  }
  let actualValue = JSON.parse(JSON.stringify(defaultUser))
  let updated = false

  const { subscribe, set, update } = writable(JSON.parse(JSON.stringify(defaultUser)))

  function initUpdated() {
    updated = false
  }

  function isUpdated() {
    return updated
  }

  function logOut() {
    actualValue = JSON.parse(JSON.stringify(defaultUser))
    set(JSON.parse(JSON.stringify(defaultUser)))
    window.localStorage.removeItem('naturapeuteEmail')
  }

  function setOnChange(newValue) {
    if (JSON.stringify(newValue) !== JSON.stringify(actualValue)) {
      actualValue = JSON.parse(JSON.stringify(newValue))
      updated = true
      set(newValue)
    }
  }

  return { subscribe, set: setOnChange, update, initUpdated, isUpdated, logOut }
}

function totalDurationCustomStore(initValue) {
  let actualValue = initValue
  let reduced = false

  const { subscribe, set, update } = writable(actualValue)

  function hasReduced() {
    return reduced
  }

  function setOnChange(newValue) {
    if (newValue < actualValue)
      reduced = true
    else
      reduced = false

    actualValue = newValue
    set(newValue)
  }

  return { subscribe, set: setOnChange, update, hasReduced }
}

function selectedServicesCustomStore(initValue) {
  const { subscribe, set, update } = writable(initValue)

  function addService(id, code, duration, color) {
    return update(actualValue => [
      ...actualValue,
      { id, code, duration, color }
    ])
  }

  function deleteService(id) {
    return update(actualValue =>
      actualValue.reduce((newValue, service) => {
        if (service.id === id) return newValue

        return [...newValue, service]
      }, [])
    )
  }

  return { subscribe, set, update, addService, deleteService }
}

export const user = userCustomStore()
export const patients = writable([])
export const totalDuration = totalDurationCustomStore(0)
export const selectedPatient = writable(null)
export const selectedServices = selectedServicesCustomStore([])
export const remainingDuration = derived(
  [totalDuration, selectedServices],
  ([$totalDuration, $selectedServices]) => {
    const usedDuration = $selectedServices.reduce((total, service) => total + service.duration, 0)

    return $totalDuration - usedDuration
  }
)

export const loading = writable(false)
