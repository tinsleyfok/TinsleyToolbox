import { useEffect, useRef, type RefObject } from "react";
import Matter from "matter-js";

const BUBBLE_COUNT = 8;
const MIN_RADIUS = 54;
const MAX_RADIUS = 66;
const GRAVITY = 0.8;
const RESTITUTION = 0.6;
const FRICTION = 0.01;
const FRICTION_AIR = 0.01;

interface UseBubblePhysicsOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  onSettled?: () => void;
}

export function useBubblePhysics({
  containerRef,
  onSettled,
}: UseBubblePhysicsOptions) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    const bubbleEls = container.querySelectorAll<HTMLDivElement>(".bubble");
    if (bubbleEls.length !== BUBBLE_COUNT) return;

    const { Engine, Runner, Bodies, Composite } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: GRAVITY },
      enableSleeping: true,
    });

    const world = engine.world;
    const bodies: Matter.Body[] = [];
    const radii: number[] = [];

    Composite.add(
      world,
      Bodies.rectangle(w / 2, h + 20, w + 100, 40, { isStatic: true })
    );
    Composite.add(world, [
      Bodies.rectangle(-20, h / 2, 40, h + 100, { isStatic: true }),
      Bodies.rectangle(w + 20, h / 2, 40, h + 100, { isStatic: true }),
    ]);

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const r = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
      radii.push(r);
      const x = r + Math.random() * (w - 2 * r);
      const y = -r * 2 - i * MAX_RADIUS * 2.5;
      const body = Bodies.circle(x, y, r, {
        restitution: RESTITUTION,
        friction: FRICTION,
        frictionAir: FRICTION_AIR,
        density: 0.004,
      });
      bodies.push(body);
      Composite.add(world, body);
    }

    for (let j = 0; j < BUBBLE_COUNT; j++) {
      const d = 2 * radii[j];
      bubbleEls[j].style.width = `${d}px`;
      bubbleEls[j].style.height = `${d}px`;
    }

    const runner = Runner.create();
    Runner.run(runner, engine);

    let settled = false;
    let showScheduled = false;
    let animId = 0;

    function showHeaderAndTitle() {
      if (settled) return;
      settled = true;
      onSettled?.();
    }

    function sync() {
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const b = bodies[i];
        const el = bubbleEls[i];
        const r = radii[i];
        el.style.transform = `translate(${b.position.x - r}px, ${b.position.y - r}px)`;
      }
      if (!settled) {
        const sleepCount = bodies.filter((b) => b.isSleeping).length;
        if (sleepCount === BUBBLE_COUNT) {
          showHeaderAndTitle();
        } else if (sleepCount >= BUBBLE_COUNT - 2 && !showScheduled) {
          showScheduled = true;
          setTimeout(showHeaderAndTitle);
        }
      }
      animId = requestAnimationFrame(sync);
    }
    animId = requestAnimationFrame(sync);

    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      Runner.stop(runner);
      Engine.clear(engine);
    };

    return () => {
      cleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
