import { Name } from './name.vo'
import { InvalidNameException } from '../excepcions/invalid-name.exception'

/**
 * TESTS UNITARIOS PARA NAME VALUE OBJECT
 * 
 * Value Objects:
 * - Son objetos que representan valores en tu dominio
 * - Encapsulan validaciones del negocio
 * - Son inmutables
 * - Se comparan por valor, no por identidad
 */
describe('Name Value Object', () => {
  
  describe('create()', () => {
    
    it('should create a valid name', () => {
      const name = Name.create('Juan López')
      
      expect(name).toBeDefined()
      expect(name.value).toBe('Juan López')
    })

    it('should create name with special characters', () => {
      const name = Name.create('María José García-Martínez')
      
      expect(name.value).toBe('María José García-Martínez')
    })

    it('should throw InvalidNameException when name is empty', () => {
      expect(() => Name.create('')).toThrow(InvalidNameException)
    })

    it('should throw InvalidNameException when name is only whitespace', () => {
      expect(() => Name.create('   ')).toThrow(InvalidNameException)
      expect(() => Name.create('\t')).toThrow(InvalidNameException)
      expect(() => Name.create('\n')).toThrow(InvalidNameException)
    })

    it('should preserve name with leading/trailing spaces after validation', () => {
      // Nota: La validación usa .trim() para validar, pero no modifica el valor
      const name = Name.create('  Juan López  ')
      
      expect(name.value).toBe('  Juan López  ')
    })
  })
})
