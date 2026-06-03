"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { 
  ArrowLeft, Download, Info, LayoutGrid, Check, 
  Smartphone, Laptop, RefreshCw, Upload, Image as ImageIcon,
  Music, MessageCircle, Sliders, Palette, Type, ShieldCheck
} from "lucide-react";
import GlobalOverlayManager from "@/components/global-overlay-manager";

// Custom SVG components for icons not present/exported in local lucide-react version
const Chrome = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// Logo SVG Strings for center QR Code
const SPOTIFY_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168 168"><path fill="#1ED760" d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"/></svg>`;

const YOUTUBE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.57 20"><path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path><path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path></svg>`;

const WHATSAPP_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><linearGradient id="whatsapp_gradient_center" gradientUnits="userSpaceOnUse" x1="512.001" y1=".978" x2="512.001" y2="1025.023"><stop offset="0" stop-color="#61fd7d"/><stop offset="1" stop-color="#2bb826"/></linearGradient></defs><path d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z" fill="url(#whatsapp_gradient_center)"/><path fill="#FFF" d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"/></svg>`;

const TIKTOK_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="62.37 70.49 675.3 675.3"><g fill="#ee1d52"><path d="M196 498.32l1.64 4.63c-.21-.53-.81-2.15-1.64-4.63zM260.9 393.39c2.88-24.88 12.66-38.81 31.09-53.09 26.37-19.34 59.31-8.4 59.31-8.4V267a135.84 135.84 0 0 1 23.94 1.48V352s-32.93-10.94-59.3 8.41c-18.42 14.27-28.22 28.21-31.09 53.09-.09 13.51 2.34 31.17 13.53 46.44q-4.15-2.22-8.46-5.06c-24.65-17.27-29.14-43.18-29.02-61.49zM511.25 147c-18.14-20.74-25-41.68-27.48-56.39h22.82s-4.55 38.57 28.61 76.5l.46.51A132.76 132.76 0 0 1 511.25 147zM621.18 205.8v81.84s-29.12-1.19-50.67-6.91c-30.09-8-49.43-20.27-49.43-20.27s-13.36-8.75-14.44-9.36v169c0 9.41-2.47 32.91-10 52.51-9.83 25.64-25 42.47-27.79 45.91 0 0-18.45 22.75-51 38.07-29.34 13.82-55.1 13.47-62.8 13.82 0 0-44.53 1.84-84.6-25.33a169.63 169.63 0 0 1-24.16-20.26l.2.15c40.08 27.17 84.6 25.33 84.6 25.33 7.71-.35 33.47 0 62.8-13.82 32.52-15.32 51-38.07 51-38.07 2.76-3.44 18-20.27 27.79-45.92 7.51-19.59 10-43.1 10-52.51V231c1.08.62 14.43 9.37 14.43 9.37s19.35 12.28 49.44 20.27c21.56 5.72 50.67 6.91 50.67 6.91v-64.13c9.96 2.33 18.45 2.96 23.96 2.38z"/></g><path d="M597.23 203.42v64.11s-29.11-1.19-50.67-6.91c-30.09-8-49.44-20.27-49.44-20.27s-13.35-8.75-14.43-9.37V400c0 9.41-2.47 32.92-10 52.51-9.83 25.65-25 42.48-27.79 45.92 0 0-18.46 22.75-51 38.07-29.33 13.82-55.09 13.47-62.8 13.82 0 0-44.52 1.84-84.6-25.33l-.2-.15a157.5 157.5 0 0 1-11.93-13.52c-12.79-16.27-20.63-35.51-22.6-41a.24.24 0 0 1 0-.07c-3.17-9.54-9.83-32.45-8.92-54.64 1.61-39.15 14.81-63.18 18.3-69.2A162.84 162.84 0 0 1 256.68 303a148.37 148.37 0 0 1 42.22-25 141.61 141.61 0 0 1 52.4-11v64.9s-32.94-10.9-59.3 8.4c-18.43 14.28-28.21 28.21-31.09 53.09-.12 18.31 4.37 44.22 29 61.5q4.31 2.85 8.46 5.06a65.85 65.85 0 0 0 15.5 15.05c24.06 15.89 44.22 17 70 6.68C401.06 474.78 414 459.23 420 442c3.77-10.76 3.72-21.59 3.72-32.79V90.61h60c2.48 14.71 9.34 35.65 27.48 56.39a132.76 132.76 0 0 0 24.41 20.62c2.64 2.85 16.14 16.94 33.47 25.59a130.62 130.62 0 0 0 28.15 10.21z"/><path d="M187.89 450.39v.05l1.48 4.21c-.17-.49-.72-1.98-1.48-4.26z" fill="#69c9d0"/><path d="M298.9 278a148.37 148.37 0 0 0-42.22 25 162.84 162.84 0 0 0-35.52 43.5c-3.49 6-16.69 30.05-18.3 69.2-.91 22.19 5.75 45.1 8.92 54.64a.24.24 0 0 0 0 .07c2 5.44 9.81 24.68 22.6 41a157.5 157.5 0 0 0 11.93 13.52 166.64 166.64 0 0 1-35.88-33.64c-12.68-16.13-20.5-35.17-22.54-40.79a1 1 0 0 1 0-.12v-.07c-3.18-9.53-9.86-32.45-8.93-54.67 1.61-39.15 14.81-63.18 18.3-69.2a162.68 162.68 0 0 1 35.52-43.5 148.13 148.13 0 0 1 42.22-25 144.63 144.63 0 0 1 29.78-8.75 148 148 0 0 1 46.57-.69V267a141.61 141.61 0 0 0-52.45 11z" fill="#69c9d0"/><path d="M483.77 90.61h-60v318.61c0 11.2 0 22-3.72 32.79-6.06 17.22-18.95 32.77-36.13 39.67-25.79 10.36-45.95 9.21-70-6.68a65.85 65.85 0 0 1-15.54-15c20.49 10.93 38.83 10.74 61.55 1.62 17.17-6.9 30.08-22.45 36.12-39.68 3.78-10.76 3.73-21.59 3.73-32.78V70.49h82.85s-.93 7.92 1.14 20.12zM597.23 185.69v17.73a130.62 130.62 0 0 1-28.1-10.21c-17.33-8.65-30.83-22.74-33.47-25.59a93.69 93.69 0 0 0 9.52 5.48c21.07 10.52 41.82 13.66 52.05 12.59z" fill="#69c9d0"/><path d="M486.85 701.51a22.75 22.75 0 0 1-1-6.73v-.16a24.53 24.53 0 0 0 1 6.89zM536.44 694.62v.16a23.07 23.07 0 0 1-1 6.73 24.89 24.89 0 0 0 1-6.89z" fill="none"/><path d="M485.84 694.78a22.75 22.75 0 0 0 1 6.73 2.59 2.59 0 0 0 .14.45 25.28 25.28 0 0 0 24.16 17.8v25.59c-12.46 0-21.38.44-35-7.59-15.44-9.16-24.14-25.91-24.14-43.3 0-17.94 9.74-35.91 26.25-44.57 12-6.28 21.09-6.32 32.92-6.32v25.58a25.31 25.31 0 0 0-25.31 25.31z" fill="#69c9d0"/><path d="M536.64 694.78a23.07 23.07 0 0 1-1 6.73c0 .15-.09.3-.14.45a25.3 25.3 0 0 1-24.16 17.8v25.59c12.45 0 21.38.44 34.95-7.59 15.49-9.16 24.21-25.91 24.21-43.3 0-17.94-9.74-35.91-26.25-44.57-12-6.28-21.09-6.32-32.91-6.32v25.58a25.31 25.31 0 0 1 25.3 25.31z" fill="#ee1d52"/><path d="M119.51 620.36h93.71l-8.66 25.78H180v98.67h-30.13v-98.67h-30.36zm248.35 0v25.78h30.36v98.67h30.17v-98.67h24.52l8.66-25.78zm-134.25 29.38A14.6 14.6 0 1 0 219 635.15a14.59 14.59 0 0 0 14.61 14.59zM219 744.81h29.58v-84.75H219zM355 649h-34.6l-29.82 29.82v-58.36h-29.39l-.09 124.35h29.67v-32.4L300 704l28.8 40.77h31.72l-41.72-59.62zm283.77 36.17L674.94 649h-34.59l-29.83 29.82v-58.36h-29.38L581 744.81h29.68v-32.4L620 704l28.8 40.77h31.73zm-76.06 9.27c0 28.1-23.09 50.89-51.57 50.89s-51.57-22.79-51.57-50.89 23.09-50.89 51.57-50.89 51.57 22.8 51.57 50.91zm-26.27 0a25.3 25.3 0 1 0-25.3 25.3 25.3 25.3 0 0 0 25.3-25.28z"/></svg>`;

const LINKEDIN_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><g fill="none" fill-rule="evenodd"><path d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z" fill="#007EBB"/><path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z" fill="#FFF"/></g></svg>`;

const GOOGLE_CENTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 0 262 262"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>`;

const STANDART_CENTER_SVG = "";

interface QrClientProps {
  userId: string | null;
  siteTitle: string;
  siteLogo: string;
}

type PlatformPreset = {
  id: string;
  name: string;
  defaultCta: string;
  defaultUrl: string;
  defaultTitle: string;
  defaultBusinessName: string;
  primaryColor: string;
  cardBg: string;
  textColor: string;
  qrColor: string;
  centerLogoSvg: string;
  topLogoRenderer: (color: string) => React.ReactNode;
};

export default function QrClient({ userId, siteTitle, siteLogo }: QrClientProps) {
  // Brand Logo Renderers for top of card
  const renderSpotifyLogo = (color: string) => (
    <g transform="scale(0.357) translate(-84, -84)">
      <path fill="#1ED760" d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"/>
    </g>
  );

  const renderYoutubeLogo = (color: string) => (
    <g transform="scale(2.1) translate(-14.285, -10)">
      <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"></path>
      <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"></path>
    </g>
  );

  const renderWhatsappLogo = (color: string) => (
    <g transform="scale(0.0586) translate(-512, -512)">
      <linearGradient id="whatsapp_gradient_top" gradientUnits="userSpaceOnUse" x1="512.001" y1=".978" x2="512.001" y2="1025.023">
        <stop offset="0" stop-color="#61fd7d"/>
        <stop offset="1" stop-color="#2bb826"/>
      </linearGradient>
      <path fill="url(#whatsapp_gradient_top)" d="M1023.941 765.153c0 5.606-.171 17.766-.508 27.159-.824 22.982-2.646 52.639-5.401 66.151-4.141 20.306-10.392 39.472-18.542 55.425-9.643 18.871-21.943 35.775-36.559 50.364-14.584 14.56-31.472 26.812-50.315 36.416-16.036 8.172-35.322 14.426-55.744 18.549-13.378 2.701-42.812 4.488-65.648 5.3-9.402.336-21.564.505-27.15.505l-504.226-.081c-5.607 0-17.765-.172-27.158-.509-22.983-.824-52.639-2.646-66.152-5.4-20.306-4.142-39.473-10.392-55.425-18.542-18.872-9.644-35.775-21.944-50.364-36.56-14.56-14.584-26.812-31.471-36.415-50.314-8.174-16.037-14.428-35.323-18.551-55.744-2.7-13.378-4.487-42.812-5.3-65.649-.334-9.401-.503-21.563-.503-27.148l.08-504.228c0-5.607.171-17.766.508-27.159.825-22.983 2.646-52.639 5.401-66.151 4.141-20.306 10.391-39.473 18.542-55.426C34.154 93.24 46.455 76.336 61.07 61.747c14.584-14.559 31.472-26.812 50.315-36.416 16.037-8.172 35.324-14.426 55.745-18.549 13.377-2.701 42.812-4.488 65.648-5.3 9.402-.335 21.565-.504 27.149-.504l504.227.081c5.608 0 17.766.171 27.159.508 22.983.825 52.638 2.646 66.152 5.401 20.305 4.141 39.472 10.391 55.425 18.542 18.871 9.643 35.774 21.944 50.363 36.559 14.559 14.584 26.812 31.471 36.415 50.315 8.174 16.037 14.428 35.323 18.551 55.744 2.7 13.378 4.486 42.812 5.3 65.649.335 9.402.504 21.564.504 27.15l-.082 504.226z" />
      <path fill="#FFF" d="M783.302 243.246c-69.329-69.387-161.529-107.619-259.763-107.658-202.402 0-367.133 164.668-367.214 367.072-.026 64.699 16.883 127.854 49.017 183.522l-52.096 190.229 194.665-51.047c53.636 29.244 114.022 44.656 175.482 44.682h.151c202.382 0 367.128-164.688 367.21-367.094.039-98.087-38.121-190.319-107.452-259.706zM523.544 808.047h-.125c-54.767-.021-108.483-14.729-155.344-42.529l-11.146-6.612-115.517 30.293 30.834-112.592-7.259-11.544c-30.552-48.579-46.688-104.729-46.664-162.379.066-168.229 136.985-305.096 305.339-305.096 81.521.031 158.154 31.811 215.779 89.482s89.342 134.332 89.312 215.859c-.066 168.243-136.984 305.118-305.209 305.118zm167.415-228.515c-9.177-4.591-54.286-26.782-62.697-29.843-8.41-3.062-14.526-4.592-20.645 4.592-6.115 9.182-23.699 29.843-29.053 35.964-5.352 6.122-10.704 6.888-19.879 2.296-9.176-4.591-38.74-14.277-73.786-45.526-27.275-24.319-45.691-54.359-51.043-63.543-5.352-9.183-.569-14.146 4.024-18.72 4.127-4.109 9.175-10.713 13.763-16.069 4.587-5.355 6.117-9.183 9.175-15.304 3.059-6.122 1.529-11.479-.765-16.07-2.293-4.591-20.644-49.739-28.29-68.104-7.447-17.886-15.013-15.466-20.645-15.747-5.346-.266-11.469-.322-17.585-.322s-16.057 2.295-24.467 11.478-32.113 31.374-32.113 76.521c0 45.147 32.877 88.764 37.465 94.885 4.588 6.122 64.699 98.771 156.741 138.502 21.892 9.45 38.982 15.094 52.308 19.322 21.98 6.979 41.982 5.995 57.793 3.634 17.628-2.633 54.284-22.189 61.932-43.615 7.646-21.427 7.646-39.791 5.352-43.617-2.294-3.826-8.41-6.122-17.585-10.714z"/>
    </g>
  );

  const renderTiktokLogo = (color: string) => (
    <g transform="scale(0.0888) translate(-400, -408)">
      <g fill="#ee1d52">
        <path d="M196 498.32l1.64 4.63c-.21-.53-.81-2.15-1.64-4.63zM260.9 393.39c2.88-24.88 12.66-38.81 31.09-53.09 26.37-19.34 59.31-8.4 59.31-8.4V267a135.84 135.84 0 0 1 23.94 1.48V352s-32.93-10.94-59.3 8.41c-18.42 14.27-28.22 28.21-31.09 53.09-.09 13.51 2.34 31.17 13.53 46.44q-4.15-2.22-8.46-5.06c-24.65-17.27-29.14-43.18-29.02-61.49zM511.25 147c-18.14-20.74-25-41.68-27.48-56.39h22.82s-4.55 38.57 28.61 76.5l.46.51A132.76 132.76 0 0 1 511.25 147zM621.18 205.8v81.84s-29.12-1.19-50.67-6.91c-30.09-8-49.43-20.27-49.43-20.27s-13.36-8.75-14.44-9.36v169c0 9.41-2.47 32.91-10 52.51-9.83 25.64-25 42.47-27.79 45.91 0 0-18.45 22.75-51 38.07-29.34 13.82-55.1 13.47-62.8 13.82 0 0-44.53 1.84-84.6-25.33a169.63 169.63 0 0 1-24.16-20.26l.2.15c40.08 27.17 84.6 25.33 84.6 25.33 7.71-.35 33.47 0 62.8-13.82 32.52-15.32 51-38.07 51-38.07 2.76-3.44 18-20.27 27.79-45.92 7.51-19.59 10-43.1 10-52.51V231c1.08.62 14.43 9.37 14.43 9.37s19.35 12.28 49.44 20.27c21.56 5.72 50.67 6.91 50.67 6.91v-64.13c9.96 2.33 18.45 2.96 23.96 2.38z"/></g><path d="M597.23 203.42v64.11s-29.11-1.19-50.67-6.91c-30.09-8-49.44-20.27-49.44-20.27s-13.35-8.75-14.43-9.37V400c0 9.41-2.47 32.92-10 52.51-9.83 25.65-25 42.48-27.79 45.92 0 0-18.46 22.75-51 38.07-29.33 13.82-55.09 13.47-62.8 13.82 0 0-44.52 1.84-84.6-25.33l-.2-.15a157.5 157.5 0 0 1-11.93-13.52c-12.79-16.27-20.63-35.51-22.6-41a.24.24 0 0 1 0-.07c-3.17-9.54-9.83-32.45-8.92-54.64 1.61-39.15 14.81-63.18 18.3-69.2A162.84 162.84 0 0 1 256.68 303a148.37 148.37 0 0 1 42.22-25 141.61 141.61 0 0 1 52.4-11v64.9s-32.94-10.9-59.3 8.4c-18.43 14.28-28.21 28.21-31.09 53.09-.12 18.31 4.37 44.22 29 61.5q4.31 2.85 8.46 5.06a65.85 65.85 0 0 0 15.5 15.05c24.06 15.89 44.22 17 70 6.68C401.06 474.78 414 459.23 420 442c3.77-10.76 3.72-21.59 3.72-32.79V90.61h60c2.48 14.71 9.34 35.65 27.48 56.39a132.76 132.76 0 0 0 24.41 20.62c2.64 2.85 16.14 16.94 33.47 25.59a130.62 130.62 0 0 0 28.15 10.21z"/><path d="M187.89 450.39v.05l1.48 4.21c-.17-.49-.72-1.98-1.48-4.26z" fill="#69c9d0"/><path d="M298.9 278a148.37 148.37 0 0 0-42.22 25 162.84 162.84 0 0 0-35.52 43.5c-3.49 6-16.69 30.05-18.3 69.2-.91 22.19 5.75 45.1 8.92 54.64a.24.24 0 0 0 0 .07c2 5.44 9.81 24.68 22.6 41a157.5 157.5 0 0 0 11.93 13.52 166.64 166.64 0 0 1-35.88-33.64c-12.68-16.13-20.5-35.17-22.54-40.79a1 1 0 0 1 0-.12v-.07c-3.18-9.53-9.86-32.45-8.93-54.67 1.61-39.15 14.81-63.18 18.3-69.2a162.68 162.68 0 0 1 35.52-43.5 148.13 148.13 0 0 1 42.22-25 144.63 144.63 0 0 1 29.78-8.75 148 148 0 0 1 46.57-.69V267a141.61 141.61 0 0 0-52.45 11z" fill="#69c9d0"/><path d="M483.77 90.61h-60v318.61c0 11.2 0 22-3.72 32.79-6.06 17.22-18.95 32.77-36.13 39.67-25.79 10.36-45.95 9.21-70-6.68a65.85 65.85 0 0 1-15.54-15c20.49 10.93 38.83 10.74 61.55 1.62 17.17-6.9 30.08-22.45 36.12-39.68 3.78-10.76 3.73-21.59 3.73-32.78V70.49h82.85s-.93 7.92 1.14 20.12zM597.23 185.69v17.73a130.62 130.62 0 0 1-28.1-10.21c-17.33-8.65-30.83-22.74-33.47-25.59a93.69 93.69 0 0 0 9.52 5.48c21.07 10.52 41.82 13.66 52.05 12.59z" fill="#69c9d0"/><path d="M486.85 701.51a22.75 22.75 0 0 1-1-6.73v-.16a24.53 24.53 0 0 0 1 6.89zM536.44 694.62v.16a23.07 23.07 0 0 1-1 6.73 24.89 24.89 0 0 0 1-6.89z" fill="none"/><path d="M485.84 694.78a22.75 22.75 0 0 0 1 6.73 2.59 2.59 0 0 0 .14.45 25.28 25.28 0 0 0 24.16 17.8v25.59c-12.46 0-21.38.44-35-7.59-15.44-9.16-24.14-25.91-24.14-43.3 0-17.94 9.74-35.91 26.25-44.57 12-6.28 21.09-6.32 32.92-6.32v25.58a25.31 25.31 0 0 0-25.31 25.31z" fill="#69c9d0"/><path d="M536.64 694.78a23.07 23.07 0 0 1-1 6.73c0 .15-.09.3-.14.45a25.3 25.3 0 0 1-24.16 17.8v25.59c12.45 0 21.38.44 34.95-7.59 15.49-9.16 24.21-25.91 24.21-43.3 0-17.94-9.74-35.91-26.25-44.57-12-6.28-21.09-6.32-32.91-6.32v25.58a25.31 25.31 0 0 1 25.3 25.31z" fill="#ee1d52"/><path d="M119.51 620.36h93.71l-8.66 25.78H180v98.67h-30.13v-98.67h-30.36zm248.35 0v25.78h30.36v98.67h30.17v-98.67h24.52l8.66-25.78zm-134.25 29.38A14.6 14.6 0 1 0 219 635.15a14.59 14.59 0 0 0 14.61 14.59zM219 744.81h29.58v-84.75H219zM355 649h-34.6l-29.82 29.82v-58.36h-29.39l-.09 124.35h29.67v-32.4L300 704l28.8 40.77h31.72l-41.72-59.62zm283.77 36.17L674.94 649h-34.59l-29.83 29.82v-58.36h-29.38L581 744.81h29.68v-32.4L620 704l28.8 40.77h31.73zm-76.06 9.27c0 28.1-23.09 50.89-51.57 50.89s-51.57-22.79-51.57-50.89 23.09-50.89 51.57-50.89 51.57 22.8 51.57 50.91zm-26.27 0a25.3 25.3 0 1 0-25.3 25.3 25.3 25.3 0 0 0 25.3-25.28z"/>
    </g>
  );

  const renderLinkedinLogo = (color: string) => (
    <g transform="scale(0.8333) translate(-36, -36)">
      <g fill="none" fill-rule="evenodd">
        <path d="M8,72 L64,72 C68.418278,72 72,68.418278 72,64 L72,8 C72,3.581722 68.418278,-8.11624501e-16 64,0 L8,0 C3.581722,8.11624501e-16 -5.41083001e-16,3.581722 0,8 L0,64 C5.41083001e-16,68.418278 3.581722,72 8,72 Z" fill="#007EBB"/>
        <path d="M62,62 L51.315625,62 L51.315625,43.8021149 C51.315625,38.8127542 49.4197917,36.0245323 45.4707031,36.0245323 C41.1746094,36.0245323 38.9300781,38.9261103 38.9300781,43.8021149 L38.9300781,62 L28.6333333,62 L28.6333333,27.3333333 L38.9300781,27.3333333 L38.9300781,32.0029283 C38.9300781,32.0029283 42.0260417,26.2742151 49.3825521,26.2742151 C56.7356771,26.2742151 62,30.7644705 62,40.051212 L62,62 Z M16.349349,22.7940133 C12.8420573,22.7940133 10,19.9296567 10,16.3970067 C10,12.8643566 12.8420573,10 16.349349,10 C19.8566406,10 22.6970052,12.8643566 22.6970052,16.3970067 C22.6970052,19.9296567 19.8566406,22.7940133 16.349349,22.7940133 Z M11.0325521,62 L21.769401,62 L21.769401,27.3333333 L11.0325521,27.3333333 L11.0325521,62 Z" fill="#FFF"/>
      </g>
    </g>
  );

  const renderGoogleLogo = (color: string) => (
    <g transform="scale(0.229) translate(-128, -131)">
      <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
      <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
      <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
      <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
    </g>
  );

  const renderDefaultLogo = (color: string) => (
    <g transform="translate(-25, -25) scale(1)">
      <circle cx="25" cy="25" r="23" fill={color} />
      <path d="M15 15h6v6h-6v-6zm0 14h6v6h-6v-6zm14-14h6v6h-6v-6zm0 14h6v6h-6v-6zM21 21h8v8h-8v-8zm1 1v6h6v-6h-6z" fill="#FFFFFF" />
    </g>
  );

  const presets: PlatformPreset[] = [
    {
      id: "google",
      name: "Google Review",
      defaultCta: "Google'da Değerlendir",
      defaultUrl: "https://g.page/r/your-business-link",
      defaultTitle: "review us on Google",
      defaultBusinessName: "MİSAFİR AĞIRLAMA LTD.",
      primaryColor: "#4285F4",
      cardBg: "#ffffff",
      textColor: "#334155",
      qrColor: "#1e293b",
      centerLogoSvg: GOOGLE_CENTER_SVG,
      topLogoRenderer: renderGoogleLogo
    },
    {
      id: "spotify",
      name: "Spotify",
      defaultCta: "Spotify'da Takip Et",
      defaultUrl: "https://open.spotify.com/artist/your-artist-id",
      defaultTitle: "listen on Spotify",
      defaultBusinessName: "KREATÖR ÇALMA LİSTESİ",
      primaryColor: "#1DB954",
      cardBg: "#ffffff",
      textColor: "#0c0a09",
      qrColor: "#0c0a09",
      centerLogoSvg: SPOTIFY_CENTER_SVG,
      topLogoRenderer: renderSpotifyLogo
    },
    {
      id: "youtube",
      name: "YouTube",
      defaultCta: "Kanalıma Abone Ol",
      defaultUrl: "https://youtube.com/@your-channel",
      defaultTitle: "subscribe on YouTube",
      defaultBusinessName: "DİJİTAL İÇERİK ATÖLYESİ",
      primaryColor: "#FF0000",
      cardBg: "#ffffff",
      textColor: "#0f172a",
      qrColor: "#0f172a",
      centerLogoSvg: YOUTUBE_CENTER_SVG,
      topLogoRenderer: renderYoutubeLogo
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      defaultCta: "WhatsApp'tan Mesaj Gönder",
      defaultUrl: "https://wa.me/905000000000",
      defaultTitle: "chat on WhatsApp",
      defaultBusinessName: "DESTEK HATTI",
      primaryColor: "#25D366",
      cardBg: "#ffffff",
      textColor: "#166534",
      qrColor: "#14532d",
      centerLogoSvg: WHATSAPP_CENTER_SVG,
      topLogoRenderer: renderWhatsappLogo
    },
    {
      id: "tiktok",
      name: "TikTok",
      defaultCta: "TikTok'ta Takip Et",
      defaultUrl: "https://tiktok.com/@your-profile",
      defaultTitle: "follow on TikTok",
      defaultBusinessName: "EĞLENCE ATÖLYESİ",
      primaryColor: "#000000",
      cardBg: "#ffffff",
      textColor: "#09090b",
      qrColor: "#09090b",
      centerLogoSvg: TIKTOK_CENTER_SVG,
      topLogoRenderer: renderTiktokLogo
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      defaultCta: "LinkedIn'de Bağlantı Kur",
      defaultUrl: "https://linkedin.com/in/your-profile",
      defaultTitle: "connect on LinkedIn",
      defaultBusinessName: "PROFESYONEL AĞ",
      primaryColor: "#0077B5",
      cardBg: "#ffffff",
      textColor: "#0369a1",
      qrColor: "#0c4a6e",
      centerLogoSvg: LINKEDIN_CENTER_SVG,
      topLogoRenderer: renderLinkedinLogo
    },
    {
      id: "standart",
      name: "Standart QR",
      defaultCta: "Bağlantıyı Tara",
      defaultUrl: "https://link.saas",
      defaultTitle: "scan to visit",
      defaultBusinessName: "ŞİRKETİMİZ",
      primaryColor: "#09090b",
      cardBg: "#ffffff",
      textColor: "#0f172a",
      qrColor: "#000000",
      centerLogoSvg: STANDART_CENTER_SVG,
      topLogoRenderer: renderDefaultLogo
    }
  ];

  // State definitions
  const [selectedPreset, setSelectedPreset] = useState<PlatformPreset>(presets[0]);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [targetUrl, setTargetUrl] = useState(presets[0].defaultUrl);
  const [ctaText, setCtaText] = useState(presets[0].defaultCta);
  const [titleText, setTitleText] = useState(presets[0].defaultTitle);
  const [businessName, setBusinessName] = useState(presets[0].defaultBusinessName);
  
  // Customization States
  const [customColorsEnabled, setCustomColorsEnabled] = useState(false);
  const [cardBg, setCardBg] = useState(presets[0].cardBg);
  const [textColor, setTextColor] = useState(presets[0].textColor);
  const [qrColor, setQrColor] = useState(presets[0].qrColor);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  // Synchronize state when switching preset
  const handlePresetSelect = (preset: PlatformPreset) => {
    setSelectedPreset(preset);
    setTargetUrl(preset.defaultUrl);
    setCtaText(preset.defaultCta);
    setTitleText(preset.defaultTitle);
    setBusinessName(preset.defaultBusinessName);
    
    // Automatically apply theme color if custom overrides are off
    if (!customColorsEnabled) {
      setCardBg(preset.cardBg);
      setTextColor(preset.textColor);
      setQrColor(preset.qrColor);
    }
  };

  const handleCustomColorReset = () => {
    setCardBg(selectedPreset.cardBg);
    setTextColor(selectedPreset.textColor);
    setQrColor(selectedPreset.qrColor);
    setCustomColorsEnabled(false);
  };

  // Image Upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSvgLogoUrl = (svgContent: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
  };

  // Canvas-based download handler
  const handleDownload = (format: "png" | "jpeg" | "svg") => {
    const svgEl = document.getElementById("qr-card-svg") as SVGElement | null;
    if (!svgEl) return;

    // Serialize SVG element
    const svgString = new XMLSerializer().serializeToString(svgEl);

    if (format === "svg") {
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedPreset.id}_qr_card.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      // 3x multiplier for ultra-crisp high-res output
      const scale = 3;
      const width = orientation === "vertical" ? 400 : 640;
      const height = orientation === "vertical" ? 640 : 400;

      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // High-fidelity scaling context settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = format === "png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.95);

          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `${selectedPreset.id}_qr_card.${format}`;
          link.click();
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <GlobalOverlayManager />

      {/* Main navigation header matching home page layout */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all">
            <ArrowLeft className="h-5 w-5 text-zinc-400" />
            <span className="text-xl font-black tracking-tight text-white">Ana Sayfa</span>
          </Link>
          <div className="flex items-center space-x-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold text-xs md:text-sm transition-all"
              >
                Yönetim Paneli
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-neon-blue to-light-blue text-white font-bold text-xs md:text-sm transition-all"
              >
                Hemen Üye Ol
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Grid container with modern dark aesthetics */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1.5 rounded-full bg-neon-blue/10 text-neon-blue font-bold text-xs tracking-wider uppercase">
            Ücretsiz Akıllı Araç
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Markalı QR Kart <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-light-blue">Tasarlayıcı</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-medium mt-3 leading-relaxed">
            Sosyal medya, mesajlaşma ve web siteniz için ortasında logo bulunan yüksek kaliteli QR kartlar oluşturun ve dikey/yatay olarak indirin.
          </p>
        </div>

        {/* Platform preset tabs with glowing micro-animations */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              className={`px-4 py-3 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPreset.id === preset.id
                  ? "bg-gradient-to-r from-neon-blue to-light-blue text-white shadow-lg shadow-neon-blue/15"
                  : "bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white"
              }`}
            >
              {preset.id === "google" && <Chrome className="h-3.5 w-3.5" />}
              {preset.id === "spotify" && <Music className="h-3.5 w-3.5" />}
              {preset.id === "youtube" && <Youtube className="h-3.5 w-3.5" />}
              {preset.id === "whatsapp" && <MessageCircle className="h-3.5 w-3.5" />}
              {preset.id === "tiktok" && <Music className="h-3.5 w-3.5" />}
              {preset.id === "linkedin" && <Linkedin className="h-3.5 w-3.5" />}
              {preset.id === "standart" && <LayoutGrid className="h-3.5 w-3.5" />}
              {preset.name}
            </button>
          ))}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-6 bg-zinc-950 p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-900 pb-4">
              <Sliders className="h-5 w-5 text-neon-blue" />
              Tasarım Ayarları
            </h2>

            {/* URL/Target Input */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Hedef Bağlantı (URL)</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Örn: https://youtube.com/@kanaliniz"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
              />
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Call to action */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Alt Başlık (CTA)</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Örn: YouTube'da Abone Ol"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
                />
              </div>

              {/* Title Text */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Üst Slogan</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  placeholder="Örn: subscribe on YouTube"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
                />
              </div>
            </div>

            {/* Business name */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Firma / Kanal Adı</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Örn: BUSINESS NAME"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none text-sm text-white transition-all"
              />
            </div>

            {/* Layout direction toggle */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase text-zinc-400 tracking-wider">Kart Yönü</label>
              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setOrientation("vertical")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    orientation === "vertical" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Smartphone className="h-4 w-4" /> Dikey (Vertical)
                </button>
                <button
                  onClick={() => setOrientation("horizontal")}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    orientation === "horizontal" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Laptop className="h-4 w-4" /> Yatay (Horizontal)
                </button>
              </div>
            </div>

            {/* Custom colors selector */}
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-neon-blue" />
                  Renk Özelleştirme
                </h3>
                {customColorsEnabled ? (
                  <button
                    onClick={handleCustomColorReset}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Sıfırla
                  </button>
                ) : (
                  <button
                    onClick={() => setCustomColorsEnabled(true)}
                    className="text-xs text-neon-blue hover:underline cursor-pointer"
                  >
                    Düzenle
                  </button>
                )}
              </div>

              {customColorsEnabled && (
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Kart Arkaplanı</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={cardBg}
                        onChange={(e) => setCardBg(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{cardBg}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Metin Rengi</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{textColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">QR Kod Rengi</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-[10px] font-mono">{qrColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Logo Upload */}
            <div className="space-y-4 border-t border-zinc-900 pt-6">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Upload className="h-4 w-4 text-neon-blue" />
                Özel Logo Yükle
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    id="logo-upload"
                    className="hidden"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ImageIcon className="h-4 w-4 text-zinc-400" />
                    Resim Seç
                  </label>
                </div>
                {customLogo && (
                  <div className="flex items-center gap-2">
                    <img src={customLogo} alt="Uploaded logo" className="h-10 w-10 object-contain rounded bg-white p-1" />
                    <button
                      onClick={() => setCustomLogo(null)}
                      className="text-xs text-rose-500 hover:underline cursor-pointer"
                    >
                      Kaldır
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview & Downloads */}
          <div className="lg:col-span-6 flex flex-col items-center gap-8">
            {/* Real SVG Card Node */}
            <div className="bg-zinc-950 p-6 md:p-8 rounded-[2.5rem] border border-zinc-900 w-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial-gradient from-neon-blue/5 via-transparent to-transparent opacity-50" />
              
              {/* Actual render element */}
              <div className="relative z-10 shadow-2xl rounded-3xl overflow-hidden bg-white max-w-full">
                {orientation === "vertical" ? (
                  <svg
                    id="qr-card-svg"
                    width="400"
                    height="640"
                    viewBox="0 0 400 640"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ background: cardBg, transition: "background-color 0.3s" }}
                  >
                    {/* Rounded corner card background */}
                    <rect width="400" height="640" rx="30" fill={cardBg} />

                    {/* Logo Top */}
                    <g transform="translate(200, 110)">
                      {customLogo ? (
                        <image href={customLogo} x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />
                      ) : (
                        selectedPreset.topLogoRenderer(selectedPreset.primaryColor)
                      )}
                    </g>

                    {/* Title */}
                    <text
                      x="200"
                      y="210"
                      textAnchor="middle"
                      fill={textColor}
                      style={{
                        fontFamily: "'Outfit', 'Inter', sans-serif",
                        fontWeight: 900,
                        fontSize: "20px",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {titleText}
                    </text>

                    {/* Call to action */}
                    <text
                      x="200"
                      y="245"
                      textAnchor="middle"
                      fill={textColor}
                      opacity="0.8"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "30px",
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {ctaText}
                    </text>

                    {/* Embedded QR Code (represented by custom React SVG component render) */}
                    <g transform="translate(100, 310)">
                      <rect width="200" height="200" rx="20" fill={cardBg} opacity="0.9" />
                      <foreignObject width="200" height="200" x="0" y="0">
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}>
                          <QRCodeSVG
                            value={targetUrl || "https://link.saas"}
                            size={200}
                            bgColor={cardBg}
                            fgColor={qrColor}
                            level="H"
                            imageSettings={
                              (customLogo || selectedPreset.centerLogoSvg)
                                ? {
                                    src: customLogo || getSvgLogoUrl(selectedPreset.centerLogoSvg),
                                    x: undefined,
                                    y: undefined,
                                    height: 44,
                                    width: 44,
                                    excavate: true,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </foreignObject>
                    </g>

                    {/* Business Name Footer */}
                    <text
                      x="200"
                      y="575"
                      textAnchor="middle"
                      fill={textColor}
                      opacity="0.6"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: "15px",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {businessName}
                    </text>
                  </svg>
                ) : (
                  <svg
                    id="qr-card-svg"
                    width="640"
                    height="400"
                    viewBox="0 0 640 400"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ background: cardBg, transition: "background-color 0.3s" }}
                  >
                    <rect width="640" height="400" rx="30" fill={cardBg} />

                    {/* Left details grid */}
                    <g transform="translate(60, 0)">
                      {/* Logo Top */}
                      <g transform="translate(50, 110)">
                        {customLogo ? (
                          <image href={customLogo} x="-40" y="-40" width="80" height="80" preserveAspectRatio="xMidYMid meet" />
                        ) : (
                          selectedPreset.topLogoRenderer(selectedPreset.primaryColor)
                        )}
                      </g>

                      {/* Title */}
                      <text
                        x="0"
                        y="200"
                        textAnchor="start"
                        fill={textColor}
                        style={{
                          fontFamily: "'Outfit', 'Inter', sans-serif",
                          fontWeight: 900,
                          fontSize: "20px",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {titleText}
                      </text>

                      {/* Call to action */}
                      <text
                        x="0"
                        y="245"
                        textAnchor="start"
                        fill={textColor}
                        opacity="0.8"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 700,
                          fontSize: "30px",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {ctaText}
                      </text>

                      {/* Business Name Footer */}
                      <text
                        x="0"
                        y="330"
                        textAnchor="start"
                        fill={textColor}
                        opacity="0.6"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 800,
                          fontSize: "14px",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {businessName}
                      </text>
                    </g>

                    {/* Right Embedded QR Code */}
                    <g transform="translate(370, 100)">
                      <rect width="200" height="200" rx="20" fill={cardBg} opacity="0.9" />
                      <foreignObject width="200" height="200" x="0" y="0">
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyItems: "center" }}>
                          <QRCodeSVG
                            value={targetUrl || "https://link.saas"}
                            size={200}
                            bgColor={cardBg}
                            fgColor={qrColor}
                            level="H"
                            imageSettings={
                              (customLogo || selectedPreset.centerLogoSvg)
                                ? {
                                    src: customLogo || getSvgLogoUrl(selectedPreset.centerLogoSvg),
                                    x: undefined,
                                    y: undefined,
                                    height: 44,
                                    width: 44,
                                    excavate: true,
                                  }
                                : undefined
                            }
                          />
                        </div>
                      </foreignObject>
                    </g>
                  </svg>
                )}
              </div>
            </div>

            {/* Download Buttons Panel with glows */}
            <div className="w-full space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Kartı Yüksek Çözünürlükte İndir
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleDownload("png")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  PNG İNDİR
                </button>
                <button
                  onClick={() => handleDownload("jpeg")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  JPEG İNDİR
                </button>
                <button
                  onClick={() => handleDownload("svg")}
                  className="px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-extrabold tracking-wider transition-all cursor-pointer flex flex-col items-center gap-1"
                >
                  <Download className="h-4.5 w-4.5 text-neon-blue" />
                  SVG İNDİR
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium text-center">
                * PNG ve JPEG formatları, baskı ve paylaşım kalitesi için 3 kat (3x) yüksek çözünürlükte dışa aktarılır.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
