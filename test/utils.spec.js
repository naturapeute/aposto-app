/* eslint-env mocha */

import assert from 'assert'

import {
  getDateInput,
  getDurationLabel,
  getServiceLightLabel,
  isAuthorValid,
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
      RCC: 'V123123',
      GLN: '2000000000008'
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
    it('should invalidate an author object with an empty street', () => {
      assert.equal(isAuthorValid({ ...author, street: '' }), false)
    })
    it('should invalidate an author object with an empty post code', () => {
      assert.equal(isAuthorValid({ ...author, ZIP: '' }), false)
    })
    it('should invalidate an author object with an empty city', () => {
      assert.equal(isAuthorValid({ ...author, city: '' }), false)
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
    it('should invalidate an author object with an empty RCC number', () => {
      assert.equal(isAuthorValid({ ...author, RCC: '' }), false)
    })
    it('should invalidate an author object with a wrongly formatted RCC number', () => {
      assert.equal(isAuthorValid({ ...author, RCC: 'V123' }), false)
      assert.equal(isAuthorValid({ ...author, RCC: '1231231' }), false)
      assert.equal(isAuthorValid({ ...author, RCC: 'VVVVVVV' }), false)
    })
    it('should invalidate an author object with an empty GLN number', () => {
      assert.equal(isAuthorValid({ ...author, GLN: '' }), false)
    })
    it('should invalidate an author object with a wrongly formatted GLN number', () => {
      assert.equal(isAuthorValid({ ...author, GLN: '2' }), false)
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
      RCC: 'V123123',
      GLN: '2000000000008'
    }

    it('should validate a valid therapist object', () => {
      assert.equal(isTherapistValid(therapist), true)
    })
    it('should invalidate an empty object', () => {
      assert.equal(isTherapistValid({}), false)
    })
    it('should invalidate an therapist object with an empty first name', () => {
      assert.equal(isTherapistValid({ ...therapist, firstName: '' }), false)
    })
    it('should invalidate an therapist object with an empty last name', () => {
      assert.equal(isTherapistValid({ ...therapist, lastName: '' }), false)
    })
    it('should invalidate an therapist object with an empty street', () => {
      assert.equal(isTherapistValid({ ...therapist, street: '' }), false)
    })
    it('should invalidate an therapist object with an empty post code', () => {
      assert.equal(isTherapistValid({ ...therapist, ZIP: '' }), false)
    })
    it('should invalidate an therapist object with an empty city', () => {
      assert.equal(isTherapistValid({ ...therapist, city: '' }), false)
    })
    it('should invalidate an therapist object with an empty phone number', () => {
      assert.equal(isTherapistValid({ ...therapist, phone: '' }), false)
    })
    it('should invalidate an therapist object with an empty RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, RCC: '' }), false)
    })
    it('should invalidate an therapist object with a wrongly formatted RCC number', () => {
      assert.equal(isTherapistValid({ ...therapist, RCC: 'V123' }), false)
      assert.equal(isTherapistValid({ ...therapist, RCC: '1231231' }), false)
      assert.equal(isTherapistValid({ ...therapist, RCC: 'VVVVVVV' }), false)
    })
    it('should invalidate an therapist object with an empty GLN number', () => {
      assert.equal(isTherapistValid({ ...therapist, GLN: '' }), false)
    })
    it('should invalidate an therapist object with a wrongly formatted GLN number', () => {
      assert.equal(isTherapistValid({ ...therapist, GLN: '2' }), false)
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

  describe('#getDateInput()', () => {
    it('should format a timestamp in an allowed date input', () => {
      assert.equal(getDateInput(1588603407152), '2020-05-04')
    })
  })
})
