import { Observations } from './observations.vo'
import { InvalidObservationsException } from '../excepcions/invalid-observations.exception'

describe('Observations Value Object', () => {
  
  describe('create()', () => {
    
    it('should create valid observations', () => {
      const obs = Observations.create('Cliente frecuente')
      
      expect(obs).toBeDefined()
      expect(obs.value).toBe('Cliente frecuente')
    })

    it('should accept long text', () => {
      const longText = 'Este es un cliente muy especial con muchas observaciones importantes que deben ser registradas en el sistema'
      const obs = Observations.create(longText)
      
      expect(obs.value).toBe(longText)
    })

    it('should accept empty string treated as whitespace', () => {
      // Nota: Las observaciones son opcionales en create de Tenant
      // pero aquí creamos con string vacío para validar el VO
      expect(() => Observations.create('')).toThrow(InvalidObservationsException)
    })

    it('should throw InvalidObservationsException when only whitespace', () => {
      expect(() => Observations.create('   ')).toThrow(InvalidObservationsException)
      expect(() => Observations.create('\t')).toThrow(InvalidObservationsException)
    })

    it('should preserve text with special characters', () => {
      const text = 'Observación: Cliente con mascotas (gato y perro) - No contactar después de 20h'
      const obs = Observations.create(text)
      
      expect(obs.value).toBe(text)
    })
  })
})
