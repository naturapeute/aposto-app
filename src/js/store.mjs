import { writable } from 'svelte/store'
import {
  authorFixture,
  therapistFixture,
  patientsFixture,
  servicePriceFixture
} from './fixtures'

export const author = writable({ ...authorFixture })
export const therapist = writable({ ...therapistFixture })
export const patients = writable([...patientsFixture])
export const servicePrice = writable(servicePriceFixture)
