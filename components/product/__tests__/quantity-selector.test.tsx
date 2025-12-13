import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { QuantitySelector } from '../quantity-selector'

describe('QuantitySelector', () => {
  it('should render with default quantity', () => {
    render(<QuantitySelector />)

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should render with initial quantity', () => {
    render(<QuantitySelector initialQuantity={5} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should increase quantity when plus button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuantitySelector initialQuantity={1} />)

    const plusButton = screen.getAllByRole('button')[1] // Second button is plus
    await user.click(plusButton)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should decrease quantity when minus button is clicked', async () => {
    const user = userEvent.setup()
    render(<QuantitySelector initialQuantity={3} />)

    const minusButton = screen.getAllByRole('button')[0] // First button is minus
    await user.click(minusButton)

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('should not decrease below minimum', async () => {
    const user = userEvent.setup()
    render(<QuantitySelector initialQuantity={1} min={1} />)

    const minusButton = screen.getAllByRole('button')[0]

    expect(minusButton).toBeDisabled()
    await user.click(minusButton)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should not increase above maximum', () => {
    render(<QuantitySelector initialQuantity={10} max={10} />)

    const plusButton = screen.getAllByRole('button')[1]

    expect(plusButton).toBeDisabled()
  })

  it('should call onChange when quantity changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<QuantitySelector initialQuantity={5} onChange={onChange} />)

    const plusButton = screen.getAllByRole('button')[1]
    await user.click(plusButton)

    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('should call onChange when decreasing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<QuantitySelector initialQuantity={5} onChange={onChange} />)

    const minusButton = screen.getAllByRole('button')[0]
    await user.click(minusButton)

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('should respect custom min/max values', async () => {
    const user = userEvent.setup()
    render(<QuantitySelector initialQuantity={5} min={2} max={8} />)

    const minusButton = screen.getAllByRole('button')[0]
    const plusButton = screen.getAllByRole('button')[1]

    // Decrease to min
    await user.click(minusButton) // 4
    await user.click(minusButton) // 3
    await user.click(minusButton) // 2
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(minusButton).toBeDisabled()

    // Increase to max
    await user.click(plusButton) // 3
    await user.click(plusButton) // 4
    await user.click(plusButton) // 5
    await user.click(plusButton) // 6
    await user.click(plusButton) // 7
    await user.click(plusButton) // 8
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(plusButton).toBeDisabled()
  })
})
