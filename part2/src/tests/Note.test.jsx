import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from '../components/Note'
import { beforeEach, describe } from 'vitest'

describe('< Note/>', () => {
  let mockToggle, mockVote, mockDelete
  beforeEach(() => {
    const note = {
      content: 'Component testing is done with react-testing-library',
      important: true
    }

    mockToggle = vi.fn()
    mockVote = vi.fn()
    mockDelete = vi.fn()

    render(
      <Note
        note={note}
        toggleImportance={mockToggle}
        handleVotes={mockVote}
        handleDelete={mockDelete}
      />
    )
  })

  test('render content', async () => {
    const element = screen.getByText('Component testing is done with react-testing-library', { exact: false })

    screen.debug(element)

    expect(element).toBeDefined()
  })

  test('clicking the button switch important of a note', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('make not important')
    await user.click(button)
    await user.click(button)

    expect(mockToggle.mock.calls).toHaveLength(2)
  })

  test('clicking the like button, increase the vote', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByRole('button', { name: /👍/i })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockVote.mock.calls).toHaveLength(2)
  })

  test('clicking the Delete button calls the function', async () => {
    const user = userEvent.setup()
    const button = screen.getByRole('button', { name: /Delete/i })
    await user.click(button)

    expect(mockDelete.mock.calls).toHaveLength(1)
  })
})