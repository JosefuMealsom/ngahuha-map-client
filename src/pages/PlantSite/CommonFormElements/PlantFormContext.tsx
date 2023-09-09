import React, { ReactNode, createContext } from 'react';

type PlantFormContextProperties = {
  setPrimaryPhoto: (id: string) => any;
} | null;

export const PlantFormContext = createContext<PlantFormContextProperties>(null);
