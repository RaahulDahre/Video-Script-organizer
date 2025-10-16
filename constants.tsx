import React from 'react';
import { Platform } from './types';
import { InstagramIcon } from './components/icons/InstagramIcon';
import { WhatsAppIcon } from './components/icons/WhatsAppIcon';
import { YouTubeIcon } from './components/icons/YouTubeIcon';
import { YouTubeShortsIcon } from './components/icons/YouTubeShortsIcon';
import { ThreadsIcon } from './components/icons/ThreadsIcon';
import { XPlatformIcon } from './components/icons/XPlatformIcon';
import { TelegramIcon } from './components/icons/TelegramIcon';
import { InstagramPlaceholder } from './components/placeholders/InstagramPlaceholder';
import { WhatsAppPlaceholder } from './components/placeholders/WhatsAppPlaceholder';
import { YouTubePlaceholder } from './components/placeholders/YouTubePlaceholder';
import { YouTubeShortsPlaceholder } from './components/placeholders/YouTubeShortsPlaceholder';
import { ThreadsPlaceholder } from './components/placeholders/ThreadsPlaceholder';
import { XPlaceholder } from './components/placeholders/XPlaceholder';
import { TelegramPlaceholder } from './components/placeholders/TelegramPlaceholder';

export const PLATFORMS = [
  {
    name: Platform.Instagram,
    icon: <InstagramIcon className="w-6 h-6" />,
    color: 'text-brand-instagram',
    hoverColor: 'hover:bg-brand-instagram/20',
    borderColor: 'border-brand-instagram',
    placeholder: <InstagramPlaceholder />,
  },
  {
    name: Platform.WhatsApp,
    icon: <WhatsAppIcon className="w-6 h-6" />,
    color: 'text-brand-whatsapp',
    hoverColor: 'hover:bg-brand-whatsapp/20',
    borderColor: 'border-brand-whatsapp',
    placeholder: <WhatsAppPlaceholder />,
  },
  {
    name: Platform.YouTube,
    icon: <YouTubeIcon className="w-6 h-6" />,
    color: 'text-brand-youtube',
    hoverColor: 'hover:bg-brand-youtube/20',
    borderColor: 'border-brand-youtube',
    placeholder: <YouTubePlaceholder />,
  },
  {
    name: Platform.YouTubeShorts,
    icon: <YouTubeShortsIcon className="w-6 h-6" />,
    color: 'text-brand-shorts',
    hoverColor: 'hover:bg-brand-shorts/20',
    borderColor: 'border-brand-shorts',
    placeholder: <YouTubeShortsPlaceholder />,
  },
  {
    name: Platform.Threads,
    icon: <ThreadsIcon className="w-6 h-6" />,
    color: 'text-brand-threads',
    hoverColor: 'hover:bg-brand-threads/20',
    borderColor: 'border-brand-threads',
    placeholder: <ThreadsPlaceholder />,
  },
  {
    name: Platform.X,
    icon: <XPlatformIcon className="w-6 h-6" />,
    color: 'text-brand-x',
    hoverColor: 'hover:bg-brand-x/20',
    borderColor: 'border-brand-x',
    placeholder: <XPlaceholder />,
  },
  {
    name: Platform.Telegram,
    icon: <TelegramIcon className="w-6 h-6" />,
    color: 'text-brand-telegram',
    hoverColor: 'hover:bg-brand-telegram/20',
    borderColor: 'border-brand-telegram',
    placeholder: <TelegramPlaceholder />,
  },
];