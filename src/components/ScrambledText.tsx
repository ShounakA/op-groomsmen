import { useState, useEffect } from 'react';

const ScrambledText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = '!@#$%^&*()_+{}:"<>?|[];\',./`~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    const interval = setInterval(() => {
      const scrambled = text
        .split('')
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join('');
      setDisplay(scrambled);
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return <>{display}</>;
};

export default ScrambledText;
