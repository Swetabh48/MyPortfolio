import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, useAnimations, useGLTF } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import type { Bone, Group } from 'three';
import { Gift, X } from 'lucide-react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MODEL_URL = '/models/casual-character.glb';
useGLTF.preload(MODEL_URL);

export type Mood = 'intro' | 'work' | 'experience' | 'about' | 'skills' | 'proof' | 'contact';

const REACT_EVENT = 'portfolio:character-react';

type Reaction =
  | { kind: 'greet' }
  | { kind: 'pet' }
  | { kind: 'focus'; label: string }
  | { kind: 'surprise' };

/** Feet rest exactly here so the character never appears to float. */
const GROUND_Y = -0.95;

const moodAnchors: Record<Mood, number> = {
  intro: 0.9,
  work: 1.95,
  experience: -1.05,
  about: 1.0,
  skills: -0.6,
  proof: 0.95,
  contact: 0.1,
};

/** Where the visitor's attention currently is, in normalised screen space. */
interface Focus {
  x: number;
  y: number;
  until: number;
}

interface SceneInput {
  mood: Mood;
  workSide: number;
  /** Extra yaw the visitor applies by dragging. */
  dragYawRef: RefObject<number>;
  /** Shared so ground shadow tracks the body. */
  bodyXRef: RefObject<number>;
  /** What the character should look at, set when a card is hovered. */
  focusRef: RefObject<Focus>;
  /** Companion position in CSS pixels, so the DOM layer can detect clicks on it. */
  companionScreenRef: RefObject<{ x: number; y: number }>;
  /**
   * The canvas is pointer-events:none, so R3F never receives pointer moves and
   * its own `state.pointer` stays at the origin. Feed it from the window instead.
   */
  pointerRef: RefObject<{ x: number; y: number }>;
}

function anchorFor(mood: Mood, workSide: number) {
  return mood === 'work' ? workSide * moodAnchors.work : moodAnchors[mood];
}

function emit(detail: Reaction) {
  window.dispatchEvent(new CustomEvent<Reaction>(REACT_EVENT, { detail }));
}

function SuitDetails() {
  return (
    <group>
      {/* White shirt front layered over the recolored navy torso. */}
      <mesh position={[0.012, 1.306, 0.205]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.145, 0.38]} />
        <meshStandardMaterial color="#f4f7fb" roughness={0.7} />
      </mesh>
      {/* Tailored lapels. */}
      <mesh position={[-0.075, 1.355, 0.218]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.07, 0.31, 0.018]} />
        <meshStandardMaterial color="#101827" roughness={0.62} />
      </mesh>
      <mesh position={[0.098, 1.355, 0.218]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[0.07, 0.31, 0.018]} />
        <meshStandardMaterial color="#101827" roughness={0.62} />
      </mesh>
      {/* Tie and knot. */}
      <mesh position={[0.012, 1.315, 0.232]}>
        <boxGeometry args={[0.035, 0.255, 0.018]} />
        <meshStandardMaterial color="#162f57" roughness={0.5} />
      </mesh>
      <mesh position={[0.012, 1.455, 0.234]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.045, 0.02]} />
        <meshStandardMaterial color="#1d4a80" roughness={0.48} />
      </mesh>
      {/* Jacket buttons. */}
      {[1.23, 1.15].map((y) => (
        <mesh key={y} position={[0.012, y, 0.232]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
          <meshStandardMaterial color="#8aa5c5" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function Character({ mood, workSide, dragYawRef, bodyXRef, focusRef, pointerRef }: SceneInput) {
  const root = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const model = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { actions, names } = useAnimations(animations, root);

  const cursor = useRef(new THREE.Vector2());
  const baseClip = useRef<string | null>(null);
  const oneShot = useRef<{ action: THREE.AnimationAction } | null>(null);
  const aim = useRef(new THREE.Vector2());
  const nextIdleBreak = useRef(0);
  const settledIdle = useRef<string | null>(null);
  const phoneRef = useRef<THREE.Mesh | null>(null);
  const phoneUntil = useRef(0);
  const danceUntil = useRef(0);
  const danceStep = useRef(0);
  const leftArmRef = useRef<Bone | null>(null);
  const rightArmRef = useRef<Bone | null>(null);
  const pointTarget = useRef(new THREE.Vector3());
  const pointDirection = useRef(new THREE.Vector3());
  const parentQuaternion = useRef(new THREE.Quaternion());
  const pointQuaternion = useRef(new THREE.Quaternion());
  const boneAxis = useRef(new THREE.Vector3(0, 1, 0));

  const clipName = useCallback(
    (matcher: RegExp) => names.find((name) => matcher.test(name)),
    [names],
  );

  const idleNames = useMemo(() => {
    const pool = [clipName(/Idle_Neutral/i)].filter(
      (name): name is string => Boolean(name),
    );
    return pool.length > 0 ? pool : [names[0]];
  }, [clipName, names]);
  const walkName = useMemo(() => clipName(/Walk/i), [clipName]);
  const danceClips = useMemo(
    () =>
      [
        clipName(/Wave/i),
        clipName(/Kick_Left/i),
        clipName(/Kick_Right/i),
        clipName(/Wave/i),
        clipName(/Punch_Left/i),
        clipName(/Kick_Right/i),
      ].filter((name): name is string => Boolean(name)),
    [clipName],
  );

  /** The head bone is driven on top of the clip so he can watch the visitor. */
  const headBoneRef = useRef<Bone | null>(null);
  const headRestRef = useRef<THREE.Euler | null>(null);

  useEffect(() => {
    let found: Bone | null = null;
    model.traverse((node) => {
      if (found || !(node as Bone).isBone) return;
      if (/head/i.test(node.name) && !/end|top|nub/i.test(node.name)) found = node as Bone;
    });
    headBoneRef.current = found;
    leftArmRef.current = model.getObjectByName('UpperArmL') as Bone | null;
    rightArmRef.current = model.getObjectByName('UpperArmR') as Bone | null;
    // Captured before the mixer runs, since idle clips carry no head track and a
    // relative offset would compound every frame.
    headRestRef.current = found ? (found as Bone).rotation.clone() : null;
  }, [model]);

  useEffect(() => {
    model.traverse((node) => {
      if (!(node as THREE.Mesh).isMesh) return;
      const mesh = node as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const styledMaterials = materials.map((source) => {
        const material = source.clone() as THREE.MeshStandardMaterial;
        if (/Casual2_Body_1/i.test(mesh.name)) {
          material.color.set('#101827');
          material.roughness = 0.62;
        }
        if (/Casual2_Legs/i.test(mesh.name)) {
          material.color.set('#171d27');
          material.roughness = 0.72;
        }
        if (/Casual2_Feet/i.test(mesh.name)) {
          material.color.set('#090d14');
          material.roughness = 0.4;
        }
        return material;
      });
      mesh.material = styledMaterials.length === 1 ? styledMaterials[0] : styledMaterials;
    });

    const wrist = model.getObjectByName('WristR');
    if (!wrist) return;
    const geometry = new THREE.BoxGeometry(0.00062, 0.00108, 0.00012);
    const material = new THREE.MeshStandardMaterial({
      color: '#05070b',
      metalness: 0.65,
      roughness: 0.24,
      emissive: '#38bdf8',
      emissiveIntensity: 0.08,
    });
    const phone = new THREE.Mesh(geometry, material);
    phone.position.set(0.00042, 0.00072, 0.00036);
    phone.rotation.set(0.25, 0.15, -0.12);
    phone.visible = false;
    wrist.add(phone);
    phoneRef.current = phone;

    return () => {
      wrist.remove(phone);
      geometry.dispose();
      material.dispose();
      phoneRef.current = null;
    };
  }, [model]);

  /** Looping base pose: idle when settled, walk while travelling between chapters. */
  const setBase = useCallback(
    (name: string | undefined) => {
      if (!name || !actions[name] || baseClip.current === name) return;

      const next = actions[name];
      const previous = baseClip.current ? actions[baseClip.current] : undefined;

      next.reset();
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.fadeIn(0.4).play();
      previous?.fadeOut(0.4);
      baseClip.current = name;
    },
    [actions],
  );

  useEffect(() => {
    settledIdle.current = idleNames[0];
    setBase(idleNames[0]);
  }, [idleNames, setBase]);

  /** One-shot gesture that always hands control back to the looping base. */
  const playReaction = useCallback(
    (matcher: RegExp, options?: { force?: boolean; timeScale?: number }) => {
      const name = clipName(matcher);
      const action = name ? actions[name] : undefined;
      if (!name || !action) return;
      if (oneShot.current && !options?.force) return;

      if (oneShot.current) oneShot.current.action.fadeOut(0.12);

      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.setEffectiveTimeScale(options?.timeScale ?? 1);
      action.fadeIn(0.14).play();

      if (baseClip.current) actions[baseClip.current]?.fadeOut(0.14);
      oneShot.current = { action };
    },
    [actions, clipName],
  );

  const playDanceStep = useCallback(() => {
    if (danceClips.length === 0) return;
    const name = danceClips[danceStep.current % danceClips.length];
    const action = actions[name];
    if (!action) return;

    if (oneShot.current) oneShot.current.action.fadeOut(0.1);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.setEffectiveTimeScale(1.15);
    action.fadeIn(0.1).play();
    if (baseClip.current) actions[baseClip.current]?.fadeOut(0.1);
    oneShot.current = { action };
    danceStep.current += 1;
  }, [actions, danceClips]);

  const startDance = useCallback(
    (durationMs = 5000) => {
      danceUntil.current = performance.now() + durationMs;
      danceStep.current = 0;
      nextIdleBreak.current = performance.now() + durationMs + 8000;
      playDanceStep();
    },
    [playDanceStep],
  );

  useEffect(() => {
    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<Reaction>).detail;
      if (detail.kind === 'surprise') {
        startDance(5000);
        return;
      }
      if (detail.kind === 'greet') playReaction(/Wave/i);
      if (detail.kind === 'focus') playReaction(/Interact/i);
      nextIdleBreak.current = performance.now() + 9000;
    };
    window.addEventListener(REACT_EVENT, onReact);
    return () => window.removeEventListener(REACT_EVENT, onReact);
  }, [playReaction, startDance]);

  useFrame((state, delta) => {
    if (!root.current) return;
    const now = performance.now();
    const pointer = pointerRef.current;
    const dancing = now < danceUntil.current;
    const checkingPhone = !dancing && now < phoneUntil.current;
    if (phoneRef.current) phoneRef.current.visible = checkingPhone;

    // Retire a finished gesture instead of freezing on its last frame.
    const active = oneShot.current;
    if (active) {
      const clip = active.action.getClip();
      if (!active.action.isRunning() || active.action.time >= clip.duration - 0.06) {
        active.action.fadeOut(0.16);
        oneShot.current = null;
        if (dancing) {
          playDanceStep();
        } else {
          const base = baseClip.current ? actions[baseClip.current] : undefined;
          base?.reset().fadeIn(0.26).play();
        }
      }
    }

    cursor.current.x = THREE.MathUtils.lerp(cursor.current.x, pointer.x, 0.06);
    cursor.current.y = THREE.MathUtils.lerp(cursor.current.y, pointer.y, 0.06);

    const focus = focusRef.current;
    const focused = Boolean(focus) && now < focus.until && !dancing;

    const anchor = anchorFor(mood, workSide);
    const targetX = anchor + cursor.current.x * 0.16;
    const previousX = root.current.position.x;
    root.current.position.x = THREE.MathUtils.damp(previousX, targetX, 2.4, delta);
    // Light hop while celebrating so the chained kicks/waves read as a dance.
    root.current.position.y = dancing
      ? GROUND_Y + Math.abs(Math.sin(now * 0.014)) * 0.09
      : GROUND_Y;
    bodyXRef.current = root.current.position.x;

    const travel = (root.current.position.x - previousX) / Math.max(delta, 0.0001);
    // Measured against the anchor, so cursor sway never reads as travelling.
    const walking = !dancing && Math.abs(anchor - root.current.position.x) > 0.35;

    if (!oneShot.current && !dancing) {
      setBase(walking && walkName ? walkName : settledIdle.current ?? idleNames[0]);
    }

    // A restrained phone-check break: play the rig's Interact clip and reveal a
    // phone attached to the animated wrist. Neutral idle remains the only loop.
    if (!dancing && !walking && !oneShot.current && now > nextIdleBreak.current) {
      if (nextIdleBreak.current !== 0) {
        phoneUntil.current = now + 1250;
        playReaction(/Interact/i);
      }
      nextIdleBreak.current = now + 11000 + Math.random() * 5000;
    }

    // Aim at the hovered card when there is one, otherwise at the pointer.
    const aimX = focused ? focus.x : cursor.current.x;
    const aimY = focused ? focus.y : cursor.current.y;
    aim.current.x = THREE.MathUtils.damp(aim.current.x, aimX, 4, delta);
    aim.current.y = THREE.MathUtils.damp(aim.current.y, aimY, 4, delta);

    // Clamped so he angles toward the visitor without ever turning his back.
    const attention = THREE.MathUtils.clamp(
      -0.2 + aim.current.x * (focused ? 0.7 : 0.42),
      -0.62,
      0.62,
    );
    const facing = dancing
      ? root.current.rotation.y + delta * 2.4
      : walking
        ? Math.sign(travel) * 1.32
        : attention + (dragYawRef.current ?? 0);
    root.current.rotation.y = dancing
      ? facing
      : THREE.MathUtils.damp(root.current.rotation.y, facing, 3.4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      dancing ? Math.sin(now * 0.01) * 0.08 : -aim.current.y * 0.05,
      4,
      delta,
    );

    // Written after the mixer has posed the skeleton for this frame.
    const head = headBoneRef.current;
    const rest = headRestRef.current;
    if (head && rest && !walking && (!oneShot.current || checkingPhone)) {
      head.rotation.set(
        rest.x + (checkingPhone ? 0.24 : THREE.MathUtils.clamp(aim.current.y * 0.2, -0.2, 0.2)),
        rest.y + THREE.MathUtils.clamp(aim.current.x * 0.38, -0.38, 0.38),
        rest.z,
      );
    }

    // Point toward the hovered project with the arm nearest that side.
    // The model's arm bones extend along local +Y, so align that axis with
    // the hovered card's world-space direction after the mixer poses the rig.
    if (focused && !walking && !oneShot.current) {
      const arm = focus.x < 0 ? leftArmRef.current : rightArmRef.current;
      if (arm?.parent) {
        pointTarget.current.set(focus.x, focus.y, 0.25).unproject(state.camera);
        arm.getWorldPosition(pointDirection.current);
        pointDirection.current.subVectors(pointTarget.current, pointDirection.current).normalize();
        arm.parent.getWorldQuaternion(parentQuaternion.current).invert();
        pointDirection.current.applyQuaternion(parentQuaternion.current).normalize();
        pointQuaternion.current.setFromUnitVectors(boneAxis.current, pointDirection.current);
        arm.quaternion.slerp(pointQuaternion.current, 0.12);
      }
    }
  });

  return (
    <group
      ref={root}
      position={[moodAnchors.intro, GROUND_Y, 0]}
      scale={mood === 'work' ? 0.76 : 0.92}
    >
      <primitive object={model} />
      <SuitDetails />
    </group>
  );
}

function Companion({
  mood,
  workSide,
  bodyXRef,
  focusRef,
  companionScreenRef,
  pointerRef,
}: SceneInput) {
  const root = useRef<Group>(null);
  const face = useRef<Group>(null);
  const pulse = useRef(0);
  const spin = useRef(0);
  const petted = useRef(0);
  const world = useRef(new THREE.Vector3());

  useEffect(() => {
    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<Reaction>).detail;
      if (detail.kind === 'pet') {
        petted.current = 1;
        pulse.current = 1.5;
        spin.current = 2;
        return;
      }
      pulse.current = 1;
      spin.current = 1;
    };
    window.addEventListener(REACT_EVENT, onReact);
    return () => window.removeEventListener(REACT_EVENT, onReact);
  }, []);

  useFrame((state, delta) => {
    if (!root.current) return;

    const time = state.clock.elapsedTime;
    const now = performance.now();
    const pointer = pointerRef.current;
    const excited = pulse.current > 0.08;
    const orbit = time * (excited ? 2.1 : 0.55);

    const focus = focusRef.current;
    const focused = Boolean(focus) && now < focus.until;

    // Hover beside the body, then drift toward whatever the visitor is looking at.
    const anchorX = bodyXRef.current ?? anchorFor(mood, workSide);
    const drift = focused ? focus.x * 0.9 : pointer.x * 0.4;
    const targetX = anchorX + Math.cos(orbit) * 0.5 + drift;
    const targetY = GROUND_Y + 1.16 + Math.sin(orbit * 1.2) * 0.16 + pointer.y * 0.2;

    root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 3.4, delta);
    root.current.position.y = THREE.MathUtils.damp(root.current.position.y, targetY, 3.4, delta);
    root.current.position.z = -0.15 + Math.sin(orbit) * 0.14;

    spin.current = Math.max(0, spin.current - delta * 1.15);
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointer.x * 0.5 + spin.current * Math.PI * 2,
      6,
      delta,
    );

    pulse.current = Math.max(0, pulse.current - delta * 1.6);
    petted.current = Math.max(0, petted.current - delta * 0.5);
    const squash = 1 + Math.sin(Math.min(pulse.current, 1) * Math.PI) * 0.3;
    root.current.scale.set(0.7 / squash, 0.7 * squash, 0.7 / squash);

    if (face.current) {
      // Squeeze the eyes shut while being petted, otherwise blink occasionally.
      const blink = petted.current > 0.1 || Math.sin(time * 1.6) > 0.98 ? 0.14 : 1;
      face.current.scale.y = THREE.MathUtils.lerp(face.current.scale.y, blink, 0.3);
      face.current.rotation.z = pointer.x * -0.09;
    }

    root.current.getWorldPosition(world.current);
    world.current.project(state.camera);
    companionScreenRef.current.x = (world.current.x * 0.5 + 0.5) * state.size.width;
    companionScreenRef.current.y = (-world.current.y * 0.5 + 0.5) * state.size.height;
  });

  return (
    <group ref={root} position={[1.5, GROUND_Y + 1.16, -0.15]} scale={0.7}>
      <mesh castShadow>
        <sphereGeometry args={[0.22, 32, 24]} />
        <meshStandardMaterial
          color="#e2fbff"
          emissive="#67e8f9"
          emissiveIntensity={0.28}
          metalness={0.18}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, -0.02, 0.201]}>
        <circleGeometry args={[0.142, 32]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#0891b2" emissiveIntensity={0.22} />
      </mesh>
      <group ref={face} position={[0, 0.02, 0.226]}>
        <mesh position={[-0.052, 0.024, 0]}>
          <sphereGeometry args={[0.023, 16, 12]} />
          <meshBasicMaterial color="#07101a" />
        </mesh>
        <mesh position={[0.052, 0.024, 0]}>
          <sphereGeometry args={[0.023, 16, 12]} />
          <meshBasicMaterial color="#07101a" />
        </mesh>
        <mesh position={[0, -0.046, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.037, 0.008, 10, 24, Math.PI]} />
          <meshBasicMaterial color="#07101a" />
        </mesh>
      </group>
      <mesh position={[-0.215, 0.02, 0]} rotation={[0, 0, -0.62]}>
        <capsuleGeometry args={[0.033, 0.12, 6, 12]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#6366f1" emissiveIntensity={0.34} />
      </mesh>
      <mesh position={[0.215, 0.02, 0]} rotation={[0, 0, 0.62]}>
        <capsuleGeometry args={[0.033, 0.12, 6, 12]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#6366f1" emissiveIntensity={0.34} />
      </mesh>
    </group>
  );
}

function GroundShadow({ bodyXRef }: { bodyXRef: RefObject<number> }) {
  const holder = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!holder.current) return;
    holder.current.position.x = THREE.MathUtils.damp(
      holder.current.position.x,
      bodyXRef.current ?? 0,
      3,
      delta,
    );
  });

  return (
    <group ref={holder}>
      <ContactShadows
        position={[0, GROUND_Y + 0.005, 0]}
        scale={2.6}
        opacity={0.78}
        blur={1.9}
        far={2.4}
        resolution={512}
      />
    </group>
  );
}

function KineticForms({ pointerRef }: { pointerRef: RefObject<{ x: number; y: number }> }) {
  const forms = useRef<Group>(null);

  useFrame(() => {
    if (!forms.current) return;
    const progress =
      window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    forms.current.rotation.z = progress * Math.PI * 1.6;
    forms.current.rotation.y = pointerRef.current.x * 0.12;
  });

  return (
    <group ref={forms}>
      <mesh position={[0.65, 0.05, -3.6]} rotation={[0.9, 0.15, 0.06]}>
        <torusGeometry args={[1.75, 0.006, 12, 180]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0ea5e9"
          emissiveIntensity={0.1}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-1.55, 0.72, -2.9]} rotation={[0.2, 0.6, 0.25]}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color="#a5b4fc"
          emissive="#6366f1"
          emissiveIntensity={0.22}
          wireframe
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene(props: SceneInput) {
  return (
    <>
      <ambientLight intensity={0.56} />
      <directionalLight position={[3, 4.2, 3]} intensity={1.45} castShadow />
      <pointLight position={[-3, 1, 2]} intensity={8} distance={8} color="#67e8f9" />
      <pointLight position={[3, 1, -1]} intensity={6} distance={8} color="#818cf8" />
      <Environment preset="city" />
      <Character {...props} />
      <Companion {...props} />
      <GroundShadow bodyXRef={props.bodyXRef} />
      <KineticForms pointerRef={props.pointerRef} />
    </>
  );
}

const moodLines: Record<Mood, string[]> = {
  intro: ['Welcome — take a look around.', 'Start wherever you like.'],
  work: ['Six builds, one standard.', 'Shipped, not theoretical.', 'Depth over volume.'],
  experience: [
    'Built under real constraints.',
    'Production, not prototypes.',
    'Ambiguity is part of the job.',
  ],
  about: ['The thinking behind the work.', 'Clarity is the whole craft.'],
  skills: ['Tools change, judgment compounds.', 'Chosen per problem.'],
  proof: ['Sharpened under pressure.', 'Consistency, measured.'],
  contact: ['Open to the right team.', 'Let’s build something useful.'],
};

const greetLines = [
  'Good to meet you.',
  'Thanks for stopping by.',
  'Hello there.',
  'Glad you came.',
];

const petLines = [
  'It likes you.',
  'Say hello back.',
  'Careful, it gets attached.',
  'That one is friendly.',
];

const surpriseLines = [
  'Five-second dance break.',
  'You found the party button.',
  'Curiosity unlocked — let’s move.',
];

const focusLines = [
  (label: string) => `${label} — worth a look.`,
  (label: string) => `Ask me about ${label}.`,
  () => 'Real users hit this one.',
  () => 'That one took a while.',
];

/** Avoids repeating the previous line from a pool. */
function pickLine(pool: string[], previous: string) {
  const options = pool.filter((line) => line !== previous);
  const source = options.length > 0 ? options : pool;
  return source[Math.floor(Math.random() * source.length)];
}

export function ScrollWorld() {
  const { disableHeavy3D } = useReducedMotion();
  const [mood, setMood] = useState<Mood>('intro');
  const [workSide, setWorkSide] = useState(1);
  const [message, setMessage] = useState({ text: '', visible: false });
  const [giftOpen, setGiftOpen] = useState(false);

  const dragYawRef = useRef(0);
  const bodyXRef = useRef(moodAnchors.intro);
  const focusRef = useRef<Focus>({ x: 0, y: 0, until: 0 });
  const companionScreenRef = useRef({ x: -999, y: -999 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const orbHitRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const lastLine = useRef('');

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const say = useCallback((text: string, hold: number) => {
    lastLine.current = text;
    setMessage({ text, visible: true });
    return window.setTimeout(
      () => setMessage((current) => ({ ...current, visible: false })),
      hold,
    );
  }, []);

  useEffect(() => {
    const chapters: Array<{ selector: string; mood: Mood }> = [
      { selector: '#hero', mood: 'intro' },
      { selector: '#featured', mood: 'work' },
      { selector: '#experience', mood: 'experience' },
      { selector: '#about', mood: 'about' },
      { selector: '#skills', mood: 'skills' },
      {
        selector: '#coding, #achievements, #education, #responsibility, #extracurricular, #projects',
        mood: 'proof',
      },
      { selector: '#contact', mood: 'contact' },
    ];

    const update = () => {
      const center = window.innerHeight * 0.5;
      let closest = { distance: Number.POSITIVE_INFINITY, mood: 'intro' as Mood };

      chapters.forEach((chapter) => {
        document.querySelectorAll<HTMLElement>(chapter.selector).forEach((element) => {
          const rect = element.getBoundingClientRect();
          const distance =
            rect.top <= center && rect.bottom >= center
              ? 0
              : Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center));
          if (distance < closest.distance) closest = { distance, mood: chapter.mood };
        });
      });
      setMood(closest.mood);

      const cards = Array.from(document.querySelectorAll<HTMLElement>('.project-story'));
      if (cards.length > 0) {
        const active = cards.reduce((nearest, card) => {
          const a = nearest.getBoundingClientRect();
          const b = card.getBoundingClientRect();
          return Math.abs(b.top + b.height / 2 - center) < Math.abs(a.top + a.height / 2 - center)
            ? card
            : nearest;
        });
        const rect = active.getBoundingClientRect();
        setWorkSide(rect.left + rect.width / 2 < window.innerWidth / 2 ? 1 : -1);
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const timer = say(pickLine(moodLines[mood], lastLine.current), 2600);
    return () => window.clearTimeout(timer);
  }, [mood, say]);

  useEffect(() => {
    let timer: number | undefined;
    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<Reaction>).detail;
      let text: string;

      if (detail.kind === 'greet') text = pickLine(greetLines, lastLine.current);
      else if (detail.kind === 'pet') text = pickLine(petLines, lastLine.current);
      else if (detail.kind === 'surprise') {
        text = pickLine(surpriseLines, lastLine.current);
      } else {
        text = pickLine(
          focusLines.map((line) => line(detail.label)),
          lastLine.current,
        );
      }

      window.clearTimeout(timer);
      timer = say(text, 2200);
    };
    window.addEventListener(REACT_EVENT, onReact);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(REACT_EVENT, onReact);
    };
  }, [say]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'g') return;
      setGiftOpen(true);
      emit({ kind: 'surprise' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /** Hovering a project card makes both characters turn and look at it. */
  useEffect(() => {
    let cooldown = 0;

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const card = target?.closest('.project-story');
      const previous = event.relatedTarget as Node | null;
      if (!card || (previous && card.contains(previous))) return;

      const rect = card.getBoundingClientRect();
      focusRef.current = {
        x: THREE.MathUtils.clamp(
          ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1,
          -1,
          1,
        ),
        y: THREE.MathUtils.clamp(
          -(((rect.top + rect.height / 2) / window.innerHeight) * 2 - 1),
          -1,
          1,
        ),
        until: performance.now() + 3200,
      };

      const now = performance.now();
      if (now - cooldown < 5200) return;
      cooldown = now;
      emit({ kind: 'focus', label: card.querySelector('h3')?.textContent ?? 'This one' });
    };

    document.addEventListener('pointerover', onPointerOver);
    return () => document.removeEventListener('pointerover', onPointerOver);
  }, []);

  /** A press is a drag if the pointer travels, otherwise it is a greeting. */
  useEffect(() => {
    let active = false;
    let originX = 0;
    let originY = 0;
    let originYaw = 0;
    let travelled = 0;

    const onDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('a, button, input, textarea')) return;
      active = true;
      travelled = 0;
      originX = event.clientX;
      originY = event.clientY;
      originYaw = dragYawRef.current;
    };

    const onMove = (event: PointerEvent) => {
      if (!active) return;
      travelled = Math.hypot(event.clientX - originX, event.clientY - originY);
      const delta = (event.clientX - originX) / window.innerWidth;
      dragYawRef.current = THREE.MathUtils.clamp(originYaw + delta * Math.PI * 1.6, -2.4, 2.4);
    };

    const onUp = () => {
      if (!active) return;
      active = false;
      if (travelled <= 8) emit({ kind: 'greet' });
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  /** Keeps the companion's clickable area glued to where it is drawn. */
  useEffect(() => {
    let id = 0;
    const track = () => {
      const node = orbHitRef.current;
      const bubble = bubbleRef.current;
      if (node) {
        const { x, y } = companionScreenRef.current;
        node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        if (bubble) {
          const bubbleX = x > window.innerWidth / 2 ? x - 250 : x + 52;
          bubble.style.transform = `translate3d(${bubbleX}px, ${y - 88}px, 0)`;
        }
      }
      id = requestAnimationFrame(track);
    };
    id = requestAnimationFrame(track);
    return () => cancelAnimationFrame(id);
  }, []);

  if (disableHeavy3D) return null;

  const world = (
    <div
      className="fixed inset-0 z-[2] hidden pointer-events-none md:block"
      aria-hidden="true"
      data-scene-mood={mood}
      data-work-side={workSide}
    >
      <Canvas
        shadows
        camera={{ position: [0.4, 0.5, 4.9], fov: 31, near: 0.1, far: 40 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene
            mood={mood}
            workSide={workSide}
            dragYawRef={dragYawRef}
            bodyXRef={bodyXRef}
            focusRef={focusRef}
            companionScreenRef={companionScreenRef}
            pointerRef={pointerRef}
          />
        </Suspense>
      </Canvas>

    </div>
  );

  /* Page sections sit at z-10, so anything the visitor must see or click has to
     live in its own layer above them. */
  const overlay = (
    <div className="pointer-events-none fixed inset-0 z-[45] hidden md:block" data-character-ui>
      <button
        ref={orbHitRef}
        type="button"
        tabIndex={-1}
        data-cursor
        aria-label="Pet the companion"
        onClick={() => emit({ kind: 'pet' })}
        className="group pointer-events-auto absolute left-0 top-0 h-[78px] w-[78px] rounded-full border border-cyan-200/20 bg-cyan-200/[0.025] transition-colors hover:border-cyan-200/65 hover:bg-cyan-200/[0.08]"
      >
        <span className="absolute inset-2 animate-ping rounded-full border border-cyan-200/15 [animation-duration:2.4s]" />
        <span className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#080b12]/90 px-2 py-1 text-[8px] uppercase tracking-[0.2em] text-cyan-100/70 opacity-70 transition-opacity group-hover:opacity-100">
          Pet
        </span>
      </button>

      <div
        ref={bubbleRef}
        className={`absolute left-0 top-0 w-[220px] rounded-2xl border border-white/10 bg-[#080b12]/92 px-4 py-3 text-xs leading-relaxed text-slate-200 shadow-2xl backdrop-blur-xl transition-opacity duration-300 ${
          message.visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="mr-2 text-cyan-300">●</span>
        {message.text}
      </div>

      <button
        type="button"
        data-cursor
        aria-label="Open a hidden surprise"
        onClick={() => {
          setGiftOpen(true);
          emit({ kind: 'surprise' });
        }}
        className="group pointer-events-auto absolute bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#080b12]/82 text-white/45 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-cyan-200/45 hover:text-cyan-100"
      >
        <span className="absolute inset-0 animate-ping rounded-full border border-cyan-200/10 [animation-duration:3s]" />
        <Gift className="h-4 w-4" />
        <span className="pointer-events-none absolute bottom-[calc(100%+8px)] right-0 whitespace-nowrap rounded-full border border-white/10 bg-[#080b12]/90 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/55 opacity-0 transition-opacity group-hover:opacity-100">
          Something for the curious
        </span>
      </button>

      {giftOpen && (
        <>
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            {Array.from({ length: 18 }, (_, index) => (
              <span
                key={index}
                className="gift-confetti absolute h-2 w-1 rounded-full"
                style={{
                  left: `${52 + ((index * 17) % 43)}%`,
                  top: `${42 + ((index * 11) % 28)}%`,
                  backgroundColor: ['#67e8f9', '#818cf8', '#f8fafc', '#34d399'][index % 4],
                  animationDelay: `${(index % 6) * 70}ms`,
                  '--gift-x': `${(index % 2 === 0 ? 1 : -1) * (60 + (index % 5) * 24)}px`,
                } as CSSProperties}
              />
            ))}
          </div>
          <div className="pointer-events-auto absolute bottom-24 right-8 w-[310px] overflow-hidden rounded-3xl border border-cyan-200/20 bg-[#080b12]/94 shadow-[0_30px_100px_rgba(8,145,178,0.22)] backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <span className="text-[9px] uppercase tracking-[0.22em] text-cyan-200/70">
                Curiosity unlocked
              </span>
              <button
                type="button"
                aria-label="Close surprise"
                onClick={() => setGiftOpen(false)}
                className="rounded-full p-1.5 text-white/35 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="p-5">
              <p className="display-title text-xl text-white">You found the hidden layer.</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                Gift unlocked — the character dances for five seconds while the companion
                celebrates. Press G anytime to replay the moment.
              </p>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <span className="text-[9px] uppercase tracking-[0.16em] text-white/40">
                  Replay dance anytime
                </span>
                <kbd className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-cyan-200">
                  G
                </kbd>
              </div>
              <button
                type="button"
                onClick={() => emit({ kind: 'surprise' })}
                className="mt-3 w-full rounded-xl border border-cyan-200/20 bg-cyan-200/[0.06] px-3 py-2.5 text-[9px] uppercase tracking-[0.16em] text-cyan-100 transition-colors hover:bg-cyan-200/[0.12]"
              >
                Dance again
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {world}
      {overlay}
    </>
  );
}
