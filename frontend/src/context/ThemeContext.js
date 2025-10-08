import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState('light');

    useEffect(() => {

        const saved = localStorage.getItem('theme');

        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'darkmode' : '');

        }else{
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initial = prefersDark?'dark':"light";
            setTheme(initial);
            document.documentElement.setAttribute('dark-theme', initial === 'dark'?"darkmode":"");
        }

    }, []);

    function toggleTheme() {
        setTheme(prev => {
            const next = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', next)
            document.documentElement.setAttribute('data-theme', next === 'dark' ? 'darkmode' : '')
            return next;
        })
    }
return(
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
);
}