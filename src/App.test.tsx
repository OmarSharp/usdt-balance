import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';
import Web3 from 'web3';

jest.mock('web3', () => {
  throw new Error('Unable to import Web3');
});

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays error message when Web3 import fails', () => {
    render(<App />);
    expect(screen.getByText('Error: Unable to load Web3')).toBeInTheDocument();
  });
});

jest.mock('web3', () => {
  const mockEth = {
    getBlockNumber: jest.fn(),
    getBalance: jest.fn(),
    Contract: jest.fn()
  };

  const mockWeb3 = {
    eth: mockEth,
    providers: {
      HttpProvider: jest.fn(),
    },
  };

  return jest.fn(() => mockWeb3);
});

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<App />);
    expect(screen.getByText('Last Block Number:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter address')).toBeInTheDocument();
    expect(screen.getByText('Fetch USDT Balance')).toBeInTheDocument();
  });

  test('fetches last block number on mount', async () => {
    (Web3 as any).eth.getBlockNumber.mockResolvedValueOnce('12345');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Last Block Number: 12345')).toBeInTheDocument();
    });
  });

  test('fetches USDT balance when button is clicked', async () => {
    (Web3 as any).eth.getBalance.mockResolvedValueOnce('1000000000000000000');

    render(<App />);

    const addressInput = screen.getByPlaceholderText('Enter address');
    const fetchButton = screen.getByText('Fetch USDT Balance');

    fireEvent.change(addressInput, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } });
    fireEvent.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText('USDT Balance: 1000000000000000000')).toBeInTheDocument();
    });
  });

    // Add more test cases as needed

  describe('App component', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('displays error message when Web3 import fails', () => {
      render(<App />);
      expect(screen.getByText('Error: Unable to load Web3')).toBeInTheDocument();
    });
  
    test('displays error message for invalid address input', () => {
      render(<App />);
      const addressInput = screen.getByPlaceholderText('Enter address');
      const fetchButton = screen.getByText('Fetch USDT Balance');
  
      fireEvent.change(addressInput, { target: { value: 'invalid-address' } });
      fireEvent.click(fetchButton);
  
      expect(screen.getByText('Error: Invalid address')).toBeInTheDocument();
    });
  
    test('displays network error message when fetching balance fails', async () => {
      (Web3 as any).eth.getBalance.mockRejectedValueOnce(new Error('Network error'));
  
      render(<App />);
  
      const addressInput = screen.getByPlaceholderText('Enter address');
      const fetchButton = screen.getByText('Fetch USDT Balance');
  
      fireEvent.change(addressInput, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } });
      fireEvent.click(fetchButton);
  
      await waitFor(() => {
        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
      });
    });
  
    test('displays balance fetching failure message when balance is zero', async () => {
      (Web3 as any).eth.getBalance.mockResolvedValueOnce('0');
  
      render(<App />);
  
      const addressInput = screen.getByPlaceholderText('Enter address');
      const fetchButton = screen.getByText('Fetch USDT Balance');
  
      fireEvent.change(addressInput, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } });
      fireEvent.click(fetchButton);
  
      await waitFor(() => {
        expect(screen.getByText('Error: Insufficient USDT balance')).toBeInTheDocument();
      });
    });
  
    test('displays error message when last block number fetching fails', async () => {
      (Web3 as any).eth.getBlockNumber.mockRejectedValueOnce(new Error('Network error'));
  
      render(<App />);
  
      await waitFor(() => {
        expect(screen.getByText('Error: Network error')).toBeInTheDocument();
      });
    });
  
    test('displays balance fetching failure message when USDT contract not detected', async () => {
      (Web3 as any).eth.Contract.mockImplementationOnce(() => {
        throw new Error('USDT contractq not detected');
      });
  
      render(<App />);
  
      const addressInput = screen.getByPlaceholderText('Enter address');
      const fetchButton = screen.getByText('Fetch USDT Balance');
  
      fireEvent.change(addressInput, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } });
      fireEvent.click(fetchButton);
  
      await waitFor(() => {
        expect(screen.getByText('Error: USDT contract not detected')).toBeInTheDocument();
      });
    });
  });
  // Add more test cases as needed
});
