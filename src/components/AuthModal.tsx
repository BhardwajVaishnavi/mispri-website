'use client';

import { useState } from 'react';
import Modal from './Modal';
import { LoginForm, RegisterForm } from './AuthForms';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login' 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { isAuthenticated } = useAuth();

  // If user becomes authenticated, close the modal
  if (isAuthenticated && isOpen) {
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Sign In' : 'Create Account'}
    >
      {mode === 'login' ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToRegister={() => setMode('register')}
        />
      ) : (
        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </Modal>
  );
}
