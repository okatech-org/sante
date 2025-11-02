import React, { useState } from 'react';
import { Mic, MessageCircle, Brain } from 'lucide-react';

interface IAstedButtonProps {
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  voiceListening?: boolean;
  voiceSpeaking?: boolean;
  voiceProcessing?: boolean;
  isInterfaceOpen?: boolean;
}

interface Shockwave {
  id: number;
}

// COULEURS SANTE.GA - Émeraude/Vert
const COLORS = {
  primary: 'rgba(16, 185, 129, 0.9)',      // emerald-500
  secondary: 'rgba(52, 211, 153, 0.9)',    // emerald-400
  tertiary: 'rgba(167, 243, 208, 0.9)',    // emerald-200
  accent: 'rgba(110, 231, 183, 0.7)',      // emerald-300
  hex: {
    primary: '#10b981',
    secondary: '#34d399',
    tertiary: '#a7f3d0',
    light: '#6ee7b7',
    dark: '#059669'
  }
};

const styles = `
/* Perspective 3D */
.perspective-container {
  perspective: 1500px;
}

.perspective {
  perspective: 1200px;
  position: relative;
  transform-style: preserve-3d;
}

/* Bouton avec matière épaisse - TAILLE RESPONSIVE */
.thick-matter-button {
  width: var(--button-size, 128px);
  height: var(--button-size, 128px);
  transform-style: preserve-3d;
  border-radius: 50%;
  will-change: transform, box-shadow, border-radius, filter;
  transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  animation: 
    global-heartbeat 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite,
    shadow-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite,
    rhythm-variation 15s ease-in-out infinite,
    micro-breathing 4s ease-in-out infinite;
}

/* Micro respiration */
@keyframes micro-breathing {
  0%, 100% { transform: scale(1) translateZ(0); }
  25% { transform: scale(1.02) translateZ(2px); }
  50% { transform: scale(0.98) translateZ(-2px); }
  75% { transform: scale(1.01) translateZ(1px); }
}

/* Hover - Intensification */
.thick-matter-button:hover {
  animation: 
    global-heartbeat-intense 1.4s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite,
    shadow-pulse-intense 1.4s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite,
    rhythm-variation 15s ease-in-out infinite,
    hover-glow 1.4s ease-in-out infinite,
    hover-expansion 2s ease-in-out infinite;
}

@keyframes hover-expansion {
  0%, 100% { transform: scale(1) translateZ(0); }
  50% { transform: scale(1.05) translateZ(10px); }
}

/* Active - Contraction musculaire */
.thick-matter-button:active {
  animation: muscle-contraction-organic 1.2s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

@keyframes muscle-contraction-organic {
  0% { transform: scale3d(1, 1, 1); filter: brightness(1) saturate(1.7); border-radius: 50%; }
  15% { transform: scale3d(0.94, 0.92, 0.96) rotateX(2deg) rotateY(-1deg); filter: brightness(0.88) saturate(2) hue-rotate(5deg); border-radius: 54% 46% 47% 53% / 46% 54% 45% 55%; }
  35% { transform: scale3d(0.82, 0.78, 0.86) rotateX(4deg) rotateY(-3deg); filter: brightness(0.78) saturate(2.5) hue-rotate(12deg); border-radius: 62% 38% 41% 59% / 40% 60% 39% 61%; }
  75% { transform: scale3d(1.02, 1.01, 1.03) rotateX(-1deg); filter: brightness(1.05) saturate(2) hue-rotate(2deg); border-radius: 52% 48% 49% 51% / 48% 52% 48% 52%; }
  100% { transform: scale3d(1, 1, 1); filter: brightness(1) saturate(1.7); border-radius: 50%; }
}

/* Variation rythme */
@keyframes rhythm-variation {
  0%, 100% { animation-timing-function: cubic-bezier(0.68, -0.2, 0.265, 1.55); }
  30% { animation-timing-function: cubic-bezier(0.78, -0.3, 0.165, 1.65); }
  60% { animation-timing-function: cubic-bezier(0.88, -0.35, 0.065, 1.75); }
}

/* Lueur hover - COULEURS ÉMERAUDE */
@keyframes hover-glow {
  0%, 100% {
    box-shadow:
      0 0 40px ${COLORS.primary},
      0 0 80px ${COLORS.secondary},
      0 0 120px rgba(16, 185, 129, 0.3),
      0 8px 16px rgba(16, 185, 129, 0.2),
      inset 0 -5px 15px rgba(16, 185, 129, 0.2),
      inset 0 5px 15px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 0 60px rgba(16, 185, 129, 0.8),
      0 0 120px ${COLORS.secondary},
      0 0 180px rgba(52, 211, 153, 0.4),
      0 12px 24px rgba(16, 185, 129, 0.3),
      inset 0 -8px 20px rgba(16, 185, 129, 0.25),
      inset 0 8px 20px rgba(255, 255, 255, 0.4);
  }
}

/* Battement intense hover */
@keyframes global-heartbeat-intense {
  0% { transform: scale3d(1, 1, 1) rotate(0deg); border-radius: 50%; filter: brightness(1) saturate(1.7); }
  6% { transform: scale3d(1.22, 1.18, 1.26) rotate(-3deg); border-radius: 35% 65% 62% 38% / 58% 42% 60% 40%; filter: brightness(1.4) saturate(2.5) hue-rotate(10deg); }
  12% { transform: scale3d(1.15, 1.12, 1.18) rotate(-1deg); border-radius: 38% 62% 58% 42% / 54% 46% 56% 44%; filter: brightness(1.3) saturate(2.3) hue-rotate(5deg); }
  18% { transform: scale3d(0.8, 0.84, 0.76) rotate(0.5deg); border-radius: 62% 38% 42% 58% / 38% 62% 40% 60%; filter: brightness(0.8) saturate(1.3) hue-rotate(-10deg); }
  100% { transform: scale3d(1, 1, 1) rotate(0deg); border-radius: 50%; filter: brightness(1) saturate(1.7); }
}

/* Battement normal */
@keyframes global-heartbeat {
  0% { transform: scale3d(1, 1, 1); border-radius: 50%; filter: brightness(1); }
  6% { transform: scale3d(1.14, 1.1, 1.18) rotate(-1.5deg); border-radius: 38% 62% 58% 42% / 55% 45% 58% 42%; filter: brightness(1.15); }
  12% { transform: scale3d(1.1, 1.07, 1.13); border-radius: 40% 60% 55% 45% / 52% 48% 54% 46%; filter: brightness(1.1); }
  18% { transform: scale3d(0.86, 0.9, 0.82); border-radius: 58% 42% 45% 55% / 42% 58% 44% 56%; filter: brightness(0.86); }
  100% { transform: scale3d(1, 1, 1); border-radius: 50%; filter: brightness(1); }
}

/* Background morphing - MÉLANGE MULTICOLORE PSYCHÉDÉLIQUE */
.morphing-bg {
  background: 
    radial-gradient(circle at 20% 80%, rgba(0, 102, 255, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 204, 0, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 170, 255, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.9) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.7) 0%, transparent 50%),
    linear-gradient(
      135deg,
      #0066ff 0%,
      #00aaff 8%,
      #00ffff 16%,
      #4400ff 24%,
      #ff00ff 32%,
      #ff0066 40%,
      #ffcc00 48%,
      #ffc125 56%,
      #ff6600 64%,
      #ff0099 72%,
      #9400d3 80%,
      #4b0082 88%,
      #0066ff 100%
    );
  background-size: 200% 200%, 200% 200%, 200% 200%, 200% 200%, 200% 200%, 400% 400%;
  animation: 
    fluid-mix-organic 25s ease-in-out infinite,
    bg-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite,
    fluid-wave 12s ease-in-out infinite,
    color-shift-continuous 30s linear infinite;
  filter: saturate(2) brightness(1.2);
  mix-blend-mode: lighten;
  box-shadow:
    inset 0 0 50px rgba(255, 255, 255, 0.3),
    inset 0 0 100px rgba(0, 170, 255, 0.3),
    inset 0 0 150px rgba(255, 204, 0, 0.2);
  transform-style: preserve-3d;
}

/* Changement de couleur continu */
@keyframes color-shift-continuous {
  0%, 100% {
    filter: hue-rotate(0deg) saturate(2) brightness(1.2);
  }
  50% {
    filter: hue-rotate(180deg) saturate(2.5) brightness(1.3);
  }
}

@keyframes fluid-mix-organic {
  0% { background-position: 0% 0%, 100% 100%, 100% 0%, 0% 100%, 50% 50%, 0% 0%; filter: hue-rotate(0deg) brightness(1) saturate(1.7); }
  25% { background-position: 100% 30%, 0% 70%, 30% 0%, 70% 100%, 60% 40%, 60% 100%; filter: hue-rotate(15deg) brightness(1.2) saturate(2); }
  50% { background-position: 30% 80%, 70% 20%, 80% 70%, 20% 30%, 50% 50%, 80% 20%; filter: hue-rotate(30deg) brightness(1.3) saturate(2.2); }
  75% { background-position: 70% 30%, 30% 70%, 20% 20%, 80% 80%, 55% 45%, 30% 90%; filter: hue-rotate(20deg) brightness(1.15) saturate(1.8); }
  100% { background-position: 0% 0%, 100% 100%, 100% 0%, 0% 100%, 50% 50%, 0% 0%; filter: hue-rotate(0deg) brightness(1) saturate(1.7); }
}

@keyframes fluid-wave {
  0%, 100% { background-position: 0% 0%, 100% 100%, 100% 0%, 0% 100%, 50% 50%, 0% 0%; }
  50% { background-position: 100% 100%, 0% 0%, 0% 0%, 100% 100%, 75% 25%, 60% 100%; }
}

@keyframes bg-pulse {
  0%, 100% { filter: saturate(2) brightness(1.2); }
  6% { filter: saturate(2.3) brightness(1.3); }
  12% { filter: saturate(2.6) brightness(1.4); }
  18% { filter: saturate(1.7) brightness(1); }
}

/* Couche de brillance */
.highlight-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 70%);
  transform: translateZ(15px) rotate(45deg);
  opacity: 0.4;
  filter: blur(2px);
  mix-blend-mode: overlay;
  pointer-events: none;
  animation: highlight-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
}

@keyframes highlight-pulse {
  0%, 100% { opacity: 0.4; transform: translateZ(15px) rotate(45deg) scale(1); }
  6% { opacity: 0.7; transform: translateZ(20px) rotate(45deg) scale(1.08); }
  12% { opacity: 0.85; transform: translateZ(25px) rotate(45deg) scale(1.12); }
}

/* Couche de profondeur */
.depth-layer {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(16, 185, 129, 0.1) 60%, rgba(52, 211, 153, 0.05) 80%);
  filter: blur(2px);
  opacity: 0.4;
  transform: translateZ(-10px);
}

/* Satellite particle */
.satellite-particle {
  width: 8px;
  height: 8px;
  top: 15px;
  left: 50%;
  margin-left: -4px;
  border-radius: 50%;
  background: ${COLORS.secondary};
  box-shadow: 0 0 4px ${COLORS.secondary}, 0 0 8px rgba(52, 211, 153, 0.3), inset 0 -1px 2px rgba(16, 185, 129, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.5);
  z-index: 20;
  position: absolute;
  animation: orbit-close 4s linear infinite;
  transform-style: preserve-3d;
  transform: translateZ(20px);
}

@keyframes orbit-close {
  from { transform: translateZ(20px) rotate(0deg) translateX(30px) rotate(0deg); }
  to { transform: translateZ(20px) rotate(360deg) translateX(30px) rotate(-360deg); }
}

/* Ondes émission */
.wave-emission {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(16, 185, 129, 0.3) 30%, transparent 70%);
  transform: scale3d(0.9, 0.9, 1);
  opacity: 0;
  transform-style: preserve-3d;
}

.wave-1 { animation: wave-emission-heartbeat 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
.wave-2 { animation: wave-emission-heartbeat 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; animation-delay: 0.3s; }
.wave-3 { animation: wave-emission-heartbeat 2.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; animation-delay: 0.6s; }

@keyframes wave-emission-heartbeat {
  0%, 20%, 100% { transform: scale3d(0.9, 0.9, 1) translateZ(0); opacity: 0; filter: blur(0); }
  6% { transform: scale3d(1, 1, 1) translateZ(2px); opacity: 0.7; filter: blur(0); }
  12% { transform: scale3d(1.8, 1.8, 1.2) translateZ(10px); opacity: 0; filter: blur(10px); }
}

/* Membrane organique */
.organic-membrane {
  position: absolute;
  inset: -5%;
  border-radius: 50%;
  background: radial-gradient(circle, transparent 20%, rgba(16, 185, 129, 0.03) 40%, rgba(52, 211, 153, 0.08) 60%, rgba(16, 185, 129, 0.04) 80%, transparent 95%);
  opacity: 0;
  animation: membrane-palpitation-intense 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
  pointer-events: none;
}

@keyframes membrane-palpitation-intense {
  0%, 100% { opacity: 0; transform: scale(1) translateZ(0); filter: blur(0); }
  6% { opacity: 0.7; transform: scale(0.9) translateZ(-10px); filter: blur(0); }
  12% { opacity: 0.95; transform: scale(1.25) translateZ(20px); filter: blur(3px); }
  18% { opacity: 0.4; transform: scale(1.12) translateZ(10px); filter: blur(1px); }
}

/* Membrane secondaire */
.organic-membrane-secondary {
  position: absolute;
  inset: -8%;
  border-radius: 50%;
  background: radial-gradient(circle, transparent 10%, rgba(167, 243, 208, 0.02) 30%, rgba(16, 185, 129, 0.05) 50%, rgba(110, 231, 183, 0.03) 70%, transparent 90%);
  opacity: 0;
  animation: membrane-palpitation-secondary 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
  animation-delay: 0.2s;
  pointer-events: none;
}

@keyframes membrane-palpitation-secondary {
  0%, 100% { opacity: 0; transform: scale(1.05) translateZ(5px) rotate(0deg); filter: blur(2px); }
  10% { opacity: 0.8; transform: scale(0.88) translateZ(-15px) rotate(-5deg); filter: blur(1px); }
  20% { opacity: 1; transform: scale(1.3) translateZ(30px) rotate(-3deg); filter: blur(5px); }
  45% { opacity: 0.2; transform: scale(1.1) translateZ(10px) rotate(1deg); filter: blur(1px); }
}

/* Ombres pulsantes - VERTES */
@keyframes shadow-pulse {
  0%, 100% {
    box-shadow:
      0 6px 12px rgba(16, 185, 129, 0.2),
      0 0 50px rgba(16, 185, 129, 0.15),
      inset 0 -4px 12px rgba(16, 185, 129, 0.15),
      inset 0 4px 12px rgba(255, 255, 255, 0.25);
  }
  12% {
    box-shadow:
      0 12px 28px rgba(16, 185, 129, 0.3),
      0 0 120px rgba(52, 211, 153, 0.3),
      inset 0 -8px 20px rgba(16, 185, 129, 0.25),
      inset 0 8px 20px rgba(255, 255, 255, 0.4);
  }
}

@keyframes shadow-pulse-intense {
  0%, 100% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.4), 0 8px 16px rgba(16, 185, 129, 0.2); }
  12% { box-shadow: 0 0 80px rgba(16, 185, 129, 0.8), 0 20px 40px rgba(16, 185, 129, 0.4); }
}

/* Veines organiques */
.organic-veins {
  position: absolute;
  inset: 5%;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(16, 185, 129, 0.15) 20deg,
    transparent 60deg,
    rgba(52, 211, 153, 0.12) 80deg,
    transparent 120deg,
    rgba(16, 185, 129, 0.18) 140deg,
    transparent 180deg,
    rgba(110, 231, 183, 0.15) 200deg,
    transparent 240deg,
    rgba(16, 185, 129, 0.13) 260deg,
    transparent 300deg,
    rgba(167, 243, 208, 0.16) 320deg,
    transparent 360deg
  );
  animation: vortex-spin-1 25s linear infinite reverse, vein-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
  filter: blur(2px);
  mix-blend-mode: screen;
  pointer-events: none;
}

@keyframes vortex-spin-1 {
  from { transform: scale(1) rotate(0deg); opacity: 0.15; }
  50% { transform: scale(1.1) rotate(180deg); opacity: 0.25; }
  to { transform: scale(1) rotate(360deg); opacity: 0.15; }
}

@keyframes vein-pulse {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  6% { transform: scale(1.15) rotate(2deg); opacity: 0.25; }
  12% { transform: scale(1.2) rotate(-2deg); opacity: 0.3; }
  18% { transform: scale(0.85); opacity: 0.1; }
}

/* Substance effect */
.substance-effect {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 -15px 30px rgba(16, 185, 129, 0.2);
  opacity: 0.4;
  background: radial-gradient(circle at 50% 120%, rgba(255, 255, 255, 0.3) 0%, rgba(52, 211, 153, 0.1) 50%, rgba(16, 185, 129, 0.05) 80%);
  transform-style: preserve-3d;
  animation: inner-fluid-movement 10s ease-in-out infinite alternate, substance-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
}

@keyframes substance-pulse {
  0%, 100% { opacity: 0.4; transform: translateZ(5px) scale(1); }
  12% { opacity: 0.65; transform: translateZ(15px) scale(1.12); }
}

@keyframes inner-fluid-movement {
  0% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 60%; transform: translateZ(5px) rotate(0deg); }
  50% { border-radius: 60% 40% 30% 70% / 70% 50% 50% 30%; transform: translateZ(18px) rotate(180deg); }
  100% { border-radius: 50% 50% 40% 60% / 30% 60% 40% 70%; transform: translateZ(5px) rotate(360deg); }
}

/* Texture organique */
.organic-texture {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 60% 20%, rgba(52, 211, 153, 0.06) 0%, transparent 25%),
    radial-gradient(circle at 80% 60%, rgba(167, 243, 208, 0.05) 0%, transparent 20%),
    radial-gradient(circle at 30% 70%, rgba(16, 185, 129, 0.06) 0%, transparent 30%);
  opacity: 0.6;
  mix-blend-mode: overlay;
  animation: texture-shift 18s ease-in-out infinite, texture-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
}

@keyframes texture-shift {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.08) rotate(90deg); }
  50% { transform: scale(0.92) rotate(180deg); }
  75% { transform: scale(1.05) rotate(270deg); }
}

@keyframes texture-pulse {
  0%, 100% { opacity: 0.6; }
  12% { opacity: 0.95; }
}

/* Conteneur icônes */
.fixed-icons-container {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 40;
  animation: icon-pulse 2.8s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  6% { transform: scale(0.92); }
  12% { transform: scale(0.88); }
  18% { transform: scale(1.08); }
}

.icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.alternating-element {
  position: absolute;
  opacity: 0;
  transform: translateY(10px) scale(0.9);
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
}

@keyframes fade-in-out {
  0%, 25%, 100% { opacity: 0; }
  5%, 20% { opacity: 1; }
}

.text-element { animation: fade-in-out 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; }
.mic-element { animation: fade-in-out 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; animation-delay: 3s; }
.chat-element { animation: fade-in-out 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; animation-delay: 6s; }
.brain-element { animation: fade-in-out 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite; animation-delay: 9s; }

/* Style texte iAsted */
.iasted-text {
  text-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(16,185,129,0.6);
  font-size: var(--text-size, 1.25rem);
  font-weight: bold;
  line-height: 1;
}

/* Icônes SVG */
.icon-svg {
  width: var(--icon-size, 2.5rem);
  height: var(--icon-size, 2.5rem);
}

/* Onde de choc */
@keyframes shockwave-organic {
  0% { transform: scale(0.5); opacity: 0.8; filter: blur(0); }
  100% { transform: scale(2.5); opacity: 0; filter: blur(5px); }
}

.shockwave-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.5);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(16, 185, 129, 0.3) 50%, transparent 80%);
  animation: shockwave-organic 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  mix-blend-mode: screen;
  pointer-events: none;
}

/* État processing/listening/speaking */
.processing { animation: processing-pulse 2s ease-in-out infinite, global-heartbeat-intense 1s cubic-bezier(0.68, -0.2, 0.265, 1.55) infinite !important; }
.listening { animation: listening-pulse 1.5s ease-in-out infinite !important; border: 3px solid rgba(16, 185, 129, 0.6); }
.speaking { animation: speaking-pulse 1.2s ease-in-out infinite !important; }

@keyframes processing-pulse {
  0%, 100% { transform: scale(1) rotate(0deg); filter: hue-rotate(0deg) brightness(1); }
  50% { transform: scale(0.9) rotate(180deg); filter: hue-rotate(30deg) brightness(0.8); }
}

@keyframes listening-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.85; }
}

@keyframes speaking-pulse {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(1.08); filter: brightness(1.3); }
}

/* Couches fluides internes */
.inner-fluid-layer {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.4;
  transform-style: preserve-3d;
  pointer-events: none;
}

.layer-1 {
  background: radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.3) 0%, rgba(167, 243, 208, 0.2) 50%, transparent 80%);
  animation: fluid-layer-1 10s ease-in-out infinite alternate;
  filter: blur(3px);
  transform: translateZ(10px);
}

.layer-2 {
  background: radial-gradient(circle at 70% 30%, rgba(52, 211, 153, 0.3) 0%, rgba(16, 185, 129, 0.2) 50%, transparent 80%);
  animation: fluid-layer-2 14s ease-in-out infinite alternate-reverse;
  filter: blur(4px);
  transform: translateZ(15px);
}

.layer-3 {
  background: radial-gradient(circle at 50% 60%, rgba(110, 231, 183, 0.3) 0%, rgba(52, 211, 153, 0.2) 50%, transparent 80%);
  animation: fluid-layer-3 12s ease-in-out infinite alternate;
  filter: blur(5px);
  transform: translateZ(20px);
}

@keyframes fluid-layer-1 {
  0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: translateZ(10px) rotate(0deg) scale(1); }
  50% { border-radius: 60% 40% 30% 70% / 70% 50% 50% 30%; transform: translateZ(18px) rotate(180deg) scale(0.96); }
  100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: translateZ(18px) rotate(360deg) scale(1); }
}

@keyframes fluid-layer-2 {
  0% { border-radius: 70% 30% 50% 50% / 30% 50% 50% 70%; transform: translateZ(15px) rotate(0deg); }
  50% { border-radius: 45% 55% 55% 45% / 45% 55% 55% 45%; transform: translateZ(25px) rotate(-180deg); }
  100% { border-radius: 50% 50% 70% 30% / 50% 70% 30% 50%; transform: translateZ(22px) rotate(-360deg); }
}

@keyframes fluid-layer-3 {
  0% { border-radius: 50% 50% 30% 70% / 60% 40% 60% 40%; transform: translateZ(20px) rotate(0deg); }
  50% { border-radius: 65% 35% 40% 60% / 55% 45% 60% 40%; transform: translateZ(24px) rotate(180deg); }
  100% { border-radius: 40% 60% 60% 40% / 30% 60% 40% 70%; transform: translateZ(28px) rotate(360deg); }
}

/* Responsive - Mobile */
@media only screen and (max-width: 767px) {
  .thick-matter-button {
    width: 80px;
    height: 80px;
  }
  
  .iasted-text {
    font-size: 0.875rem !important;
  }
  
  .icon-svg {
    width: 1.75rem !important;
    height: 1.75rem !important;
  }
}
`;

const IAstedButton: React.FC<IAstedButtonProps> = ({ 
  onClick, 
  className = '', 
  size = 'md',
  voiceListening = false,
  voiceSpeaking = false,
  voiceProcessing = false,
  isInterfaceOpen = false
}) => {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const buttonSize = size === 'sm' ? 80 : size === 'lg' ? 160 : 128;
  const textSize = size === 'sm' ? '0.875rem' : size === 'lg' ? '1.5rem' : '1.25rem';
  const iconSize = size === 'sm' ? '1.75rem' : size === 'lg' ? '3rem' : '2.5rem';

  const handleClick = () => {
    const shockwaveId = Date.now();
    
    setShockwaves([...shockwaves, { id: shockwaveId }]);
    setIsClicked(true);
    
    setTimeout(() => {
      setShockwaves(prev => prev.filter(r => r.id !== shockwaveId));
    }, 1500);
    
    setTimeout(() => {
      setIsClicked(false);
    }, 2000);
    
    if (onClick) {
      onClick();
    }
  };

  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);
  const handleMouseLeave = () => setIsActive(false);

  const buttonClasses = [
    'thick-matter-button',
    isClicked && 'color-shift',
    isActive && 'active',
    voiceProcessing && 'processing',
    voiceListening && 'listening',
    voiceSpeaking && 'speaking',
    'relative cursor-pointer focus:outline-none overflow-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{styles}</style>
      
      <div 
        className="perspective-container" 
        style={{ 
          '--button-size': `${buttonSize}px`,
          '--text-size': textSize,
          '--icon-size': iconSize
        } as React.CSSProperties}
      >
        <div className="perspective">
          <button
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className={buttonClasses}
            aria-label="iAsted Assistant"
          >
            {/* Couche profondeur */}
            <div className="depth-layer" />
            
            {/* Satellite */}
            <div className="satellite-particle" />
            
            {/* Membranes organiques */}
            <div className="organic-membrane" />
            <div className="organic-membrane-secondary" />
            
            {/* Background morphing */}
            <div className="absolute inset-0 morphing-bg rounded-full" />
            
            {/* Couche brillance */}
            <div className="highlight-layer" />
            
            {/* Substance effect */}
            <div className="substance-effect" />
            
            {/* Couches fluides internes */}
            <div className="inner-fluid-layer layer-1" />
            <div className="inner-fluid-layer layer-2" />
            <div className="inner-fluid-layer layer-3" />
            
            {/* Veines organiques */}
            <div className="organic-veins" />
            
            {/* Émissions d'ondes */}
            <div className="wave-emission wave-1" />
            <div className="wave-emission wave-2" />
            <div className="wave-emission wave-3" />
            
            {/* Texture organique */}
            <div className="organic-texture" />
            
            {/* Ondes de choc au clic */}
            {shockwaves.map(shockwave => (
              <div key={shockwave.id} className="shockwave-effect" />
            ))}
            
            {/* Icônes au centre */}
            <div className="fixed-icons-container">
              <div className="icon-container">
                <span className="alternating-element text-element text-white iasted-text">
                  iAsted
                </span>
                <Mic className="alternating-element mic-element text-white icon-svg" />
                <MessageCircle className="alternating-element chat-element text-white icon-svg" />
                <Brain className="alternating-element brain-element text-white icon-svg" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default IAstedButton;

