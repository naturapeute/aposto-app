/* eslint-env mocha */

import assert from 'assert'

import {
  getDateInput,
  getDurationLabel,
  getServiceLightLabel,
  isAuthorValid,
  isIBANValid,
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
      zipcode: '735538',
      city: 'San Antonio',
      email: 'gaery0@over-blog.com',
      phone: '5164459701',
      iban: '5131234567890123456',
      rcc: 'V123123'
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
      assert.equal(isAuthorValid({ ...author, zipcode: '' }), false)
    })
    it('should invalidate an author object with a too long post code', () => {
      assert.equal(isAuthorValid({ ...author, zipcode: '735538 735538 735538' }), false)
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
      assert.equal(isAuthorValid({ ...author, iban: '' }), false)
    })
    it('should invalidate an author object with a wrongly formatted IBAN number', () => {
      assert.equal(isAuthorValid({ ...author, iban: '123456789012345678' }), false)
      assert.equal(isAuthorValid({ ...author, iban: '12345678901234567890' }), false)
      assert.equal(isAuthorValid({ ...author, iban: 'AAAAAAAAAAAAAAAAAAA' }), false)
    })
    // TODO
    xit('should invalidate an author object with a wrong IBAN checksum', () => {
      assert.equal(isAuthorValid({ ...author, iban: '1234567890123456789' }), false)
    })
    it('should validate an author object with an empty RCC number', () => {
      assert.equal(isAuthorValid({ ...author, rcc: '' }), true)
    })
    it('should invalidate an author object with a wrongly formatted rcc number', () => {
      assert.equal(isAuthorValid({ ...author, rcc: 'V123' }), false)
      assert.equal(isAuthorValid({ ...author, rcc: '1231231' }), false)
      assert.equal(isAuthorValid({ ...author, rcc: 'VVVVVVV' }), false)
      assert.equal(isAuthorValid({ ...author, rcc: 'V1231231' }), false)
    })
  })

  describe('#isTherapistValid()', () => {
    const therapist = {
      firstname: 'Gordan',
      lastname: 'Aery',
      street: '92320 Glacier Hill Terrace',
      zipcode: '735538',
      city: 'San Antonio',
      phone: '5164459701',
      rcc: 'V123123'
    }

    it('should validate a valid therapist object', () => {
      assert.equal(isTherapistValid(therapist), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isTherapistValid({}), false)
    })
    it('should invalidate a therapist object with an empty first name', () => {
      assert.equal(isTherapistValid({ ...therapist, firstname: '' }), false)
    })
    it('should invalidate a therapist object with an empty last name', () => {
      assert.equal(isTherapistValid({ ...therapist, lastname: '' }), false)
    })
    it('should invalidate a therapist object with an empty street', () => {
      assert.equal(isTherapistValid({ ...therapist, street: '' }), false)
    })
    it('should invalidate a therapist object with an empty post code', () => {
      assert.equal(isTherapistValid({ ...therapist, zipcode: '' }), false)
    })
    it('should invalidate an therapist object with an empty city', () => {
      assert.equal(isTherapistValid({ ...therapist, city: '' }), false)
    })
    it('should invalidate a therapist object with an empty phone number', () => {
      assert.equal(isTherapistValid({ ...therapist, phone: '' }), false)
    })
    it('should validate a therapist object with an empty RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, rcc: '' }), true)
    })
    it('should invalidate a therapist object with a wrongly formatted RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, rcc: 'V123' }), false)
      assert.equal(isTherapistValid({ ...therapist, rcc: '1231231' }), false)
      assert.equal(isTherapistValid({ ...therapist, rcc: 'VVVVVVV' }), false)
      assert.equal(isTherapistValid({ ...therapist, rcc: 'V1231231' }), false)
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

  describe('#isIBANValid()', () => {
    it('should match a valid Swiss IBAN', () => {
      assert.strictEqual(isIBANValid('CH100023000A109822346'), true)
      assert.strictEqual(isIBANValid('CH100023000A10982234'), false, 'must be 21 chars')
      assert.strictEqual(isIBANValid('CH1X0023000A109822346'), false, 'control digit must be 2 digits')
      assert.strictEqual(isIBANValid('CH1000X3000A109822346'), false, 'Bank Clearing must be 5 digits')
      assert.strictEqual(isIBANValid('CH100023000A109-82234'), false, 'Account Number must be numbers and letters')
      // TODO
      // assert.strictEqual(isIBANValid('CH100023000A109822344'), false, "Account number must with validation code")
    })
  })

  describe('#isPatientValid()', () => {
    const patient = {
      id: 3,
      firstname: 'Gordan',
      lastname: 'Aery',
      street: '92320 Glacier Hill Terrace',
      zipcode: '735538',
      city: 'San Antonio',
      canton: 'GE',
      gender: 'man',
      email: 'gaery0@over-blog.com',
      birthdate: Date.now()
    }

    it('should validate a valid patient object', () => {
      assert.equal(isPatientValid(patient), true)
      assert.equal(isPatientValid({ ...patient, gender: 'woman' }), true)
      assert.equal(isPatientValid({ ...patient, canton: 'BE' }), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isPatientValid({}), false)
    })
    it('should invalidate a patient object with an empty first name', () => {
      assert.equal(isPatientValid({ ...patient, firstname: '' }), false)
    })
    it('should invalidate a patient object with a too long first name', () => {
      assert.equal(
        isPatientValid({ ...patient, firstname: 'Gordan Gordan Gordan Gordan Gordan Gordan' }),
        false
      )
    })
    it('should invalidate a patient object with an empty last name', () => {
      assert.equal(isPatientValid({ ...patient, lastname: '' }), false)
    })
    it('should invalidate a patient object with a too long last name', () => {
      assert.equal(
        isPatientValid({ ...patient, lastname: 'Aery Aery Aery Aery Aery Aery Aery Aery' }),
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
      assert.equal(isPatientValid({ ...patient, zipcode: '' }), false)
    })
    it('should invalidate a patient object with a too long post code', () => {
      assert.equal(isPatientValid({ ...patient, zipcode: '735538 735538 735538' }), false)
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
    it('should invalidate a patient object with a missing birthdate', () => {
      delete patient.birthdate

      assert.equal(isPatientValid(patient), false)

      patient.birthdate = Date.now()
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
