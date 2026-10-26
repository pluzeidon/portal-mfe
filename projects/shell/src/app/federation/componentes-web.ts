import { InjectionToken } from '@angular/core';

/** Nombre del micro frontend → URL de su módulo de Web Component */
export type MapaComponentesWeb = Record<string, string>;

export const COMPONENTES_WEB = new InjectionToken<MapaComponentesWeb>('COMPONENTES_WEB');

export interface ModuloComponenteWeb {
  INFO?: { nombre: string; version: string };
}

/** Importa el módulo que registra el Web Component, con tiempo límite. */
export function cargarComponenteWeb(url: string, limiteMs = 5000): Promise<ModuloComponenteWeb> {
  const limite = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Tiempo agotado al cargar ${url}`)), limiteMs),
  );
  return Promise.race([import(/* @vite-ignore */ url) as Promise<ModuloComponenteWeb>, limite]);
}