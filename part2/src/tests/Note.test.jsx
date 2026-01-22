import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from '../components/Note'
import { beforeEach, describe } from 'vitest'

describe('< Note/>', () => {
  let mockHandler
  beforeEach(() => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

    mockHandler = vi.fn()
    render(<Note note={note} toggleImportance={mockHandler} />)
  })

  test('render content', async () => {

    const element = screen.getByText('Component testing is done with react-testing-library', { exact: false })

    screen.debug(element)

    expect(element).toBeDefined()
  })

  test('clicking the button cals event handler once', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('make not important')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
  })
})