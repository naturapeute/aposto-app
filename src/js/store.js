import { writable } from 'svelte/store'

import { serviceColors } from './utils'

function userCustomStore() {
  const defaultUser = {
    terrapeuteID: null,
    author: {
      name: '',
      street: '',
      ZIP: '',
      city: '',
      email: '',
      phone: '',
      RCC: ''
    },
    therapist: {
      firstName: '',
      lastName: '',
      street: '',
      ZIP: '',
      city: '',
      phone: '',
      RCC: ''
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
    window.localStorage.removeItem('terrapeuteEmail')
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

export const user = userCustomStore()
export const patients = writable([])
export const totalDuration = totalDurationCustomStore(0)
export const selectedPatient = writable(null)
export const selectedServices = writable([])

export const loading = writable(false)
