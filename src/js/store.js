import { writable } from 'svelte/store'

import { serviceColors } from './utils'

export function initUser() {
  const defaultUser = {
    terrapeuteUserID: null,
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
  let updated = false
  let actualValue = JSON.parse(JSON.stringify(defaultUser))

  const { subscribe, set, update } = writable(defaultUser)

  function initUpdated() {
    updated = false
  }

  function isUpdated() {
    return updated
  }

  function setOnChange(newValue) {
    if (JSON.stringify(newValue) !== JSON.stringify(actualValue)) {
      actualValue = JSON.parse(JSON.stringify(newValue))
      updated = true
      set(newValue)
    }
  }

  return { subscribe, set: setOnChange, update, initUpdated, isUpdated }
}

export const user = initUser()
export const patients = writable([])
export const selectedServices = writable([])

export const loading = writable(false)
