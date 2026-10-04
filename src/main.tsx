import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import { HostApp } from './HostApp';
import { PlayerApp } from './PlayerApp';

const isHost = window.location.pathname.replace(/\/+$/, '') === '/host';
createRoot(document.getElementById('root')!).render(isHost ? <HostApp /> : <PlayerApp />);
