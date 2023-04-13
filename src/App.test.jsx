import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { add } from './App';
import App from './App';
import { render, screen, fireEvent } from '@testing-library/react';

// here is describe, which test suit, which consist of 'it' test cases
describe('something truthy of falsy', () => {
	it('true to be true', () => {
		expect(true).toBe(true);
	});
	// afterEach(() => {
	// 	cleanup();
	// });
	it('checking functionality', () => {
		expect(add(2, 9)).toBe(11);
	});
	it('render App component', () => {
		render(<App />);
		screen.debug();
	});

	it('checking for text', () => {
		render(<App />);
		const message = screen.queryByText(/BTC/i);
		expect(message).toBeVisible();
		//expect(screen.getByText(/BTC/)).toBeInTheDocument();
	});
	it('checking for text', () => {
		render(<App />);
		screen.getByText(' ');
		expect(screen.getByText(' ')).toBeInTheDocument();
	});
	it('clicking button', () => {
		const handleRemoveItem = vi.fn();
		render(<App onRemoveItem={handleRemoveItem} />);
		fireEvent.click(screen.getByRole('Select Currency:'));
		expect(handleRemoveItem).toHaveBeenCalledTimes(1);
	});
});
