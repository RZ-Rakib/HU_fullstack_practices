import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggleable from '../components/Togglable'
import { beforeEach } from 'vitest'

describe('<Toggleable />', () => {
  beforeEach(() => {
    render(
      <Toggleable buttonLabel={'show...'} >
        <div>Toggleable content</div>
      </Toggleable>
    )
  })

  test('renders its children', async () => {
    screen.getByText('Toggleable content')
  })

  test('at start the children is not visible', async () => {
    const element = screen.getByText('Toggleable content')
    expect(element).not.toBeVisible()
  })

  test('after clicking show button, the children is visible', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const element = screen.getByText('Toggleable content')
    expect(element).toBeVisible()
  })

  test('toggleable content can be closed by clicking cancel button', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show...')
    await user.click(showButton)

    const cancelButton = screen.getByText('cancel')
    await user.click(cancelButton)

    const element = screen.getByText('Toggleable content')
    expect(element).not.toBeVisible()
  })
})