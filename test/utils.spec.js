/* eslint-env mocha */

import assert from 'assert'

import {
  getDateInput,
  getDurationLabel,
  getServiceLightLabel,
  isAuthorValid,
  isPatientValid,
  isPreferredServicesValid,
  isServicePriceValid,
  isTherapistValid
} from '../src/js/utils'

describe('utils', () => {
  describe('#getServiceLightLabel()', () => {
    it('should return the service light label from a given existent service code', () => {
      assert.equal(getServiceLightLabel(1003), 'Acupressure')
    })
    it('should return an empty string from a given nonexistent service code', () => {
      assert.equal(getServiceLightLabel(1), '')
    })
  })

  describe('#getDurationLabel()', () => {
    it('should turn a duration in minutes into a human formatted duration', () => {
      assert.equal(getDurationLabel(5), '5\'')
      assert.equal(getDurationLabel(60), '1h')
      assert.equal(getDurationLabel(65), '1h5')
    })
  })

  describe('#isAuthorValid()', () => {
    const author = {
      name: 'Cabinet de Gordan',
      street: '92320 Glacier Hill Terrace',
      ZIP: '735538',
      city: 'San Antonio',
      email: 'gaery0@over-blog.com',
      phone: '5164459701',
      IBAN: '1234567890123456789',
      RCC: 'V123123'
    }

    it('should validate a valid author object', () => {
      assert.equal(isAuthorValid(author), true)
      assert.equal(isAuthorValid({ ...author, email: 'gaery0@over-blog' }), true)
      assert.equal(isAuthorValid({ ...author, email: 'gaery0@over-blog.' }), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isAuthorValid({}), false)
    })
    it('should invalidate an author object with an empty name', () => {
      assert.equal(isAuthorValid({ ...author, name: '' }), false)
    })
    it('should invalidate an author object with a too long name', () => {
      assert.equal(
        isAuthorValid({
          ...author,
          name: 'Cabinet de Gordan Cabinet de Gordan Cabinet de Gordan Cabinet de Gordan'
        }),
        false
      )
    })
    it('should invalidate an author object with an empty street', () => {
      assert.equal(isAuthorValid({ ...author, street: '' }), false)
    })
    it('should invalidate an author object with a too long street', () => {
      assert.equal(
        isAuthorValid({
          ...author,
          street: '92320 Glacier Hill Terrace 92320 Glacier Hill Terrace 92320 Glacier Hill Terrace'
        }),
        false
      )
    })
    it('should invalidate an author object with an empty post code', () => {
      assert.equal(isAuthorValid({ ...author, ZIP: '' }), false)
    })
    it('should invalidate an author object with a too long post code', () => {
      assert.equal(isAuthorValid({ ...author, ZIP: '735538 735538 735538' }), false)
    })
    it('should invalidate an author object with an empty city', () => {
      assert.equal(isAuthorValid({ ...author, city: '' }), false)
    })
    it('should invalidate an author object with a too long city', () => {
      assert.equal(
        isAuthorValid({ ...author, city: 'San Antonio San Antonio San Antonio San Antonio' }),
        false
      )
    })
    it('should invalidate an author object with an empty email', () => {
      assert.equal(isAuthorValid({ ...author, email: '' }), false)
    })
    it('should invalidate an author object with a wrongly formatted email', () => {
      assert.equal(isAuthorValid({ ...author, email: 'gaery0' }), false)
      assert.equal(isAuthorValid({ ...author, email: 'gaery0@' }), false)
    })
    it('should invalidate an author object with an empty phone number', () => {
      assert.equal(isAuthorValid({ ...author, phone: '' }), false)
    })
    it('should invalidate an author object with an empty IBAN number', () => {
      assert.equal(isAuthorValid({ ...author, IBAN: '' }), false)
    })
    it('should invalidate an author object with a wrongly formatted IBAN number', () => {
      assert.equal(isAuthorValid({ ...author, IBAN: '123456789012345678' }), false)
      assert.equal(isAuthorValid({ ...author, IBAN: '12345678901234567890' }), false)
      assert.equal(isAuthorValid({ ...author, IBAN: 'AAAAAAAAAAAAAAAAAAA' }), false)
    })
    it('should validate an author object with an empty RCC number', () => {
      assert.equal(isAuthorValid({ ...author, RCC: '' }), true)
    })
    it('should invalidate an author object with a wrongly formatted RCC number', () => {
      assert.equal(isAuthorValid({ ...author, RCC: 'V123' }), false)
      assert.equal(isAuthorValid({ ...author, RCC: '1231231' }), false)
      assert.equal(isAuthorValid({ ...author, RCC: 'VVVVVVV' }), false)
      assert.equal(isAuthorValid({ ...author, RCC: 'V1231231' }), false)
    })
  })

  describe('#isTherapistValid()', () => {
    const therapist = {
      firstName: 'Gordan',
      lastName: 'Aery',
      street: '92320 Glacier Hill Terrace',
      ZIP: '735538',
      city: 'San Antonio',
      phone: '5164459701',
      RCC: 'V123123'
    }

    it('should validate a valid therapist object', () => {
      assert.equal(isTherapistValid(therapist), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isTherapistValid({}), false)
    })
    it('should invalidate a therapist object with an empty first name', () => {
      assert.equal(isTherapistValid({ ...therapist, firstName: '' }), false)
    })
    it('should invalidate a therapist object with an empty last name', () => {
      assert.equal(isTherapistValid({ ...therapist, lastName: '' }), false)
    })
    it('should invalidate a therapist object with an empty street', () => {
      assert.equal(isTherapistValid({ ...therapist, street: '' }), false)
    })
    it('should invalidate a therapist object with an empty post code', () => {
      assert.equal(isTherapistValid({ ...therapist, ZIP: '' }), false)
    })
    it('should invalidate an therapist object with an empty city', () => {
      assert.equal(isTherapistValid({ ...therapist, city: '' }), false)
    })
    it('should invalidate a therapist object with an empty phone number', () => {
      assert.equal(isTherapistValid({ ...therapist, phone: '' }), false)
    })
    it('should validate a therapist object with an empty RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, RCC: '' }), true)
    })
    it('should invalidate a therapist object with a wrongly formatted RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, RCC: 'V123' }), false)
      assert.equal(isTherapistValid({ ...therapist, RCC: '1231231' }), false)
      assert.equal(isTherapistValid({ ...therapist, RCC: 'VVVVVVV' }), false)
      assert.equal(isTherapistValid({ ...therapist, RCC: 'V1231231' }), false)
    })
  })

  describe('#isServicePriceValid()', () => {
    it('should validate a strictly positive service price', () => {
      assert.equal(isServicePriceValid(10), true)
    })
    it('should invalidate a null service price', () => {
      assert.equal(isServicePriceValid(0), false)
    })
    it('should invalidate a negative service price', () => {
      assert.equal(isServicePriceValid(-10), false)
    })
  })

  describe('#isPreferredServicesValid()', () => {
    it('should validate a non-empty preferred service list with not only "Anamnèse"', () => {
      assert.equal(isPreferredServicesValid([{ code: 1003 }]), true)
      assert.equal(isPreferredServicesValid([{ code: 1003 }, { code: 1200 }]), true)
    })
    it('should invalidate an empty preferred service list', () => {
      assert.equal(isPreferredServicesValid([]), false)
    })
    it('should invalidate a preferred service list only containing "Anamnèse', () => {
      assert.equal(isPreferredServicesValid([{ code: 1200 }]), false)
    })
  })

  describe('#isPatientValid()', () => {
    const patient = {
      firstName: 'Gordan',
      lastName: 'Aery',
      street: '92320 Glacier Hill Terrace',
      ZIP: '735538',
      city: 'San Antonio',
      canton: 'GE',
      gender: 'male',
      email: 'gaery0@over-blog.com',
      birthday: Date.now(),
      id: Date.now()
    }

    it('should validate a valid patient object', () => {
      assert.equal(isPatientValid(patient), true)
      assert.equal(isPatientValid({ ...patient, gender: 'female' }), true)
      assert.equal(isPatientValid({ ...patient, canton: 'BE' }), true)
      assert.equal(isPatientValid({ ...patient, id: 0 }), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isPatientValid({}), false)
    })
    it('should invalidate a patient object with an empty first name', () => {
      assert.equal(isPatientValid({ ...patient, firstName: '' }), false)
    })
    it('should invalidate a patient object with a too long first name', () => {
      assert.equal(
        isPatientValid({ ...patient, firstName: 'Gordan Gordan Gordan Gordan Gordan Gordan' }),
        false
      )
    })
    it('should invalidate a patient object with an empty last name', () => {
      assert.equal(isPatientValid({ ...patient, lastName: '' }), false)
    })
    it('should invalidate a patient object with a too long last name', () => {
      assert.equal(
        isPatientValid({ ...patient, lastName: 'Aery Aery Aery Aery Aery Aery Aery Aery' }),
        false
      )
    })
    it('should invalidate a patient object with an empty street', () => {
      assert.equal(isPatientValid({ ...patient, street: '' }), false)
    })
    it('should invalidate a patient object with a too long street', () => {
      assert.equal(
        isPatientValid({
          ...patient,
          street: '92320 Glacier Hill Terrace 92320 Glacier Hill Terrace 92320 Glacier Hill Terrace'
        }),
        false
      )
    })
    it('should invalidate a patient object with an empty post code', () => {
      assert.equal(isPatientValid({ ...patient, ZIP: '' }), false)
    })
    it('should invalidate a patient object with a too long post code', () => {
      assert.equal(isPatientValid({ ...patient, ZIP: '735538 735538 735538' }), false)
    })
    it('should invalidate a patient object with an empty city', () => {
      assert.equal(isPatientValid({ ...patient, city: '' }), false)
    })
    it('should invalidate a patient object with a too long city', () => {
      assert.equal(
        isPatientValid({ ...patient, city: 'San Antonio San Antonio San Antonio San Antonio' }),
        false
      )
    })
    it('should invalidate a patient object with an empty canton', () => {
      assert.equal(isPatientValid({ ...patient, canton: '' }), false)
    })
    it('should invalidate a patient object with an unknown canton', () => {
      assert.equal(isPatientValid({ ...patient, canton: 'ZZ' }), false)
    })
    it('should invalidate a patient object with an empty gender', () => {
      assert.equal(isPatientValid({ ...patient, gender: '' }), false)
    })
    it('should invalidate a patient object with an wrong gender', () => {
      assert.equal(isPatientValid({ ...patient, gender: 'test' }), false)
    })
    it('should invalidate a patient object with a wrongly formatted email', () => {
      assert.equal(isPatientValid({ ...patient, email: 'gaery0' }), false)
      assert.equal(isPatientValid({ ...patient, email: 'gaery0@' }), false)
    })
    it('should invalidate a patient object with a missing birthday', () => {
      delete patient.birthday

      assert.equal(isPatientValid(patient), false)

      patient.birthday = Date.now()
    })
    it('should invalidate a patient object with a missing id', () => {
      delete patient.id

      assert.equal(isPatientValid(patient), false)

      patient.id = Date.now()
    })
  })

  describe('#getDateInput()', () => {
    it('should format a timestamp in an allowed date input', () => {
      assert.equal(getDateInput(1588603407152), '2020-05-04')
    })
  })
})
