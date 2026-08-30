'use client';

import React from 'react';
import { PlatformType, TagColor } from '@/types/stashr';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// 1. App Logo (Stashr Icon)
export function StashrLogo({ className = 'size-5.5', ...props }: IconProps) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect width="64" height="64" rx="15.375" fill="#333333" />
      <path d="M33.876 38.1875C26.438 35.3688 18.5635 32.6875 17.6885 31.6875C14.9533 28.3852 18.4469 26.8387 30.876 24.25C38.5688 27.0295 44.6261 28.875 45.876 30.4375C48.7565 33.3954 44.8601 35.1038 33.876 38.1875Z" fill="white" />
    </svg>
  );
}

// 2. Navigation Icons (Exact SVGs from original site)
export function Bookmark({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg aria-hidden="true" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M16.4854 1.39731C15.348 1.24998 13.8393 1.24999 12 1.25C10.1607 1.24999 8.652 1.24998 7.51458 1.39731C6.34712 1.54853 5.40051 1.86672 4.65121 2.58863C3.898 3.31431 3.56243 4.23743 3.40365 5.37525C3.38356 5.51919 3.3661 5.66833 3.35092 5.8228C3.33154 6.02004 3.32185 6.11866 3.38139 6.18433C3.44092 6.25 3.54199 6.25 3.74412 6.25H20.2559C20.458 6.25 20.5591 6.25 20.6186 6.18433C20.6782 6.11866 20.6685 6.02004 20.6491 5.8228C20.6339 5.66833 20.6164 5.51919 20.5964 5.37525C20.4376 4.23743 20.102 3.31431 19.3488 2.58863C18.5995 1.86672 17.6529 1.54853 16.4854 1.39731Z" fill="currentColor" />
      <path d="M20.7458 8.1438C20.7441 7.95852 20.7433 7.86588 20.6848 7.80794C20.6263 7.75 20.5333 7.75 20.3472 7.75H3.65284C3.46674 7.75 3.37368 7.75 3.31522 7.80794C3.25675 7.86588 3.25591 7.95852 3.25424 8.1438C3.24999 8.61366 3.25 9.115 3.25001 9.64943L3.25 18.0458C3.24996 19.1433 3.24993 20.0553 3.35533 20.7405C3.46438 21.4495 3.71857 22.1395 4.41958 22.5139C5.04476 22.8477 5.7324 22.7798 6.31544 22.6028C6.90514 22.4238 7.50454 22.0989 8.05335 21.7521C8.60739 21.402 9.15065 21.0029 9.623 20.6538C10.0858 20.3117 10.5131 19.9958 10.7969 19.8249C11.1965 19.5843 11.4488 19.4335 11.6533 19.3371C11.842 19.2482 11.9337 19.234 12 19.234C12.0663 19.234 12.158 19.2482 12.3467 19.3371C12.5513 19.4335 12.8035 19.5843 13.2031 19.8249C13.4869 19.9958 13.9142 20.3117 14.377 20.6538C14.8494 21.0029 15.3926 21.402 15.9467 21.7521C16.4955 22.0989 17.0949 22.4238 17.6846 22.6028C18.2676 22.7798 18.9553 22.8477 19.5804 22.5139C20.2814 22.1395 20.5356 21.4495 20.6447 20.7405C20.7501 20.0553 20.75 19.1434 20.75 18.0458V9.64945C20.75 9.11501 20.75 8.61366 20.7458 8.1438Z" fill="currentColor" />
    </svg>
  );
}

export function Archive({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg aria-hidden="true" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path clipRule="evenodd" d="M12.8251 1.75C15.0007 1.74998 15.7354 1.74997 17.0955 1.93282C18.4999 2.12164 19.6537 2.52175 20.5661 3.43414C21.4785 4.34653 21.8786 5.50033 22.0674 6.90471C22.2313 8.12428 22.2483 10.047 22.25 12L22.2436 13.5037C22.235 15.2454 22.1957 16.6539 21.9907 17.7892C21.7817 18.9461 21.3902 19.8839 20.635 20.6391C19.7768 21.4973 18.6846 21.8843 17.3079 22.0694C15.9645 22.25 14.2438 22.25 12.0531 22.25H11.9387C9.74804 22.25 8.02737 22.25 6.68396 22.0694C5.3073 21.8843 4.21505 21.4973 3.35685 20.6391C2.60168 19.8839 2.21018 18.9461 2.00122 17.7892C1.79615 16.6539 1.75684 15.2454 1.74826 13.5037L1.7504 11.9999C1.75213 10.0469 1.76906 8.12426 1.93303 6.90471C2.12184 5.50033 2.52195 4.34653 3.43434 3.43414C4.34673 2.52175 5.50054 2.12164 6.90492 1.93282C8.26505 1.74996 9.99978 1.74998 12.1757 1.75H12.8251ZM20.0852 7.17121C20.2409 8.32894 20.2497 10.2983 20.2502 12.4499C20.2502 12.6155 20.1159 12.75 19.9502 12.75L16.5703 12.75C15.2901 12.75 14.4348 13.7898 14.0243 14.6123C13.7341 15.1938 13.1705 15.75 11.9959 15.75C10.8213 15.75 10.2578 15.1938 9.96755 14.6123C9.55706 13.7898 8.70178 12.75 7.42159 12.75L4.0502 12.75C3.88452 12.75 3.75019 12.6155 3.75023 12.4499C3.75071 10.2983 3.75954 8.32894 3.91519 7.17121C4.07419 5.9886 4.3697 5.3272 4.84855 4.84835C5.32741 4.3695 5.98881 4.07399 7.17141 3.91499C8.38278 3.75212 10.4828 3.75 12.7502 3.75C15.0176 3.75 15.6176 3.75212 16.829 3.91499C18.0116 4.07399 18.673 4.3695 19.1519 4.84835C19.6307 5.3272 19.9262 5.9886 20.0852 7.17121Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function Users({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg aria-hidden="true" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M8.2499 10.5C8.2499 8.42893 9.92884 6.75 11.9999 6.75C14.071 6.75 15.7499 8.42893 15.7499 10.5C15.7499 12.0256 14.8388 13.3385 13.5311 13.9242C16.2049 14.5465 18.25 16.7615 18.25 19.499C18.25 19.9133 17.9142 20.249 17.5 20.249H6.5C6.08579 20.249 5.75 19.9133 5.75 19.499C5.75 16.7615 7.79507 14.5466 10.4688 13.9242C9.16099 13.3385 8.2499 12.0257 8.2499 10.5Z" fill="currentColor" />
      <path d="M7.4999 3.74805C5.42884 3.74805 3.7499 5.42698 3.7499 7.49805C3.7499 9.02371 4.66099 10.3366 5.96877 10.9222C3.29507 11.5447 1.25 13.7596 1.25 16.4971C1.25 16.9113 1.58579 17.2471 2 17.2471H4.62528C5.17244 15.6666 6.27833 14.3603 7.67909 13.4807C7.09348 12.6342 6.7499 11.6067 6.7499 10.498C6.7499 8.0732 8.39385 6.03231 10.628 5.42911C9.95662 4.41605 8.80627 3.74805 7.4999 3.74805Z" fill="currentColor" />
      <path d="M19.3747 17.2471C18.8276 15.6665 17.7216 14.3602 16.3208 13.4806C16.9064 12.6341 17.2499 11.6066 17.2499 10.498C17.2499 8.0732 15.606 6.03231 13.3718 5.42911C14.0432 4.41605 15.1936 3.74805 16.4999 3.74805C18.571 3.74805 20.2499 5.42698 20.2499 7.49805C20.2499 9.02368 19.3389 10.3365 18.0311 10.9222C20.7049 11.5446 22.75 13.7595 22.75 16.4971C22.75 16.9113 22.4142 17.2471 22 17.2471H19.3747Z" fill="currentColor" />
    </svg>
  );
}

export function Radio({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg aria-hidden="true" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path clipRule="evenodd" d="M15.8088 11.1912C14.2602 9.64256 11.7729 9.60392 10.1781 11.0753C9.77214 11.4497 9.13949 11.4243 8.765 11.0183C8.39052 10.6124 8.416 9.97975 8.82193 9.60526C11.2024 7.40914 14.9125 7.46636 17.2231 9.77694C19.5923 12.1462 19.5923 15.9875 17.2231 18.3568L14.3568 21.223C11.9875 23.5923 8.14621 23.5923 5.77695 21.223C3.40768 18.8538 3.40768 15.0125 5.77695 12.6432L6.24129 12.1788C6.63182 11.7883 7.26498 11.7883 7.65551 12.1789C8.04603 12.5694 8.04603 13.2025 7.6555 13.5931L7.19116 14.0574C5.60295 15.6456 5.60295 18.2206 7.19116 19.8088C8.77937 21.397 11.3544 21.397 12.9426 19.8088L15.8088 16.9426C17.3971 15.3544 17.3971 12.7794 15.8088 11.1912Z" fill="currentColor" fillRule="evenodd" />
      <path clipRule="evenodd" d="M16.8088 4.19116C15.2206 2.60295 12.6456 2.60295 11.0574 4.19116L8.19116 7.05741C6.60295 8.64563 6.60295 11.2206 8.19116 12.8088C9.73975 14.3574 12.2271 14.3961 13.8219 12.9247C14.2279 12.5503 14.8605 12.5757 15.235 12.9817C15.6095 13.3876 15.584 14.0202 15.1781 14.3947C12.7976 16.5909 9.08752 16.5336 6.77695 14.2231C4.40768 11.8538 4.40768 8.01246 6.77695 5.6432L9.6432 2.77695C12.0125 0.407685 15.8538 0.407685 18.2231 2.77695C20.5923 5.14621 20.5923 8.98754 18.2231 11.3568L17.7587 11.8211C17.3682 12.2117 16.735 12.2117 16.3445 11.8211C15.954 11.4306 15.954 10.7975 16.3445 10.4069L16.8088 9.94258C18.3971 8.35437 18.3971 5.77937 16.8088 4.19116Z" fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function CollectionsIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg aria-hidden="true" color="currentColor" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M16.3249 9.75C17.5629 9.74997 18.5766 9.74994 19.3512 9.86467C20.156 9.98387 20.8747 10.2496 21.3443 10.9241C21.8129 11.5974 21.8152 12.3648 21.652 13.1641C21.4947 13.9349 21.1485 14.8927 20.7251 16.0641L19.6062 19.1601C19.388 19.764 19.2035 20.2746 19.0057 20.6758C18.7955 21.1022 18.5397 21.4718 18.1433 21.7512C17.7465 22.0308 17.3129 22.1468 16.8413 22.2C16.3983 22.25 15.8578 22.25 15.2196 22.25H15.2196H8.78072H8.78069C8.14252 22.25 7.60195 22.25 7.15895 22.2C6.68742 22.1468 6.25375 22.0308 5.85698 21.7512C5.46058 21.4718 5.2048 21.1022 4.99458 20.6758C4.79677 20.2746 4.61225 19.764 4.39403 19.1601L3.27517 16.0641C2.8518 14.8927 2.50562 13.9349 2.34825 13.1641C2.18504 12.3648 2.18735 11.5974 2.65603 10.9241C3.12559 10.2496 3.84426 9.98387 4.64909 9.86467C5.42369 9.74994 6.43737 9.74997 7.67534 9.75H7.67537H16.3249H16.3249Z" fill="currentColor" />
      <path d="M17.5221 5.75H6.47855C6.26431 5.74999 6.0674 5.74998 5.9021 5.76126C5.72446 5.77338 5.52912 5.80099 5.33061 5.88321C4.90181 6.06083 4.56113 6.40151 4.38352 6.83031C4.3013 7.02881 4.27368 7.22415 4.26156 7.40179C4.25028 7.5671 4.25029 7.76392 4.25031 7.97816V8.66344C4.32299 8.65034 4.39486 8.63866 4.46568 8.62817C5.33232 8.49981 6.42301 8.49991 7.59261 8.50001H16.4071C17.5767 8.49991 18.6674 8.49981 19.5341 8.62817C19.6052 8.6387 19.6773 8.65044 19.7503 8.6636V7.97824C19.7503 7.76397 19.7503 7.56712 19.7391 7.40179C19.7269 7.22415 19.6993 7.02881 19.6171 6.83031C19.4395 6.40151 19.0988 6.06083 18.67 5.88321C18.4715 5.80099 18.2762 5.77338 18.0985 5.76126C17.9332 5.74998 17.7364 5.74999 17.5221 5.75Z" fill="currentColor" />
      <path d="M15.0221 1.75H8.97855C8.76431 1.74999 8.5674 1.74998 8.4021 1.76126C8.22446 1.77338 8.02912 1.80099 7.83061 1.88321C7.40181 2.06083 7.06113 2.40151 6.88352 2.83031C6.8013 3.02881 6.77368 3.22415 6.76156 3.40179C6.75028 3.5671 6.75029 3.76392 6.75031 3.97816V4.50001L17.2503 4.5V3.97824C17.2503 3.76397 17.2503 3.56712 17.2391 3.40179C17.2269 3.22415 17.1993 3.02881 17.1171 2.83031C16.9395 2.40151 16.5988 2.06083 16.17 1.88321C15.9715 1.80099 15.7762 1.77338 15.5985 1.76126C15.4332 1.74998 15.2364 1.74999 15.0221 1.75Z" fill="currentColor" />
    </svg>
  );
}

// 3. View Switcher Icons (Exact Stashr SVGs - Image 5 Match)
export function ViewGrid({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M10.5 8.75V6.75C10.5 5.10626 10.5 4.28439 10.046 3.73121C9.96291 3.62995 9.87005 3.53709 9.76879 3.45398C9.21561 3 8.39374 3 6.75 3C5.10626 3 4.28439 3 3.73121 3.45398C3.62995 3.53709 3.53709 3.62995 3.45398 3.73121C3 4.28439 3 5.10626 3 6.75V8.75C3 10.3937 3 11.2156 3.45398 11.7688C3.53709 11.8701 3.62995 11.9629 3.73121 12.046C4.28439 12.5 5.10626 12.5 6.75 12.5C8.39374 12.5 9.21561 12.5 9.76879 12.046C9.87005 11.9629 9.96291 11.8701 10.046 11.7688C10.5 11.2156 10.5 10.3937 10.5 8.75Z" strokeLinejoin="round"/>
      <path d="M7.75 15.5H5.75C5.05222 15.5 4.70333 15.5 4.41943 15.5861C3.78023 15.78 3.28002 16.2802 3.08612 16.9194C3 17.2033 3 17.5522 3 18.25C3 18.9478 3 19.2967 3.08612 19.5806C3.28002 20.2198 3.78023 20.72 4.41943 20.9139C4.70333 21 5.05222 21 5.75 21H7.75C8.44778 21 8.79667 21 9.08057 20.9139C9.71977 20.72 10.22 20.2198 10.4139 19.5806C10.5 19.2967 10.5 18.9478 10.5 18.25C10.5 17.5522 10.5 17.2033 10.4139 16.9194C10.22 16.2802 9.71977 15.78 9.08057 15.5861C8.79667 15.5 8.44778 15.5 7.75 15.5Z" strokeLinejoin="round"/>
      <path d="M21 17.25V15.25C21 13.6063 21 12.7844 20.546 12.2312C20.4629 12.1299 20.3701 12.0371 20.2688 11.954C19.7156 11.5 18.8937 11.5 17.25 11.5C15.6063 11.5 14.7844 11.5 14.2312 11.954C14.1299 12.0371 14.0371 12.1299 13.954 12.2312C13.5 12.7844 13.5 13.6063 13.5 15.25V17.25C13.5 18.8937 13.5 19.7156 13.954 20.2688C14.0371 20.3701 14.1299 20.4629 14.2312 20.546C14.7844 21 15.6063 21 17.25 21C18.8937 21 19.7156 21 20.2688 20.546C20.3701 20.4629 20.4629 20.3701 20.546 20.2688C21 19.7156 21 18.8937 21 17.25Z" strokeLinejoin="round"/>
      <path d="M18.25 3H16.25C15.5522 3 15.2033 3 14.9194 3.08612C14.2802 3.28002 13.78 3.78023 13.5861 4.41943C13.5 4.70333 13.5 5.05222 13.5 5.75C13.5 6.44778 13.5 6.79667 13.5861 7.08057C13.78 7.71977 14.2802 8.21998 14.9194 8.41388C15.2033 8.5 15.5522 8.5 16.25 8.5H18.25C18.9478 8.5 19.2967 8.5 19.5806 8.41388C20.2198 8.21998 20.72 7.71977 20.9139 7.08057C21 6.79667 21 6.44778 21 5.75C21 5.05222 21 4.70333 20.9139 4.41943C20.72 3.78023 20.2198 3.28002 19.5806 3.08612C19.2967 3 18.9478 3 18.25 3Z" strokeLinejoin="round"/>
    </svg>
  );
}

export function ViewRow({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M8 5L20 5" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M4 5H4.00898" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M4 12H4.00898" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M4 19H4.00898" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M8 12L20 12" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M8 19L20 19" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ViewTimeline({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="3" y="4" width="18" height="16" rx="4" strokeLinejoin="round"/>
      <line x1="3" y1="9" x2="21" y2="9"/>
      <line x1="3" y1="15" x2="21" y2="15"/>
    </svg>
  );
}

export function ViewMosaic({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M3 16L7.46967 11.5303C7.80923 11.1908 8.26978 11 8.75 11C9.23022 11 9.69077 11.1908 10.0303 11.5303L14 15.5M15.5 17L14 15.5M21 16L18.5303 13.5303C18.1908 13.1908 17.7302 13 17.25 13C16.7698 13 16.3092 13.1908 15.9697 13.5303L14 15.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="15.5" cy="7.5" r="1" fill="currentColor"/>
      <path d="M3.69797 19.7472C2.5 18.3446 2.5 16.2297 2.5 12C2.5 7.77027 2.5 5.6554 3.69797 4.25276C3.86808 4.05358 4.05358 3.86808 4.25276 3.69797C5.6554 2.5 7.77027 2.5 12 2.5C16.2297 2.5 18.3446 2.5 19.7472 3.69797C19.9464 3.86808 20.1319 4.05358 20.302 4.25276C21.5 5.6554 21.5 7.77027 21.5 12C21.5 16.2297 21.5 18.3446 20.302 19.7472C20.1319 19.9464 19.9464 20.1319 19.7472 20.302C18.3446 21.5 16.2297 21.5 12 21.5C7.77027 21.5 5.6554 21.5 4.25276 20.302C4.05358 20.1319 3.86808 19.9464 3.69797 19.7472Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// 4. Header & Filter Icons (Exact Stashr SVGs)
export function SidebarToggleIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M2 12C2 8.25027 2 6.3754 2.95491 5.06107C3.26331 4.6366 3.6366 4.26331 4.06107 3.95491C5.3754 3 7.25027 3 11 3H13C16.7497 3 18.6246 3 19.9389 3.95491C20.3634 4.26331 20.7367 4.6366 21.0451 5.06107C22 6.3754 22 8.25027 22 12C22 15.7497 22 17.6246 21.0451 18.9389C20.7367 19.3634 20.3634 19.7367 19.9389 20.0451C18.6246 21 16.7497 21 13 21H11C7.25027 21 5.3754 21 4.06107 20.0451C3.6366 19.7367 3.26331 19.3634 2.95491 18.9389C2 17.6246 2 15.7497 2 12Z" strokeLinejoin="round"/>
      <path d="M9.5 3.5L9.5 20.5" strokeLinejoin="round"/>
      <path d="M5 7C5 7 5.91421 7 6.5 7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 11H6.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 10L15.7735 11.0572C15.2578 11.5016 15 11.7239 15 12C15 12.2761 15.2578 12.4984 15.7735 12.9428L17 14" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function ExtensionPuzzleIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M12.828 6.00096C12.9388 5.68791 12.999 5.35099 12.999 5C12.999 3.34315 11.6559 2 9.99904 2C8.34219 2 6.99904 3.34315 6.99904 5C6.99904 5.35099 7.05932 5.68791 7.17008 6.00096C4.88532 6.0093 3.66601 6.09039 2.87772 6.87868C2.08951 7.66689 2.00836 8.88603 2 11.1704C2.31251 11.06 2.64876 11 2.99904 11C4.6559 11 5.99904 12.3431 5.99904 14C5.99904 15.6569 4.6559 17 2.99904 17C2.64876 17 2.31251 16.94 2 16.8296C2.00836 19.114 2.08951 20.3331 2.87772 21.1213C3.66593 21.9095 4.88508 21.9907 7.16941 21.999C7.05908 21.6865 6.99904 21.3503 6.99904 21C6.99904 19.3431 8.34219 18 9.99904 18C11.6559 18 12.999 19.3431 12.999 21C12.999 21.3503 12.939 21.6865 12.8287 21.999C15.113 21.9907 16.3322 21.9095 17.1204 21.1213C17.9086 20.333 17.9897 19.1137 17.9981 16.829C18.3111 16.9397 18.648 17 18.999 17C20.6559 17 21.999 15.6569 21.999 14C21.999 12.3431 20.6559 11 18.999 11C18.648 11 18.3111 11.0603 17.9981 11.171C17.9897 8.88627 17.9086 7.66697 17.1204 6.87868C16.3321 6.09039 15.1128 6.0093 12.828 6.00096Z" strokeLinejoin="round"/>
    </svg>
  );
}

export function FilterSlidersIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M3 7H6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17H9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 17L21 17" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7L21 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 7C6 6.06812 6 5.60218 6.15224 5.23463C6.35523 4.74458 6.74458 4.35523 7.23463 4.15224C7.60218 4 8.06812 4 9 4C9.93188 4 10.3978 4 10.7654 4.15224C11.2554 4.35523 11.6448 4.74458 11.8478 5.23463C12 5.60218 12 6.06812 12 7C12 7.93188 12 8.39782 11.8478 8.76537C11.6448 9.25542 11.2554 9.64477 10.7654 9.84776C10.3978 10 9.93188 10 9 10C8.06812 10 7.60218 10 7.23463 9.84776C6.74458 9.64477 6.35523 9.25542 6.15224 8.76537C6 8.39782 6 7.93188 6 7Z" />
      <path d="M12 17C12 16.0681 12 15.6022 12.1522 15.2346C12.3552 14.7446 12.7446 14.3552 13.2346 14.1522C13.6022 14 14.0681 14 15 14C15.9319 14 16.3978 14 16.7654 14.1522C17.2554 14.3552 17.6448 14.7446 17.8478 15.2346C18 15.6022 18 16.0681 18 17C18 17.9319 18 18.3978 17.8478 18.7654C17.6448 19.2554 17.2554 19.6448 16.7654 19.8478C16.3978 20 15.9319 20 15 20C14.0681 20 13.6022 20 13.2346 19.8478C12.7446 19.6448 12.3552 19.2554 12.1522 18.7654C12 18.3978 12 17.9319 12 17Z" />
    </svg>
  );
}

export function SelectCursorIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M10.4654 19.0065L8.02099 11.9843L8.02098 11.9843C7.10172 9.34346 6.64208 8.02305 7.33296 7.3327C8.02385 6.64236 9.3453 7.10164 11.9882 8.02019L19.0012 10.4576C20.4673 10.9671 21.2003 11.2219 21.3585 11.7154C21.4021 11.8514 21.4172 11.9949 21.4027 12.1371C21.3503 12.6526 20.686 13.0536 19.3574 13.8556C18.5055 14.3698 18.0796 14.6269 17.966 15.0149C17.9339 15.1247 17.9201 15.2391 17.9253 15.3534C17.9436 15.7572 18.2964 16.1078 19.002 16.8091L21.3211 19.114L21.3211 19.114C21.6683 19.4591 21.8419 19.6316 21.9216 19.8246C22.0258 20.0772 22.0262 20.3606 21.9226 20.6134C21.8435 20.8066 21.6704 20.9796 21.3241 21.3256C20.9787 21.6708 20.806 21.8434 20.613 21.9224C20.3605 22.0259 20.0774 22.0259 19.8249 21.9224C19.6319 21.8434 19.4592 21.6708 19.1137 21.3256L19.1137 21.3256L16.786 18.9997C16.092 18.3062 15.7449 17.9595 15.3467 17.9387C15.2261 17.9324 15.1054 17.9471 14.99 17.9822C14.6084 18.0982 14.3552 18.5183 13.8487 19.3584L13.8487 19.3584C13.0566 20.6721 12.6606 21.329 12.1522 21.3868C12.0023 21.4038 11.8505 21.388 11.7073 21.3405C11.2217 21.1793 10.9696 20.455 10.4654 19.0065Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4V2M5 5L3.5 3.5M4 9H2M5 13L3.5 14.5M14.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FolderPlusIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path d="M13 21H12C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C21.9796 9.05942 21.9992 10.0588 22 12" strokeLinecap="round" />
      <path d="M18 13V21M22 17H14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


// 4. Utility Icons
export function Search({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 17L21 21" />
      <circle cx="11" cy="11" r="8" />
    </svg>
  );
}

export function SlidersHorizontal({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M3 7H6" />
      <path d="M10 7H21" />
      <path d="M3 17H14" />
      <path d="M18 17H21" />
      <circle cx="8" cy="7" r="2" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  );
}

export function Shuffle({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19.5576 4L20.4551 4.97574C20.8561 5.41165 21.0566 5.62961 20.9861 5.81481C20.9155 6 20.632 6 20.0649 6C18.7956 6 17.2771 5.79493 16.1111 6.4733C15.3903 6.89272 14.8883 7.62517 14.0392 9M3 18H4.58082C6.50873 18 7.47269 18 8.2862 17.5267C9.00708 17.1073 9.50904 16.3748 10.3582 15" />
      <path d="M19.5576 20L20.4551 19.0243C20.8561 18.5883 21.0566 18.3704 20.9861 18.1852C20.9155 18 20.632 18 20.0649 18C18.7956 18 17.2771 18.2051 16.1111 17.5267C15.2976 17.0534 14.7629 16.1815 13.6935 14.4376L10.7038 9.5624C9.63441 7.81853 9.0997 6.9466 8.2862 6.4733C7.47269 6 6.50873 6 4.58082 6H3" />
    </svg>
  );
}

export function Plus({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 5V19" />
      <path d="M5 12H19" />
    </svg>
  );
}

export function Check({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function X({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6L18 18" />
    </svg>
  );
}

export function Star({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function Heart({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function Flag({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

export function FileText({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

export function ExternalLink({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export function MoreHorizontal({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function Trash2({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" />
    </svg>
  );
}

export function Copy({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" />
    </svg>
  );
}

export function Settings({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function HelpCircle({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function Sun({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function Moon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Laptop({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

export function Folder({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 19C22 20.1 21.1 21 20 21H4C2.9 21 2 20.1 2 19V5C2 3.9 2.9 3 4 3H9L11 6H20C21.1 6 22 6.9 22 8V19Z" />
    </svg>
  );
}

export function Sparkles({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
    </svg>
  );
}

export function Lightbulb({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M9 18H15M10 22H14M12 2C7.58 2 4 5.58 4 10C4 12.89 5.54 15.42 8 16.74V18H16V16.74C18.46 15.42 20 12.89 20 10C20 5.58 16.42 2 12 2Z" />
    </svg>
  );
}

export function User({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function Camera({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M23 19C23 20.1 22.1 21 21 21H3C1.9 21 1 20.1 1 19V8C1 6.9 1.9 6 3 6H7L9 3H15L17 6H21C22.1 6 23 6.9 23 8V19Z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export function TagIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20.59 13.41L13.42 20.58C12.64 21.36 11.37 21.36 10.59 20.58L2 12V2H12L20.59 10.59C21.37 11.37 21.37 12.63 20.59 13.41Z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export function CreditCard({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

export function Key({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M21 2L18.5 4.5M19 8L21 6M15 8L17 6M7.5 16.5C5.01 16.5 3 14.49 3 12C3 9.51 5.01 7.5 7.5 7.5C9.99 7.5 12 9.51 12 12C12 14.49 9.99 16.5 7.5 16.5ZM12 12L21 3" />
    </svg>
  );
}

export function Shield({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
    </svg>
  );
}

export function Smartphone({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

export function Pin({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.89A4 4 0 0 1 14 9V4h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2h1v5a4 4 0 0 1-2.11 3.56l-1.78.89A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

export function PinOff({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="2" y1="2" x2="22" y2="22" />
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M9 9v-.76A4 4 0 0 1 10 4h-1a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2h-1v5a4 4 0 0 1 .53 1.95" />
      <path d="M15 15.34l-1.11-.55A4 4 0 0 1 12 11.23" />
      <path d="M5 17h12" />
    </svg>
  );
}

export function Pencil({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

// 5. Official Platform Icons
export function TwitterIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 1200 1227">
      <title>X</title>
      <path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" fill="currentColor"/>
    </svg>
  );
}

export function RedditIcon({ className = 'size-4' }: { className?: string }) {
  const id = React.useId().replace(/:/g, '_');
  const g1 = `${id}-snoo-1`;
  const g2 = `${id}-snoo-2`;
  const g3 = `${id}-snoo-3`;
  const g4 = `${id}-snoo-4`;
  const g5 = `${id}-snoo-5`;
  const g6 = `${id}-snoo-6`;
  const g7 = `${id}-snoo-7`;
  const g8 = `${id}-snoo-8`;

  return (
    <svg className={className} viewBox="0 0 216 216" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>Reddit</title>
      <defs>
        <radialGradient cx="169.75" cy="92.19" fx="169.75" fy="92.19" gradientTransform="matrix(1 0 0 .87 0 11.64)" gradientUnits="userSpaceOnUse" id={g1} r="50.98">
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient cx="47.31" cy="92.19" fx="47.31" fy="92.19" gradientTransform="matrix(1 0 0 .87 0 11.64)" gradientUnits="userSpaceOnUse" id={g2} r="50.98">
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient cx="109.61" cy="85.59" fx="109.61" fy="85.59" gradientTransform="matrix(1 0 0 .7 0 25.56)" id={g3} r="153.78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient cx="-6.01" cy="64.68" fx="-6.01" fy="64.68" gradientTransform="matrix(1.07 0 0 1.55 81.08 27.26)" gradientUnits="userSpaceOnUse" id={g4} r="12.85">
          <stop offset="0" stopColor="#f60" />
          <stop offset=".5" stopColor="#ff4500" />
          <stop offset=".7" stopColor="#fc4301" />
          <stop offset=".82" stopColor="#f43f07" />
          <stop offset=".92" stopColor="#e53812" />
          <stop offset="1" stopColor="#d4301f" />
        </radialGradient>
        <radialGradient cx="-73.55" cy="64.68" fx="-73.55" fy="64.68" gradientTransform="matrix(-1.07 0 0 1.55 62.87 27.26)" id={g5} r="12.85" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f60" />
          <stop offset=".5" stopColor="#ff4500" />
          <stop offset=".7" stopColor="#fc4301" />
          <stop offset=".82" stopColor="#f43f07" />
          <stop offset=".92" stopColor="#e53812" />
          <stop offset="1" stopColor="#d4301f" />
        </radialGradient>
        <radialGradient cx="107.93" cy="166.96" fx="107.93" fy="166.96" gradientTransform="matrix(1 0 0 .66 0 57.4)" gradientUnits="userSpaceOnUse" id={g6} r="45.3">
          <stop offset="0" stopColor="#172e35" />
          <stop offset=".29" stopColor="#0e1c21" />
          <stop offset=".73" stopColor="#030708" />
          <stop offset="1" stopColor="#000000" />
        </radialGradient>
        <radialGradient cx="147.88" cy="32.94" fx="147.88" fy="32.94" gradientTransform="matrix(1 0 0 .98 0 .54)" id={g7} r="39.77" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#feffff" />
          <stop offset=".4" stopColor="#feffff" />
          <stop offset=".51" stopColor="#f9fcfc" />
          <stop offset=".62" stopColor="#edf3f5" />
          <stop offset=".7" stopColor="#dee9ec" />
          <stop offset=".72" stopColor="#d8e4e8" />
          <stop offset=".76" stopColor="#ccd8df" />
          <stop offset=".8" stopColor="#c8d5dd" />
          <stop offset=".83" stopColor="#ccd6de" />
          <stop offset=".85" stopColor="#d8dbe2" />
          <stop offset=".88" stopColor="#ede3e9" />
          <stop offset=".9" stopColor="#ffebef" />
        </radialGradient>
        <radialGradient cx="131.31" cy="73.08" fx="131.31" fy="73.08" gradientUnits="userSpaceOnUse" id={g8} r="32.6">
          <stop offset=".48" stopColor="#7a9299" />
          <stop offset=".67" stopColor="#172e35" />
          <stop offset=".75" stopColor="#000000" />
          <stop offset=".82" stopColor="#172e35" />
        </radialGradient>
      </defs>
      <path d="M108 0C48.35 0 0 48.35 0 108c0 29.82 12.09 56.82 31.63 76.37l-20.57 20.57C6.98 209.02 9.87 216 15.64 216H108c59.65 0 108-48.35 108-108S167.65 0 108 0Z" fill="#ff4500" />
      <circle cx="169.22" cy="106.98" fill={`url(#${g1})`} r="25.22" />
      <circle cx="46.78" cy="106.98" fill={`url(#${g2})`} r="25.22" />
      <ellipse cx="108.06" cy="128.64" fill={`url(#${g3})`} rx="72" ry="54" />
      <path d="M86.78 123.48c-.42 9.08-6.49 12.38-13.56 12.38s-12.46-4.93-12.04-14.01c.42-9.08 6.49-15.02 13.56-15.02s12.46 7.58 12.04 16.66Z" fill={`url(#${g4})`} />
      <path d="M129.35 123.48c.42 9.08 6.49 12.38 13.56 12.38s12.46-4.93 12.04-14.01c-.42-9.08-6.49-15.02-13.56-15.02s-12.46 7.58-12.04 16.66Z" fill={`url(#${g5})`} />
      <ellipse cx="79.63" cy="116.37" rx="2.8" ry="3.05" fill="#000000" />
      <ellipse cx="146.21" cy="116.37" rx="2.8" ry="3.05" fill="#000000" />
      <path d="M108.06 142.92c-8.76 0-17.16.43-24.92 1.22-1.33.13-2.17 1.51-1.65 2.74 4.35 10.39 14.61 17.69 26.57 17.69s22.23-7.3 26.57-17.69c.52-1.23-.33-2.61-1.65-2.74-7.77-.79-16.16-1.22-24.92-1.22Z" fill={`url(#${g6})`} />
      <circle cx="147.49" cy="49.43" fill={`url(#${g7})`} r="17.87" />
      <path d="M107.8 76.92c-2.14 0-3.87-.89-3.87-2.27 0-16.01 13.03-29.04 29.04-29.04 2.14 0 3.87 1.73 3.87 3.87s-1.73 3.87-3.87 3.87c-11.74 0-21.29 9.55-21.29 21.29 0 1.38-1.73 2.27-3.87 2.27Z" fill={`url(#${g8})`} />
      <path d="M62.82 122.65c.39-8.56 6.08-14.16 12.69-14.16 6.26 0 11.1 6.39 11.28 14.33.17-8.88-5.13-15.99-12.05-15.99s-13.14 6.05-13.56 15.2c-.42 9.15 4.97 13.83 12.04 13.83h.52c-6.44-.16-11.3-4.79-10.91-13.2Zm90.48 0c-.39-8.56-6.08-14.16-12.69-14.16-6.26 0-11.1 6.39-11.28 14.33-.17-8.88 5.13-15.99 12.05-15.99 7.07 0 13.14 6.05 13.56 15.2.42 9.15-4.97 13.83-12.04 13.83h-.52c6.44-.16 11.3-4.79 10.91-13.2Z" fill="#842123" />
    </svg>
  );
}

export function InstagramIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function TikTokIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

export function YouTubeIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function WebIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function PinterestIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.171-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.257-.401.156-1.492-.693-2.424-2.875-2.424-4.627 0-3.769 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.374l-.744 2.84c-.269 1.046-1.002 2.352-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

export function BlueskyIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 568 501" fill="currentColor" className={className}>
      <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.25 122.39-166.444-30.69-189.333-88.64-22.889 57.95-70.083 211.03-189.333 88.64-63.111-64.76-33.889-129.52 80.986-149.07-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.66 0 75.293 0 57.947 0-28.906 76.134-1.612 123.121 33.664Z" />
    </svg>
  );
}

export function ThreadsIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 192 192" fill="currentColor" className={className}>
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.3813 72.8256C80.7845 64.6309 88.7539 61.129 97.2435 61.129C97.3204 61.129 97.398 61.129 97.4764 61.1297C110.155 61.2107 119.559 70.2678 121.258 87.1664C114.774 86.817 107.828 86.974 100.479 87.6749C72.0461 90.3842 54.4921 106.49 54.4921 127.322C54.4921 148.064 71.9542 163.639 93.9926 163.639C109.845 163.639 123.003 155.617 129.567 141.748C134.808 152.923 144.331 159.049 157.915 159.049C168.049 159.049 176.711 154.512 182.593 146.425C189.654 136.717 192 122.951 192 105.748C192 84.7774 185.127 67.5913 172.584 55.4957C157.481 40.9304 135.539 32.8687 106.82 32.8687C73.3087 32.8687 46.5414 43.8344 28.5137 64.5575C10.6384 85.1054 1.3418 114.496 1.3418 151.053H18.7301C18.7301 118.847 26.6853 93.9535 41.2721 76.7327C55.6888 59.7115 77.4984 50.2574 106.82 50.2574C130.635 50.2574 148.515 56.8856 160.706 68.636C170.835 78.3965 174.611 91.0772 174.611 105.748C174.611 120.316 172.766 129.743 168.498 135.61C165.26 140.061 160.841 141.66 157.915 141.66C148.653 141.66 142.361 133.727 142.361 113.882V110.222C142.361 99.4144 142.062 93.9463 141.537 88.9883ZM124.629 123.633C121.218 136.758 110.155 146.251 93.9926 146.251C80.8932 146.251 71.8806 136.879 71.8806 123.49C71.8806 109.845 81.3323 99.6459 99.6015 97.9042C106.634 97.2343 113.125 97.0279 119.043 97.3204C122.392 108.974 123.774 117.818 124.629 123.633Z" />
    </svg>
  );
}

export function EditPencilIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

export function PlatformIcon({
  platform,
  className = 'size-4.5'
}: {
  platform: PlatformType;
  className?: string;
}) {
  switch (platform) {
    case 'twitter':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20 shadow-xs">
          <TwitterIcon className="size-2.5" />
        </span>
      );
    case 'reddit':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/20 shadow-xs">
          <RedditIcon className="size-full" />
        </span>
      );
    case 'instagram':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white ring-1 ring-white/20 shadow-xs">
          <InstagramIcon className="size-2.5" />
        </span>
      );
    case 'tiktok':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20 shadow-xs">
          <TikTokIcon className="size-2.5" />
        </span>
      );
    case 'youtube':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white ring-1 ring-white/20 shadow-xs">
          <YouTubeIcon className="size-2.5" />
        </span>
      );
    case 'pinterest':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#E60023] text-white ring-1 ring-white/20 shadow-xs">
          <PinterestIcon className="size-2.5" />
        </span>
      );
    case 'bluesky':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#1185FE] text-white ring-1 ring-white/20 shadow-xs">
          <BlueskyIcon className="size-2.5" />
        </span>
      );
    case 'threads':
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-black text-white ring-1 ring-white/20 shadow-xs">
          <ThreadsIcon className="size-2.5" />
        </span>
      );
    case 'web':
    default:
      return (
        <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-neutral-200 ring-1 ring-white/15 shadow-xs">
          <WebIcon className="size-2.5" />
        </span>
      );
  }
}

// 7. Tag Dot Badge
export function TagDot({ color = 'blue' }: { color: TagColor }) {
  const colorMap: Record<TagColor, string> = {
    violet: 'bg-neutral-400',
    amber: 'bg-amber-400',
    teal: 'bg-teal-400',
    green: 'bg-emerald-400',
    indigo: 'bg-neutral-300',
    orange: 'bg-orange-400',
    pink: 'bg-neutral-400',
    blue: 'bg-neutral-300',
    cyan: 'bg-teal-400',
    red: 'bg-rose-400'
  };

  return <span className={`size-2 shrink-0 rounded-full ${colorMap[color] || 'bg-neutral-400'}`} />;
}

export function Activity({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function Terminal({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

export function AlertTriangle({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function CheckCircle2({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function XCircle({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
