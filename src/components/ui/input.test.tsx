import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Input } from '@/components/ui/input'

afterEach(() => {
  cleanup()
})

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render an input element', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should render with default styling', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('flex')
      expect(input).toHaveClass('h-9')
    })

    it('should accept custom className', () => {
      render(<Input className="custom-input" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('custom-input')
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
    })

    it('should render with default value', () => {
      render(<Input defaultValue="Initial value" />)
      const input = screen.getByDisplayValue('Initial value')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Types', () => {
    it('should render text input by default', () => {
      render(<Input type="text" />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render email input', () => {
      render(<Input type="email" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should render password input', () => {
      render(<Input type="password" />)
      const input = document.querySelector('input[type="password"]') as HTMLInputElement
      expect(input).not.toBeNull()
      expect(input?.type).toBe('password')
    })

    it('should render number input', () => {
      render(<Input type="number" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
    })

    it('should render tel input', () => {
      render(<Input type="tel" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'tel')
    })
  })

  describe('Interactions', () => {
    it('should handle value changes', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'New value' } })
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('should display entered value', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      
      fireEvent.change(input, { target: { value: 'Typed value' } })
      expect(input).toHaveValue('Typed value')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is passed', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('should be readonly when readOnly prop is passed', () => {
      render(<Input readOnly />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('readOnly')
    })

    it('should accept disabled prop', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should accept required prop', () => {
      render(<Input required />)
      expect(screen.getByRole('textbox')).toHaveAttribute('required')
    })

    it('should accept maxLength prop', () => {
      render(<Input maxLength={10} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10')
    })
  })

  describe('Accessibility', () => {
    it('should support id prop', () => {
      render(<Input id="test-input" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input')
    })

    it('should support aria-label', () => {
      render(<Input aria-label="Search input" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Search input')
    })

    it('should support aria-describedby', () => {
      render(<Input aria-describedby="description" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'description')
    })
  })

  describe('Forwarding', () => {
    it('should forward ref', () => {
      const ref = { current: null }
      render(<Input ref={ref} />)
      expect(ref.current).not.toBeNull()
    })
  })
})
