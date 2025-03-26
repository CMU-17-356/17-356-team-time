import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { ProfileInterests, ResearchInterestProps } from '../src/components/ProfileInterests'; // Adjust import path as needed

// Helper function to create a test component with default props
const createTestComponent = (overrideProps: Partial<ResearchInterestProps> = {}) => {
  const defaultProps: ResearchInterestProps = {
    fieldOfInterest: '',
    isEditing: false,
    onSubmit: jest.fn(),
  };

  const props = { ...defaultProps, ...overrideProps };
  return render(<ProfileInterests {...props} />);
};

describe('ProfileInterests Component', () => {
  // Rendering Tests
  describe('Rendering', () => {
    test('renders correctly in non-editing mode with no interests', () => {
      createTestComponent();
      expect(screen.getByText('No research interests specified.')).toBeDefined();
    });

    test('renders correctly in non-editing mode with interests', () => {
      createTestComponent({ 
        fieldOfInterest: 'Machine Learning,Data Science' 
      });
      expect(screen.getByText('Machine Learning')).toBeDefined();
      expect(screen.getByText('Data Science')).toBeDefined();
    });

    test('renders editing mode with input field', () => {
      createTestComponent({ 
        isEditing: true 
      });
      expect(screen.getByPlaceholderText('Add interests (comma-separated)')).toBeDefined();
      expect(screen.getByText('Add')).toBeDefined();
    });
  });

  // Interaction Tests
  describe('Interaction', () => {
    test('adds new interest in editing mode', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit,
        fieldOfInterest: 'Existing Interest' 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Add a new interest
      fireEvent.change(input, { target: { value: 'New Interest' } });
      fireEvent.click(addButton);

      // Check if onSubmit was called with correct value
      expect(mockOnSubmit).toHaveBeenCalledWith('Existing Interest,New Interest');
    });

    test('adds multiple interests via comma separation', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Add multiple interests
      fireEvent.change(input, { target: { value: 'Interest1, Interest2, Interest3' } });
      fireEvent.click(addButton);

      // Check if onSubmit was called with correct value
      expect(mockOnSubmit).toHaveBeenCalledWith('Interest1,Interest2,Interest3');
    });

    test('removes an interest', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit,
        fieldOfInterest: 'Interest1,Interest2,Interest3' 
      });

      // Find and click remove button for second interest
      const removeButtons = screen.getAllByRole('button', { name: '' }); // X buttons
      fireEvent.click(removeButtons[1]);

      // Check if onSubmit was called with correct value
      expect(screen.getByText('Interest1')).toBeDefined();
      expect(screen.queryByText('Interest2')).toBeNull();
      expect(screen.getByText('Interest3')).toBeDefined();
    });

    test('adds interest via Enter key', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');

      // Simulate typing and pressing Enter
      fireEvent.change(input, { target: { value: 'New Interest' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      // Check if onSubmit was called with correct value
      expect(mockOnSubmit).toHaveBeenCalledWith('New Interest');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('does not add empty interest', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Try to add empty interest
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(addButton);

      // Ensure onSubmit was not called
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('trims whitespace from interests', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Add interests with extra whitespace
      fireEvent.change(input, { target: { value: '  Interest1  ,  Interest2  ' } });
      fireEvent.click(addButton);

      // Check if onSubmit was called with trimmed interests
      expect(mockOnSubmit).toHaveBeenCalledWith('Interest1,Interest2');
    });

    test('handles initial empty string', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        fieldOfInterest: '',
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Add first interest
      fireEvent.change(input, { target: { value: 'First Interest' } });
      fireEvent.click(addButton);

      // Check if onSubmit was called with the first interest
      expect(mockOnSubmit).toHaveBeenCalledWith('First Interest');
    });

    test('prevents duplicate interests', () => {
      const mockOnSubmit = jest.fn();
      createTestComponent({ 
        isEditing: true,
        fieldOfInterest: 'Existing Interest',
        onSubmit: mockOnSubmit 
      });

      const input = screen.getByPlaceholderText('Add interests (comma-separated)');
      const addButton = screen.getByText('Add');

      // Try to add duplicate interest
      fireEvent.change(input, { target: { value: 'Existing Interest' } });
      fireEvent.click(addButton);

      // Ensure no duplicate is added
      expect(mockOnSubmit).toHaveBeenCalledWith('Existing Interest');
    });
  });
});