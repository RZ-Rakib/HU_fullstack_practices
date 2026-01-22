import { screen, render } from '@testing-library/react'
import Notification from '../components/Notification'

describe('<Notification />', () => {
  test('renders nothing when message is null', async () => {
    const { container } = render(
      <Notification message={null} />
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('renders the provided message', async () => {
    render(
      <Notification message={'Hello from Finland'} />
    )

    const element = screen.getByText('Hello from Finland')

    expect(element).toHaveTextContent('Hello from Finland')
  })
})