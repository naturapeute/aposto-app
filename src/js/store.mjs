import { writable } from 'svelte/store'
import {
  authorFixture,
  therapistFixture,
  patientsFixture,
  servicesFixture,
  servicePriceFixture
} from './fixtures'

export const author = writable({ ...authorFixture })
export const therapist = writable({ ...therapistFixture })
export const patients = writable([...patientsFixture])
export const services = writable([...servicesFixture])
export const servicePrice = writable(servicePriceFixture)
export const selectedPatient = writable(patientsFixture[0])
