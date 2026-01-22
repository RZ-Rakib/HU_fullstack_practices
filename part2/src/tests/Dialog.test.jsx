import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dialog from '../components/Dialog'

describe('<Dialog />', () => {
  test('renders nothing when open is false', async () => {
    const { container } = render(
      <Dialog
        open={false}
        text='do u want to delete?'
        handleYes={() => { }}
        handleNo={() => { }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  test('renders text and buttons when open is true', async () => {
    render(
      <Dialog
        open={true}
        text='do u want to delete?'
        handleYes={() => { }}
        handleNo={() => { }}
      />
    )

    const element = screen.getByText('do u want to delete?')
    const yesButton = screen.getByRole('button', { name: /yes/i })
    const noButton = screen.getByRole('button', { name: /no/i })

    expect(element).toBeInTheDocument()
    expect(yesButton).toBeInTheDocument()
    expect(noButton).toBeInTheDocument()
  })

  test('clicking yes calls handleYes', async () => {
    const user = userEvent.setup()
    const mockYes = vi.fn()
    const mockNo = vi.fn()

    render(
      <Dialog
        open={true}
        text='do u want to delete?'
        handleYes={mockYes}
        handleNo={mockNo}
      />
    )

    const yesButton = screen.getByRole('button', { name: /yes/i })
    await user.click(yesButton)

    expect(mockYes).toHaveBeenCalledTimes(1)
    expect(mockNo).toHaveBeenCalledTimes(0)
  })

  test('clicking no calls handleNo', async () => {
    const user = userEvent.setup()
    const mockYes = vi.fn()
    const mockNo = vi.fn()

    render(
      <Dialog
        open={true}
        text='do u want to delete?'
        handleYes={mockYes}
        handleNo={mockNo}
      />
    )

    const noButton = screen.getByRole('button', { name: /no/i })
    await user.click(noButton)

    expect(mockYes).toHaveBeenCalledTimes(0)
    expect(mockNo).toHaveBeenCalledTimes(1)
  })
})