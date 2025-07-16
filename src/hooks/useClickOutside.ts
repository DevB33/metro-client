import { useEffect, useRef } from 'react';

const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useClickOutside;

// export const useMouseUpOutside = (callback: () => void) => {
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         callback();
//       }
//     };

//     document.addEventListener('mouseup', handleClickOutside);
//     return () => {
//       document.removeEventListener('mouseup', handleClickOutside);
//     };
//   }, [callback]);

//   return ref;
// };
