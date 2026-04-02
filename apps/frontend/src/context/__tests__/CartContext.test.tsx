import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const mockItem = {
      id: 'p1',
      name: 'Jersey Brasil',
      price: 349.90,
      image_url: 'image.jpg'
    };

    act(() => {
      result.current.addToCart(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.subtotal).toBe(349.90);
  });

  it('should increment quantity when adding the same item twice', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const mockItem = {
      id: 'p1',
      name: 'Jersey Brasil',
      price: 100,
      image_url: 'image.jpg'
    };

    act(() => {
      result.current.addToCart(mockItem);
      result.current.addToCart(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.subtotal).toBe(200);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const mockItem = {
      id: 'p1',
      name: 'Jersey Brasil',
      price: 100,
      image_url: 'image.jpg'
    };

    act(() => {
      result.current.addToCart(mockItem);
      result.current.removeFromCart('p1');
    });

    expect(result.current.items).toHaveLength(0);
  });
});
