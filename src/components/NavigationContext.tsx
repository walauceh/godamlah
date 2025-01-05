// NavigationContext.tsx
import React, { createContext, useState, useContext } from 'react';

type NavigationContextType = {
  currentSection: string;
  setCurrentSection: (section: string) => void;
};

export const NavigationContext = createContext<NavigationContextType>({
  currentSection: 'inbox',
  setCurrentSection: () => {},
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSection, setCurrentSection] = useState('inbox');

  return (
    <NavigationContext.Provider value={{ currentSection, setCurrentSection }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);