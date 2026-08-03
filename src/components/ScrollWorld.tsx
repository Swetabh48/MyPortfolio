import { Canvas, useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { CSSProperties, RefObject } from 'react';
import type { Group } from 'three';
import { Gift, X } from 'lucide-react';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

const MODEL_URL = '/models/casual-character.glb?v=visible1';
useGLTF.preload(MODEL_URL);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    useGLTF.clear('/models/casual-character.glb');
    useGLTF.clear(MODEL_URL);
  });
}

/** Quaternius Casual2 — young character, recolored into a suit below. */
const MODEL_SCALE = 0.92;

/**
 * Desk monitor sits on the character's left (−X). Negative yaw faces −X;
 * the +0.55 bias turns him slightly toward the camera for a readable 3/4.
 */
const DESK_FACING = -Math.PI / 2 + 0.55;

export type Mood =
  | 'intro'
  | 'work'
  | 'building'
  | 'experience'
  | 'about'
  | 'skills'
  | 'proof'
  | 'contact';

const REACT_EVENT = 'portfolio:character-react';

type Reaction =
  | { kind: 'greet' }
  | { kind: 'pet' }
  | { kind: 'focus'; label: string }
  | { kind: 'surprise' };

/** Feet rest exactly here so the character never appears to float. */
const GROUND_Y = -0.95;
const DESK_X = 1.35;
/** Where the character's root lands when seated; the workstation is built around it. */
const SEAT_Z = 0.28;

/**
 * Where the wrists rest, as an offset from the seat: sideways from the spine, up from the
 * floor, forward toward the monitor. The desk group shares the seat's origin and yaw, so
 * these are directly comparable to the keyboard's own placement inside `CodingDesk`.
 */
const HAND_SPREAD = 0.12;
const HAND_HEIGHT = 0.69;
const HAND_FORWARD = 0.37;

const moodAnchors: Record<Mood, number> = {
  intro: 1.35,
  work: 1.95,
  building: DESK_X,
  experience: -1.05,
  about: 1.0,
  skills: -0.6,
  proof: 0.95,
  // Stay clear of the contact form on the right.
  contact: -1.85,
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

/**
 * Lapels / tie / buttons layered on the recolored navy torso. These are plain
 * meshes rather than skinned geometry, so the caller shifts the group to follow
 * the chest bone — otherwise they hang in the air whenever the character sits.
 */
function SuitDetails({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef}>
      {/* Shirt placket */}
      <mesh position={[0.012, 1.306, 0.205]}>
        <planeGeometry args={[0.145, 0.38]} />
        <meshBasicMaterial color="#f4f7fb" toneMapped={false} />
      </mesh>
      {/* Lapels */}
      <mesh position={[-0.075, 1.355, 0.218]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.07, 0.31, 0.018]} />
        <meshBasicMaterial color="#4b648f" toneMapped={false} />
      </mesh>
      <mesh position={[0.098, 1.355, 0.218]} rotation={[0, 0, 0.48]}>
        <boxGeometry args={[0.07, 0.31, 0.018]} />
        <meshBasicMaterial color="#4b648f" toneMapped={false} />
      </mesh>
      {/* Tie */}
      <mesh position={[0.012, 1.315, 0.232]}>
        <boxGeometry args={[0.035, 0.255, 0.018]} />
        <meshBasicMaterial color="#1e3f6e" toneMapped={false} />
      </mesh>
      <mesh position={[0.012, 1.455, 0.234]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.045, 0.045, 0.02]} />
        <meshBasicMaterial color="#2a5f9e" toneMapped={false} />
      </mesh>
      {[1.23, 1.15].map((y) => (
        <mesh key={y} position={[0.012, y, 0.232]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 16]} />
          <meshBasicMaterial color="#9bb6d4" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Quirk of this rig: FootL/FootR/PTL/PTR hang off `Root`, not off the shins, so
 * bending the legs alone leaves the feet planted and stretches the calves. Any
 * sit pose has to translate the feet itself, which is why rest offsets are kept.
 */
type SitLeg = {
  hip: THREE.Bone;
  knee: THREE.Bone;
  /** Foot plus its toe bone; both hang off Root and must be carried by hand. */
  ankle: THREE.Bone;
  toe: THREE.Bone | null;
};

/**
 * Segment lengths are rotation-invariant, so they can be sampled from any pose and
 * then used as hard constraints: aiming each bone instead of guessing Euler angles is
 * what keeps the limbs from stretching. Lengths are stored unscaled (root-local), and
 * the thigh doubles as the exact pelvis drop for a horizontal thigh. Ankle/toe rest
 * offsets stay in their own parent space.
 */
type SitRest = {
  thigh: number;
  shin: number;
  ankle: THREE.Vector3;
  toe: THREE.Vector3 | null;
  hipQuat: THREE.Quaternion;
  kneeQuat: THREE.Quaternion;
};

/**
 * Unlike the legs, the arms are a conventional chain (Chest → Shoulder → UpperArm →
 * LowerArm → Wrist), so aiming the two arm bones carries the hand and fingers along.
 */
type SitArm = {
  shoulder: THREE.Bone;
  upper: THREE.Bone;
  fore: THREE.Bone;
};

type ArmRest = {
  upper: number;
  fore: number;
  upperQuat: THREE.Quaternion;
  foreQuat: THREE.Quaternion;
};

type SitBones = {
  /** `Body` is the legs' parent here; `Hips` is their sibling, so the drop goes on Body. */
  pelvis: THREE.Bone | null;
  lean: THREE.Bone | null;
  legs: SitLeg[];
  arms: SitArm[];
  pelvisRest: THREE.Vector3 | null;
};

const scratchA = new THREE.Vector3();
const scratchC = new THREE.Vector3();
const scratchD = new THREE.Vector3();
/* Reserved for the sit solver so it never aliases the vectors aimBoneY uses. */
const solveTarget = new THREE.Vector3();
const solveAxis = new THREE.Vector3();
const solveRest = new THREE.Vector3();
const solveDelta = new THREE.Vector3();
const solvePoint = new THREE.Vector3();
const armShoulder = new THREE.Vector3();
const armHand = new THREE.Vector3();
const armElbow = new THREE.Vector3();
const armHint = new THREE.Vector3();
const armAxis = new THREE.Vector3();
const quatA = new THREE.Quaternion();
const quatB = new THREE.Quaternion();
const quatC = new THREE.Quaternion();
const quatD = new THREE.Quaternion();
const quatE = new THREE.Quaternion();

type RestPose = Map<string, { pos: THREE.Vector3; quat: THREE.Quaternion }>;
const authoredPoses = new WeakMap<THREE.Object3D, RestPose>();

/**
 * The bone transforms as the GLTF authored them, captured the first time a scene is seen.
 *
 * Neither obvious alternative works as a reference frame: after a hot reload the live
 * bones hold whatever pose was on screen, and the skeleton's own bind pose is a T-pose
 * that none of this model's clips animate away — applying it would leave the arms stuck
 * out sideways.
 */
function authoredPose(scene: THREE.Object3D): RestPose {
  let pose = authoredPoses.get(scene);
  if (!pose) {
    pose = new Map();
    scene.traverse((node) => {
      if ((node as THREE.Bone).isBone) {
        pose?.set(node.name, {
          pos: node.position.clone(),
          quat: node.quaternion.clone(),
        });
      }
    });
    authoredPoses.set(scene, pose);
  }
  return pose;
}

/**
 * Rotates `bone` so its local +Y (the axis its child sits on in this rig) points at
 * `target`, blending `amount` of the way there from `base`.
 *
 * Blending from an explicit rest pose rather than the bone's live rotation matters: the
 * idle clip has no tracks for the leg bones, so a live baseline would compound frame to
 * frame and never unwind when the character stands back up.
 */
function aimBoneY(
  bone: THREE.Bone,
  target: THREE.Vector3,
  amount: number,
  base: THREE.Quaternion,
) {
  const parent = bone.parent;
  if (!parent) return;
  quatD.copy(base);
  bone.quaternion.copy(base);
  bone.updateWorldMatrix(true, false);
  bone.getWorldQuaternion(quatA);
  scratchC.set(0, 1, 0).applyQuaternion(quatA).normalize();
  scratchD.copy(target).sub(scratchA.setFromMatrixPosition(bone.matrixWorld));
  if (scratchD.lengthSq() < 1e-8) return;
  scratchD.normalize();
  quatB.setFromUnitVectors(scratchC, scratchD).multiply(quatA);
  parent.getWorldQuaternion(quatC);
  /* Held in its own quaternion: blending straight into bone.quaternion would alias the
     slerp's own source and silently discard the result. */
  quatE.copy(quatC.invert().multiply(quatB)).normalize();
  bone.quaternion.copy(quatD).slerp(quatE, amount);
}

/**
 * Writes into `out` where the elbow (or knee) has to sit for a two-bone chain to reach
 * `end` from `start` without changing either segment's length.
 *
 * The law of cosines fixes how far the joint sits off the straight line between the two,
 * which still leaves a whole circle of valid positions; `hint` picks which way the joint
 * breaks out of it. Reach is clamped so an out-of-range target straightens the chain
 * instead of producing a NaN from acos.
 */
function solveJoint(
  start: THREE.Vector3,
  end: THREE.Vector3,
  first: number,
  second: number,
  hint: THREE.Vector3,
  out: THREE.Vector3,
) {
  out.copy(end).sub(start);
  const reach = THREE.MathUtils.clamp(
    out.length(),
    Math.abs(first - second) + 1e-4,
    first + second - 1e-4,
  );
  if (reach < 1e-5) return out.copy(start);
  out.normalize();
  armAxis.copy(out).cross(hint);
  if (armAxis.lengthSq() < 1e-8) return out.multiplyScalar(first).add(start);
  armAxis.normalize();
  const cos = THREE.MathUtils.clamp(
    (first * first + reach * reach - second * second) / (2 * first * reach),
    -1,
    1,
  );
  return out
    .applyAxisAngle(armAxis, Math.acos(cos))
    .multiplyScalar(first)
    .add(start);
}

function Character({
  mood,
  workSide,
  dragYawRef,
  bodyXRef,
  pointerRef,
}: SceneInput) {
  const root = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, root);
  const baseClip = useRef<string | null>(null);
  const oneShot = useRef<THREE.AnimationAction | null>(null);
  const danceUntil = useRef(0);
  const danceStep = useRef(0);
  const sitBlend = useRef(0);
  const suitRef = useRef<Group>(null);
  const chestBone = useRef<THREE.Bone | null>(null);
  const chestRest = useRef<THREE.Vector3 | null>(null);
  const sitBones = useRef<SitBones>({
    pelvis: null,
    lean: null,
    legs: [],
    arms: [],
    pelvisRest: null,
  });
  const sitRest = useRef<SitRest[] | null>(null);
  const armRest = useRef<ArmRest[] | null>(null);
  const sitApplied = useRef(false);

  const clipName = useCallback(
    (matcher: RegExp) => names.find((name) => matcher.test(name)),
    [names],
  );

  const idleName = useMemo(
    () =>
      clipName(/Idle_Neutral/i) ??
      names.find((n) => /\|Idle$/i.test(n) || n === 'Idle') ??
      names[0],
    [clipName, names],
  );
  const walkName = useMemo(
    () => names.find((n) => /\|Walk$/i.test(n) || n === 'Walk'),
    [names],
  );
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

  useEffect(() => {
    const bone = (name: string) =>
      (scene.getObjectByName(name) as THREE.Bone | undefined) ?? null;

    /* Put the rig back into its authored pose so every "rest" value below shares one
       reference frame. Sampling the live pose instead would make that frame depend on
       where the page happened to be — a hot reload or a deep link into the desk section
       would capture the seated pose as rest and leave the character permanently sunk. */
    const pose = authoredPose(scene);
    scene.traverse((node) => {
      const rest = (node as THREE.Bone).isBone ? pose.get(node.name) : undefined;
      if (rest) {
        node.position.copy(rest.pos);
        node.quaternion.copy(rest.quat);
      }
    });

    const pelvis = bone('Body');
    sitBones.current = {
      pelvis,
      // This rig has no Spine bone; Abdomen is the equivalent lean joint.
      lean: bone('Abdomen') ?? bone('Torso'),
      legs: (
        [
          ['UpperLegL', 'LowerLegL', 'FootL', 'PTL'],
          ['UpperLegR', 'LowerLegR', 'FootR', 'PTR'],
        ] as const
      )
        .map(([hip, knee, ankle, toe]) => ({
          hip: bone(hip),
          knee: bone(knee),
          ankle: bone(ankle),
          toe: bone(toe),
        }))
        .filter((leg): leg is SitLeg => Boolean(leg.hip && leg.knee && leg.ankle)),
      arms: (
        [
          ['ShoulderL', 'UpperArmL', 'LowerArmL'],
          ['ShoulderR', 'UpperArmR', 'LowerArmR'],
        ] as const
      )
        .map(([shoulder, upper, fore]) => ({
          shoulder: bone(shoulder),
          upper: bone(upper),
          fore: bone(fore),
        }))
        .filter((arm): arm is SitArm =>
          Boolean(arm.shoulder && arm.upper && arm.fore),
        ),
      pelvisRest: pelvis ? pelvis.position.clone() : null,
    };
    const chest = bone('Chest');
    chestBone.current = chest;
    chestRest.current = null;

    const legs = sitBones.current.legs;
    if (root.current) {
      root.current.updateMatrixWorld(true);
      const at = (b: THREE.Object3D) =>
        new THREE.Vector3().setFromMatrixPosition(b.matrixWorld);
      const scale = root.current.scale.y;
      sitRest.current = legs.map((leg) => ({
        thigh: at(leg.knee).distanceTo(at(leg.hip)) / scale,
        shin: at(leg.ankle).distanceTo(at(leg.knee)) / scale,
        ankle: leg.ankle.position.clone(),
        toe: leg.toe ? leg.toe.position.clone() : null,
        hipQuat: leg.hip.quaternion.clone(),
        kneeQuat: leg.knee.quaternion.clone(),
      }));
      armRest.current = sitBones.current.arms.map((arm) => {
        const wrist = arm.fore.children.find(
          (child) => (child as THREE.Bone).isBone,
        );
        return {
          upper: at(arm.fore).distanceTo(at(arm.upper)) / scale,
          fore: wrist ? at(wrist).distanceTo(at(arm.fore)) / scale : 0,
          upperQuat: arm.upper.quaternion.clone(),
          foreQuat: arm.fore.quaternion.clone(),
        };
      });
      if (chest) {
        chest.updateWorldMatrix(true, false);
        chestRest.current = root.current.worldToLocal(at(chest));
      }
    }

    // Mutate in place — never dispose GLTF materials (HMR + dispose blanks WebGL).
    scene.traverse((node) => {
      if (!(node as THREE.Mesh).isMesh) return;
      const mesh = node as THREE.Mesh;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((source) => {
        const material = source as THREE.MeshStandardMaterial;
        if (!material?.color) return;
        material.metalness = 0;
        material.roughness = 0.55;
        material.envMapIntensity = 0;
        material.toneMapped = false;
        if (/Casual2_Body_1/i.test(mesh.name)) {
          material.color.set('#5a74a0');
          material.emissive.set('#1a2a44');
          material.emissiveIntensity = 0.45;
        } else if (/Casual2_Legs/i.test(mesh.name)) {
          material.color.set('#334560');
          material.emissive.set('#0c1420');
          material.emissiveIntensity = 0.25;
        } else if (/Casual2_Feet/i.test(mesh.name)) {
          material.color.set('#1a2230');
        } else if (/Casual2_Head_5/i.test(mesh.name)) {
          material.color.set('#6a3e20');
          material.emissive.set('#2a1808');
          material.emissiveIntensity = 0.2;
        } else if (/Casual2_Head_1|Casual2_Body_2/i.test(mesh.name)) {
          material.color.set('#e0c09a');
          material.emissive.set('#4a3020');
          material.emissiveIntensity = 0.35;
        } else if (/Casual2_Head_2/i.test(mesh.name)) {
          material.color.set('#c9a888');
          material.emissive.set('#3a2818');
          material.emissiveIntensity = 0.25;
        }
        material.needsUpdate = true;
      });
    });
  }, [scene]);

  const setBase = useCallback(
    (name: string | undefined) => {
      if (!name || !actions[name] || baseClip.current === name) return;
      const next = actions[name];
      const previous = baseClip.current ? actions[baseClip.current] : undefined;
      next.reset();
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.fadeIn(0.35).play();
      previous?.fadeOut(0.35);
      baseClip.current = name;
    },
    [actions],
  );

  useEffect(() => {
    setBase(idleName);
  }, [idleName, setBase]);

  const playDanceStep = useCallback(() => {
    if (danceClips.length === 0) return;
    const name = danceClips[danceStep.current % danceClips.length];
    const action = actions[name];
    if (!action) return;

    oneShot.current?.fadeOut(0.1);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.setEffectiveTimeScale(1.15);
    action.fadeIn(0.1).play();
    if (baseClip.current) actions[baseClip.current]?.fadeOut(0.1);
    oneShot.current = action;
    danceStep.current += 1;
  }, [actions, danceClips]);

  const startDance = useCallback(
    (durationMs = 5000) => {
      danceUntil.current = performance.now() + durationMs;
      danceStep.current = 0;
      playDanceStep();
    },
    [playDanceStep],
  );

  useEffect(() => {
    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<Reaction>).detail;
      if (detail.kind === 'surprise') startDance(5000);
    };
    window.addEventListener(REACT_EVENT, onReact);
    return () => window.removeEventListener(REACT_EVENT, onReact);
  }, [startDance]);

  /* Must stay at priority 0: any positive priority puts R3F into manual-render mode
     and the canvas stops painting. useAnimations subscribes above, so the mixer still
     runs before this callback and the bone sit overrides the idle clip. */
  useFrame((_, delta) => {
    if (!root.current) return;
    const now = performance.now();
    const dancing = now < danceUntil.current;
    const atDesk = mood === 'building' && !dancing;

    // Snap out of the sit pose quickly so the hero never looks half-seated.
    sitBlend.current = THREE.MathUtils.damp(
      sitBlend.current,
      atDesk ? 1 : 0,
      atDesk ? 4.2 : 12,
      delta,
    );
    if (!atDesk && sitBlend.current < 0.04) sitBlend.current = 0;
    const sit = sitBlend.current;

    if (dancing && oneShot.current) {
      const clip = oneShot.current.getClip();
      if (
        !oneShot.current.isRunning() ||
        oneShot.current.time >= clip.duration - 0.06
      ) {
        oneShot.current.fadeOut(0.08);
        oneShot.current = null;
        playDanceStep();
      }
    } else if (!dancing && oneShot.current) {
      const clip = oneShot.current.getClip();
      if (
        !oneShot.current.isRunning() ||
        oneShot.current.time >= clip.duration - 0.06
      ) {
        oneShot.current.fadeOut(0.2);
        oneShot.current = null;
        if (baseClip.current) actions[baseClip.current]?.reset().fadeIn(0.25).play();
      }
    }

    const anchor = anchorFor(mood, workSide);
    const sway = atDesk || dancing ? 0 : pointerRef.current.x * 0.16;
    const previousX = root.current.position.x;
    root.current.position.x = THREE.MathUtils.damp(
      previousX,
      anchor + sway,
      atDesk ? 3.8 : 2.4,
      delta,
    );
    root.current.position.z = THREE.MathUtils.damp(
      root.current.position.z,
      atDesk ? SEAT_Z : 0,
      3.4,
      delta,
    );
    // Feet are planted by the rig, so seating lowers the hips rather than the root.
    root.current.position.y =
      GROUND_Y + (dancing ? Math.abs(Math.sin(now * 0.012)) * 0.06 : 0);
    bodyXRef.current = root.current.position.x;

    const walking =
      !atDesk && !dancing && Math.abs(anchor - root.current.position.x) > 0.35;
    if (!dancing && !oneShot.current) {
      setBase(walking && walkName ? walkName : idleName);
    }

    const b = sitBones.current;

    // Bone sit after the mixer: set full XYZ so idle twist doesn't corkscrew the legs.
    const rest = sitRest.current;
    if (sit > 0.02 && rest) {
      const mix = (bone: THREE.Bone | null, x: number, y: number, z: number) => {
        if (!bone) return;
        if (!Number.isFinite(bone.rotation.x)) bone.rotation.x = 0;
        if (!Number.isFinite(bone.rotation.y)) bone.rotation.y = 0;
        if (!Number.isFinite(bone.rotation.z)) bone.rotation.z = 0;
        bone.rotation.x = THREE.MathUtils.lerp(bone.rotation.x, x, sit);
        bone.rotation.y = THREE.MathUtils.lerp(bone.rotation.y, y, sit);
        bone.rotation.z = THREE.MathUtils.lerp(bone.rotation.z, z, sit);
      };
      mix(b.lean, 0.16, 0, 0);

      if (b.pelvis && b.pelvisRest) {
        const p = b.pelvis.parent;
        if (p) {
          scratchA.copy(b.pelvisRest);
          p.localToWorld(scratchA);
          scratchA.y -= rest[0].thigh * sit * root.current.scale.y;
          b.pelvis.position.copy(p.worldToLocal(scratchA));
        }
      }
      root.current.updateMatrixWorld(true);

      /* Each leg is solved rather than posed: thigh aimed straight forward from the
         hip, shin aimed straight down, ankle dropped exactly one shin below the knee.
         Because the pelvis fell by one thigh length, that lands both feet back on the
         floor at their true segment lengths, identically on each side. */
      const scale = root.current.scale.y;
      const yaw = root.current.rotation.y;
      const forwardX = Math.sin(yaw);
      const forwardZ = Math.cos(yaw);

      b.legs.forEach((leg, i) => {
        const r = rest[i];
        leg.hip.updateWorldMatrix(true, false);
        solveTarget
          .setFromMatrixPosition(leg.hip.matrixWorld)
          .addScaledVector(solveAxis.set(forwardX, 0, forwardZ), r.thigh * scale);
        aimBoneY(leg.hip, solveTarget, sit, r.hipQuat);

        leg.knee.updateWorldMatrix(true, false);
        solveTarget
          .setFromMatrixPosition(leg.knee.matrixWorld)
          .addScaledVector(solveAxis.set(0, -1, 0), r.shin * scale);
        aimBoneY(leg.knee, solveTarget, sit, r.kneeQuat);

        // Ankle and toe share one offset, so the shoe travels rigidly instead of shearing.
        const parent = leg.ankle.parent;
        if (!parent) return;
        parent.updateWorldMatrix(true, false);
        solveRest.copy(r.ankle);
        parent.localToWorld(solveRest);
        solveDelta.copy(solveTarget).sub(solveRest).multiplyScalar(sit);

        const place = (target: THREE.Bone, restLocal: THREE.Vector3) => {
          const p = target.parent;
          if (!p) return;
          p.updateWorldMatrix(true, false);
          solvePoint.copy(restLocal);
          p.localToWorld(solvePoint).add(solveDelta);
          target.position.copy(p.worldToLocal(solvePoint));
        };
        place(leg.ankle, r.ankle);
        if (leg.toe && r.toe) place(leg.toe, r.toe);
      });

      /* Hands onto the keyboard. Targets are built from the seat rather than from the desk
         object so this stays correct while the desk plays its entrance scale-up. */
      const arms = armRest.current;
      if (arms && arms.length === b.arms.length) {
        solvePoint.setFromMatrixPosition(root.current.matrixWorld);
        const rightX = Math.cos(yaw);
        const rightZ = -Math.sin(yaw);
        b.arms.forEach((arm, i) => {
          const ar = arms[i];
          if (ar.fore <= 0) return;
          arm.upper.updateWorldMatrix(true, false);
          armShoulder.setFromMatrixPosition(arm.upper.matrixWorld);

          // Which way this arm flares, read off the rig rather than assumed from L/R.
          const side =
            Math.sign(
              (armShoulder.x - solvePoint.x) * rightX +
                (armShoulder.z - solvePoint.z) * rightZ,
            ) || 1;
          const offset = HAND_SPREAD * side;
          armHand.set(
            solvePoint.x + offset * rightX + HAND_FORWARD * forwardX,
            solvePoint.y + HAND_HEIGHT,
            solvePoint.z + offset * rightZ + HAND_FORWARD * forwardZ,
          );

          // Elbows break outward and down, the way they do over a keyboard.
          armHint.set(rightX * side * 0.8 - forwardX * 0.3, -1, rightZ * side * 0.8 - forwardZ * 0.3);
          solveJoint(
            armShoulder,
            armHand,
            ar.upper * scale,
            ar.fore * scale,
            armHint,
            armElbow,
          );
          aimBoneY(arm.upper, armElbow, sit, ar.upperQuat);
          aimBoneY(arm.fore, armHand, sit, ar.foreQuat);
        });
      }
      sitApplied.current = true;
    } else if (rest && sitApplied.current) {
      /* Released once on exit, not every frame: the walk and dance clips animate these
         same foot bones, and re-pinning them each frame would freeze the footwork. */
      if (b.pelvis && b.pelvisRest) b.pelvis.position.copy(b.pelvisRest);
      b.legs.forEach((leg, i) => {
        leg.ankle.position.copy(rest[i].ankle);
        if (leg.toe && rest[i].toe) leg.toe.position.copy(rest[i].toe!);
        leg.hip.quaternion.copy(rest[i].hipQuat);
        leg.knee.quaternion.copy(rest[i].kneeQuat);
      });
      const arms = armRest.current;
      if (arms) {
        b.arms.forEach((arm, i) => {
          if (!arms[i]) return;
          arm.upper.quaternion.copy(arms[i].upperQuat);
          arm.fore.quaternion.copy(arms[i].foreQuat);
        });
      }
      sitApplied.current = false;
    }

    const facing = dancing
      ? root.current.rotation.y + delta * 2.2
      : atDesk
        ? DESK_FACING
        : walking
          ? Math.sign(root.current.position.x - previousX || 1) * 1.32
          : THREE.MathUtils.clamp(0.08 + pointerRef.current.x * 0.38, -0.45, 0.55) +
            (dragYawRef.current ?? 0);
    root.current.rotation.y = dancing
      ? facing
      : THREE.MathUtils.damp(root.current.rotation.y, facing, atDesk ? 5.2 : 3.4, delta);
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      dancing ? Math.sin(now * 0.01) * 0.06 : 0,
      5.5,
      delta,
    );

    const baseScale =
      (mood === 'work' ? 0.92 : mood === 'building' ? 0.96 : 1) * MODEL_SCALE;
    root.current.scale.setScalar(baseScale);

    // Carry the unskinned suit pieces along with the torso.
    if (chestBone.current && suitRef.current && chestRest.current) {
      chestBone.current.updateWorldMatrix(true, false);
      scratchA.setFromMatrixPosition(chestBone.current.matrixWorld);
      root.current.worldToLocal(scratchA);
      suitRef.current.position.subVectors(scratchA, chestRest.current);
    }
  });

  return (
    <group ref={root} position={[moodAnchors.intro, GROUND_Y, 0]} scale={MODEL_SCALE}>
      <primitive object={scene} />
      <SuitDetails groupRef={suitRef} />
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
    const atDesk = mood === 'building';
    const anchorX = bodyXRef.current ?? anchorFor(mood, workSide);
    const drift = focused ? focus.x * 0.9 : pointer.x * 0.4;
    const targetX = atDesk
      ? DESK_X + 0.55 + Math.cos(orbit) * 0.12
      : anchorX + Math.cos(orbit) * 0.5 + drift;
    const targetY = atDesk
      ? GROUND_Y + 1.35 + Math.sin(orbit * 1.4) * 0.08
      : GROUND_Y + 1.16 + Math.sin(orbit * 1.2) * 0.16 + pointer.y * 0.2;

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
        <meshBasicMaterial color="#b8f4ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.02, 0.201]}>
        <circleGeometry args={[0.142, 32]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} />
      </mesh>
      <group ref={face} position={[0, 0.02, 0.226]}>
        <mesh position={[-0.052, 0.024, 0]}>
          <sphereGeometry args={[0.023, 16, 12]} />
          <meshBasicMaterial color="#07101a" toneMapped={false} />
        </mesh>
        <mesh position={[0.052, 0.024, 0]}>
          <sphereGeometry args={[0.023, 16, 12]} />
          <meshBasicMaterial color="#07101a" toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.046, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.037, 0.008, 10, 24, Math.PI]} />
          <meshBasicMaterial color="#07101a" toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[-0.215, 0.02, 0]} rotation={[0, 0, -0.62]}>
        <capsuleGeometry args={[0.033, 0.12, 6, 12]} />
        <meshBasicMaterial color="#a5b4fc" toneMapped={false} />
      </mesh>
      <mesh position={[0.215, 0.02, 0]} rotation={[0, 0, 0.62]}>
        <capsuleGeometry args={[0.033, 0.12, 6, 12]} />
        <meshBasicMaterial color="#a5b4fc" toneMapped={false} />
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
    <group ref={holder} position={[0, GROUND_Y + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
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

function CodingDesk({ mood }: { mood: Mood }) {
  const root = useRef<Group>(null);
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const visible = useRef(mood === 'building' ? 1 : 0);

  useFrame((state, delta) => {
    if (!root.current) return;
    visible.current = THREE.MathUtils.damp(
      visible.current,
      mood === 'building' ? 1 : 0,
      mood === 'building' ? 3.2 : 9,
      delta,
    );
    const amount = visible.current;
    root.current.visible = amount > 0.04;
    if (mood !== 'building' && amount < 0.05) {
      root.current.visible = false;
      visible.current = 0;
    }
    root.current.scale.setScalar(0.72 + amount * 0.28);
    root.current.position.y = GROUND_Y + (1 - amount) * -0.35;

    if (screen.current) {
      screen.current.emissiveIntensity = 0.35 + Math.sin(state.clock.elapsedTime * 3.2) * 0.18;
    }
  });

  return (
    /* Anchored on the seat and yawed with the character, so "in front of him" is
       always +Z here regardless of how the workstation is angled to the camera. */
    <group ref={root} position={[DESK_X, GROUND_Y, SEAT_Z]} rotation={[0, DESK_FACING, 0]}>
      {/* Desk height is set against the seated hip line (~0.36), not standing height. */}
      <mesh position={[0, 0.6, 0.56]}>
        <boxGeometry args={[1.05, 0.05, 0.58]} />
        <meshStandardMaterial color="#1c2433" roughness={0.55} />
      </mesh>
      {[
        [-0.45, 0.29, 0.34],
        [0.45, 0.29, 0.34],
        [-0.45, 0.29, 0.78],
        [0.45, 0.29, 0.78],
      ].map((pos) => (
        <mesh key={pos.join('-')} position={pos as [number, number, number]}>
          <boxGeometry args={[0.05, 0.58, 0.05]} />
          <meshStandardMaterial color="#121821" roughness={0.7} />
        </mesh>
      ))}

      {/* Monitor across the desk, screen turned back toward the seat */}
      <group position={[0, 0, 0.68]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.5, 0.31, 0.04]} />
          <meshStandardMaterial color="#0b1018" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.85, 0.022]}>
          <planeGeometry args={[0.44, 0.25]} />
          <meshStandardMaterial
            ref={screen}
            color="#07131f"
            emissive="#38bdf8"
            emissiveIntensity={0.45}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, 0.69, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.05]} />
          <meshStandardMaterial color="#151c28" />
        </mesh>
      </group>

      <mesh position={[0, 0.64, 0.4]}>
        <boxGeometry args={[0.4, 0.025, 0.15]} />
        <meshStandardMaterial color="#0f1520" roughness={0.45} />
      </mesh>
      <mesh position={[0.28, 0.64, 0.42]}>
        <boxGeometry args={[0.07, 0.02, 0.11]} />
        <meshStandardMaterial color="#182030" />
      </mesh>

      {/* Chair straddling the seat origin, backrest behind the character */}
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.44, 0.06, 0.44]} />
        <meshStandardMaterial color="#161d2a" roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.64, -0.24]}>
        <boxGeometry args={[0.44, 0.52, 0.06]} />
        <meshStandardMaterial color="#121821" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.34, 10]} />
        <meshStandardMaterial color="#0d121a" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Scene(props: SceneInput) {
  return (
    <>
      <ambientLight intensity={2.2} />
      <directionalLight position={[1.6, 4.2, 5.2]} intensity={2.8} />
      <directionalLight position={[-2.4, 3.2, 3.4]} intensity={1.4} color="#d7e6ff" />
      <pointLight position={[1.45, 2.3, 2.6]} intensity={1.8} distance={10} color="#eef5ff" />
      <hemisphereLight args={['#f0f6ff', '#10182c', 1.0]} />
      <Suspense fallback={null}>
        <Character {...props} />
      </Suspense>
      <Companion {...props} />
      <CodingDesk mood={props.mood} />
      <GroundShadow bodyXRef={props.bodyXRef} />
      <KineticForms pointerRef={props.pointerRef} />
    </>
  );
}

const moodLines: Record<Mood, string[]> = {
  intro: ['Welcome - take a look around.', 'Start wherever you like.'],
  work: ['Six builds, one standard.', 'Shipped, not theoretical.', 'Depth over volume.'],
  building: ['At the desk right now.', 'This is what is in flight.', 'Still shipping.'],
  experience: [
    'Built under real constraints.',
    'Production, not prototypes.',
    'Ambiguity is part of the job.',
  ],
  about: ['The thinking behind the work.', 'Clarity is the whole craft.'],
  skills: ['Tools change, judgment compounds.', 'Chosen per problem.'],
  proof: ['Sharpened under pressure.', 'Consistency, measured.'],
  contact: ["Open to the right team.", "Let's build something useful."],
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
  "Curiosity unlocked - let's move.",
];

const focusLines = [
  (label: string) => `${label} - worth a look.`,
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
  const [mounted, setMounted] = useState(false);

  const dragYawRef = useRef(0);
  const bodyXRef = useRef(moodAnchors.intro);
  const focusRef = useRef<Focus>({ x: 0, y: 0, until: 0 });
  const companionScreenRef = useRef({ x: -999, y: -999 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const orbHitRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const lastLine = useRef('');

  useEffect(() => {
    setMounted(true);
  }, []);

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
      { selector: '#building', mood: 'building' },
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
    window.addEventListener('hashchange', update);
    // Hash loads (e.g. #building) scroll without always firing scroll.
    requestAnimationFrame(update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('hashchange', update);
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

  if (!mounted || disableHeavy3D) return null;

  const world = (
    <div
      className="pointer-events-none fixed inset-0 z-[15] hidden md:block"
      aria-hidden="true"
      data-scene-mood={mood}
      data-work-side={workSide}
    >
      <Canvas
        key="portfolio-scroll-world"
        camera={{ position: [0.4, 0.5, 4.9], fov: 31, near: 0.1, far: 40 }}
        dpr={[1, 1.75]}
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl, scene, camera }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.45;
          gl.domElement.style.background = 'transparent';
          gl.domElement.style.pointerEvents = 'none';
          (window as unknown as { __portfolio3d?: unknown }).__portfolio3d = {
            gl,
            scene,
            camera,
          };
        }}
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

  /* Canvas paints above the page; this overlay only hosts small hit targets.
     Keep it pointer-events-none so forms stay clickable. */
  const overlay = (
    <div className="pointer-events-none fixed inset-0 z-[16] hidden md:block" data-character-ui>
      <button
        ref={orbHitRef}
        type="button"
        tabIndex={-1}
        data-cursor
        aria-label="Pet the companion"
        onClick={() => emit({ kind: 'pet' })}
        className={`group absolute left-0 top-0 h-[78px] w-[78px] rounded-full border border-cyan-200/20 bg-cyan-200/[0.025] transition-colors hover:border-cyan-200/65 hover:bg-cyan-200/[0.08] ${
          mood === 'contact' ? 'pointer-events-none opacity-0' : 'pointer-events-auto'
        }`}
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
                Gift unlocked - the character dances for five seconds while the companion
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

  return createPortal(
    <>
      {world}
      {overlay}
    </>,
    document.body,
  );
}
