import { Birthdate } from './birthdate.vo'
import { InvalidBirthdateException } from '../excepcions/invalid-birthdate.exception'

describe('Birthdate Value Object', () => {
  
  describe('create()', () => {
    
    it('should create a valid birthdate', () => {
      const birthdate = Birthdate.create('1990-05-15')
      
      expect(birthdate).toBeDefined()
      expect(birthdate.value).toBe('1990-05-15')
    })

    it('should accept different date formats', () => {
      const dates = [
        '1990-05-15',
        '1985-01-01',
        '2000-12-31'
      ]

      dates.forEach(date => {
        const birthdate = Birthdate.create(date)
        expect(birthdate.value).toBe(date)
      })
    })

    it('should throw InvalidBirthdateException when birthdate is empty', () => {
      expect(() => Birthdate.create('')).toThrow(InvalidBirthdateException)
    })

    it('should throw InvalidBirthdateException when birthdate is only whitespace', () => {
      expect(() => Birthdate.create('   ')).toThrow(InvalidBirthdateException)
      expect(() => Birthdate.create('\t')).toThrow(InvalidBirthdateException)
    })
  })
})
