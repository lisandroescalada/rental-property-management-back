import { Dni } from './dni.vo'
import { InvalidDniException } from '../excepcions/invalid-dni.exception'

describe('DNI Value Object', () => {
  
  describe('create()', () => {
    
    it('should create a valid DNI', () => {
      const dni = Dni.create('12345678A')
      
      expect(dni).toBeDefined()
      expect(dni.value).toBe('12345678A')
    })

    it('should accept various DNI formats', () => {
      const dnis = [
        '12345678A',
        '87654321B',
        '00000000Z',
        '99999999Y'
      ]

      dnis.forEach(dniStr => {
        const dni = Dni.create(dniStr)
        expect(dni.value).toBe(dniStr)
      })
    })

    it('should throw InvalidDniException when DNI is empty', () => {
      expect(() => Dni.create('')).toThrow(InvalidDniException)
    })

    it('should throw InvalidDniException when DNI is only whitespace', () => {
      expect(() => Dni.create('   ')).toThrow(InvalidDniException)
      expect(() => Dni.create('\t')).toThrow(InvalidDniException)
    })
  })
})
