import { render, screen } from '@testing-library/react';
import App from './App'

test('testing app', () => {
    render(<App />)
    const linkElement = screen.getByText(/No comments yet. Be the first to comment./i)
    expect(linkElement).toBeInTheDocument
})