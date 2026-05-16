import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [dark, setDark] = useState<boolean>(() =>
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return {
    dark,
    toggleDark: () => setDark((d) => !d),
  };
};
