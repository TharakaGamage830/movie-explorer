import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useToast } from '../context/ToastContext';

const ICON_MAP = {
  success: CheckCircleOutlinedIcon,
  error: ErrorOutlineOutlinedIcon,
  info: InfoOutlinedIcon,
  warning: WarningAmberOutlinedIcon,
};

const COLOR_MAP = {
  success: '#4caf50',
  error: '#f44336',
  info: '#2196f3',
  warning: '#ff9800',
};

/**
 * Single toast chip with animated timeout progress bar.
 */
const ToastChip = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  const Icon = ICON_MAP[toast.type] || ICON_MAP.info;
  const accentColor = COLOR_MAP[toast.type] || COLOR_MAP.info;

  useEffect(() => {
    // Trigger entrance animation
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // Auto dismiss
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.duration, onRemove]);

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <Box
      role="alert"
      aria-live="assertive"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 260,
        maxWidth: 420,
        px: 2,
        py: 1.25,
        borderRadius: '12px',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'custom.border',
        boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${accentColor}22`,
        overflow: 'hidden',
        transform: visible && !exiting ? 'translateY(0) scale(1)' : 'translateY(-16px) scale(0.95)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease',
        pointerEvents: 'auto',
      }}
    >
      {/* Accent icon */}
      <Icon sx={{ fontSize: 22, color: accentColor, flexShrink: 0 }} />

      {/* Message */}
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontWeight: 500,
          fontSize: '0.8125rem',
          lineHeight: 1.4,
          color: 'text.primary',
        }}
      >
        {toast.message}
      </Typography>

      {/* Close button */}
      <IconButton
        onClick={handleClose}
        size="small"
        aria-label="Close notification"
        sx={{
          flexShrink: 0,
          p: 0.25,
          color: 'text.secondary',
          '&:hover': { color: 'text.primary' },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {/* Timeout progress bar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: '100%',
          backgroundColor: `${accentColor}22`,
        }}
      >
        <Box
          sx={{
            height: '100%',
            backgroundColor: accentColor,
            animation: `toast-progress ${toast.duration}ms linear forwards`,
            '@keyframes toast-progress': {
              from: { width: '100%' },
              to: { width: '0%' },
            },
          }}
        />
      </Box>
    </Box>
  );
};

/**
 * Toast container — renders all active toasts at top-center.
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <ToastChip key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </Box>
  );
};

export default ToastContainer;
