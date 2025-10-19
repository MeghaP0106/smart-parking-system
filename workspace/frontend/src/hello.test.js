const { render, screen } = require('@testing-library/react');
const Hello = require('./Hello'); // Adjust the import based on your component's location

test('renders hello world', () => {
	render(<Hello />);
	const linkElement = screen.getByText(/hello world/i);
	expect(linkElement).toBeInTheDocument();
});