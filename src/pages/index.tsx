import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react';
import { basePath } from '../../next.config';

const BASE_PATH = basePath ? basePath : '';

const inter = Inter({ subsets: ['latin'] })

class Touch {
  id: number;
  x: number;
  y: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}
type TouchCollection = {
  [key in number]: Touch;
};

interface TouchMarkerProps {
  touch: Touch
}

function TouchMarker({ touch }: TouchMarkerProps) {
  const imageSize = 100;
  return (
    <div className='absolute' style={{ top: touch.y, left: touch.x }}>
      <Image
        src={`${BASE_PATH}/touch-marker.svg`}
        alt=''
        className='relative'
        style={{ top: -imageSize / 2, left: -imageSize / 2 }}
        width={imageSize}
        height={imageSize}
        priority
      />
    </div>
  )
}

export default function Home() {
  const [touches, setTouches] = useState<TouchCollection>({});

  function handleTouchStart(e: Event) {
    e.preventDefault();
    const touchEvent = e as TouchEvent;
    const changedTouches: TouchCollection = {};
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const t = touchEvent.changedTouches[i];
      changedTouches[t.identifier] = new Touch(t.identifier, t.pageX, t.pageY);
    }
    setTouches({ ...touches, ...changedTouches });
  }

  function handleTouchMove(e: Event) {
    e.preventDefault();
    const touchEvent = e as TouchEvent;
    const changedTouches: TouchCollection = {};
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const t = touchEvent.changedTouches[i];
      changedTouches[t.identifier] = new Touch(t.identifier, t.pageX, t.pageY);
    }
    setTouches({ ...touches, ...changedTouches });
  }

  function handleTouchEnd(e: Event) {
    e.preventDefault();
    const touchEvent = e as TouchEvent;
    const remainTouches = { ...touches };
    for (let i = 0; i < touchEvent.changedTouches.length; i++) {
      const t = touchEvent.changedTouches[i];
      delete remainTouches[t.identifier];
    }
    setTouches(remainTouches);
  }

  const touchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elem = touchRef.current;
    elem?.addEventListener('touchstart', handleTouchStart, { passive: false });
    elem?.addEventListener('touchmove', handleTouchMove, { passive: false });
    elem?.addEventListener('touchend', handleTouchEnd, { passive: false });
    elem?.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    return (() => {
      elem?.removeEventListener('touchstart', handleTouchStart);
      elem?.removeEventListener('touchmove', handleTouchMove);
      elem?.removeEventListener('touchend', handleTouchEnd);
      elem?.removeEventListener('touchcancel', handleTouchEnd);
    });
  });

  const touchMarkers = Object.values(touches).map((touch) =>
    <TouchMarker key={touch.id} touch={touch} />
  );

  return (
    <main
      className={`w-full h-screen ${inter.className}`}
    >
      <div>{touchMarkers}</div>
      <div className='w-full h-screen' ref={touchRef}></div>
    </main>
  )
}
