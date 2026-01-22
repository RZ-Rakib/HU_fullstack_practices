import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NoteForm from '../components/NoteForm'

describe('<NoteFrom />', () => {
  test('update parent state and calls onSubmit', async () => {
    const createNote = vi.fn()
    const user = userEvent.setup()

    render(<NoteForm createNote={createNote} />)

    const input = screen.getByRole('textbox')
    const button = screen.getByText('save')

    await user.type(input, 'testing a form...')
    await user.click(button)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')


  })
})