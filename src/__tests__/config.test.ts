import { describe, it, expect } from 'vitest'
import { TEMPLATES, findTemplate, getTemplateNames } from '../config'

describe('templates config', () => {
  describe('TEMPLATES', () => {
    it('should have at least one template', () => {
      expect(TEMPLATES.length).toBeGreaterThan(0)
    })

    it('each template should have required fields', () => {
      TEMPLATES.forEach((template) => {
        expect(template.name).toBeTruthy()
        expect(template.display).toBeTruthy()
        expect(template.description).toBeTruthy()
        expect(template.repo).toBeTruthy()
        expect(typeof template.color).toBe('function')
      })
    })

    it('each template repo should start with github:', () => {
      TEMPLATES.forEach((template) => {
        expect(template.repo).toMatch(/^github:/)
      })
    })

    it('template names should be unique', () => {
      const names = TEMPLATES.map((t) => t.name)
      const uniqueNames = new Set(names)
      expect(uniqueNames.size).toBe(names.length)
    })
  })

  describe('findTemplate', () => {
    it('should find existing template by name', () => {
      const template = findTemplate('react-pc')
      expect(template).toBeDefined()
      expect(template?.name).toBe('react-pc')
    })

    it('should return undefined for non-existent template', () => {
      const template = findTemplate('non-existent')
      expect(template).toBeUndefined()
    })
  })

  describe('getTemplateNames', () => {
    it('should return all template names', () => {
      const names = getTemplateNames()
      expect(names).toContain('react-pc')
      expect(names).toContain('express')
      expect(names).toContain('electron')
    })

    it('should return same count as TEMPLATES', () => {
      const names = getTemplateNames()
      expect(names.length).toBe(TEMPLATES.length)
    })
  })
})
