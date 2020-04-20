import { writable } from 'svelte/store'
import {
  authorFixture,
  therapistFixture,
  patientsFixture,
  servicePriceFixture,
  preferedServicesFixture
} from './fixtures'

export const author = writable({ ...authorFixture })
export const therapist = writable({ ...therapistFixture })
export const patients = writable(patientsFixture.map(e => ({ ...e })))
export const servicePrice = writable(servicePriceFixture)
export const preferedServices = writable(preferedServicesFixture.map(e => ({ ...e })))

export const loading = writable(false)
