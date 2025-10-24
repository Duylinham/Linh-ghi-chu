
import React from 'react';
import { BellIcon, BellSlashIcon } from './Icons';

interface HeaderProps {
    notificationPermission: NotificationPermission;
    onNotificationRequest: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notificationPermission, onNotificationRequest }) => {
    const getNotificationButton = () => {
        switch (notificationPermission) {
            case 'granted':
                return (
                    <div className="flex items-center space-x-2 text-green-400">
                        <BellIcon className="w-5 h-5" />
                        <span>Notifications Enabled</span>
                    </div>
                );
            case 'denied':
                return (
                    <div className="flex items-center space-x-2 text-red-400">
                        <BellSlashIcon className="w-5 h-5" />
                        <span>Notifications Blocked</span>
                    </div>
                );
            default:
                return (
                    <button
                        onClick={onNotificationRequest}
                        className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                        <BellIcon className="w-5 h-5" />
                        <span>Enable Notifications</span>
                    </button>
                );
        }
    };

    return (
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
            <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Gemini Reminders
                </h1>
                <p className="text-slate-400">Your AI-powered appointment assistant</p>
            </div>
            <div className="hidden sm:block">
                {getNotificationButton()}
            </div>
        </header>
    );
};
