import { screen, render } from '@testing-library/react'
import Footer from '../components/Footer'

test('<Footer /> renders the message', async () => {
  render(<Footer />)

  const element = screen.getByText('Note app, Department of Computer Science, University of Helsinki 2025')

  expect(element).toBeInTheDocument()
})