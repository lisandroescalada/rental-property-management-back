import { Phone } from './phone.vo'
import { InvalidPhoneException } from '../excepcions/invalid-phone.exception'

describe('Phone Value Object', () => {
  
  describe('create()', () => {
    
    it('should create a valid phone', () => {
      const phone = Phone.create('+34 600 123 456')
      
      expect(phone).toBeDefined()
      expect(phone.value).toBe('+34 600 123 456')
    })

    it('should accept different phone formats', () => {
      const phones = [
        '+34600123456',
        '600123456',
        '+34 (600) 123-456',
        '00346001234567'
      ]

      phones.forEach(phoneStr => {
        const phone = Phone.create(phoneStr)
        expect(phone.value).toBe(phoneStr)
      })
    })

    it('should throw InvalidPhoneException when phone is empty', () => {
      expect(() => Phone.create('')).toThrow(InvalidPhoneException)
    })

    it('should throw InvalidPhoneException when phone is only whitespace', () => {
      expect(() => Phone.create('   ')).toThrow(InvalidPhoneException)
      expect(() => Phone.create('\t')).toThrow(InvalidPhoneException)
    })
  })
})
