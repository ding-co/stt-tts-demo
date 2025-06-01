import { PointMaterial, Points } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface VoiceParticlesProps {
  isListening: boolean;
  audioData?: Float32Array;
}

export function VoiceParticles({ isListening, audioData }: VoiceParticlesProps) {
  const ref = useRef<THREE.Points>(null);
  const originalPositions = useRef<Float32Array | undefined>(undefined);
  const targetPositions = useRef<Float32Array | undefined>(undefined);
  const rotationSpeed = useRef(0.3); // 회전 속도를 0.5에서 0.2로 낮춤

  // 파티클 위치 생성
  const particles = useMemo(() => {
    const temp = [];
    // 초기 위치는 작은 구형으로 설정
    for (let i = 0; i < 2000; i++) {
      const radius = Math.random() * 0.05; // 반경
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      temp.push(x, y, z);
    }
    const positions = new Float32Array(temp);
    originalPositions.current = positions;
    targetPositions.current = new Float32Array(temp);
    return positions;
  }, []);

  // 애니메이션 프레임 업데이트
  useFrame((state, delta) => {
    if (!ref.current || !originalPositions.current || !targetPositions.current) return;

    const positions = ref.current.geometry.attributes.position.array as Float32Array;

    // 시계방향 회전 적용
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed.current * delta;
    }

    if (isListening && audioData) {
      // 오디오 데이터에 따라 목표 위치 계산
      for (let i = 0; i < positions.length; i += 3) {
        const audioIndex = Math.floor((i / positions.length) * audioData.length);
        const audioValue = Math.abs(audioData[audioIndex] || 0);

        // 오디오 값에 따라 퍼져나가는 거리 계산
        const spreadDistance = 2 + audioValue * 8; // 기본 거리, 오디오 영향도

        // 원래 위치에서 퍼져나가는 방향 계산
        const originalX = originalPositions.current[i];
        const originalY = originalPositions.current[i + 1];
        const originalZ = originalPositions.current[i + 2];

        // 방향 벡터 정규화
        const length = Math.sqrt(
          originalX * originalX + originalY * originalY + originalZ * originalZ,
        );
        const dirX = originalX / length;
        const dirY = originalY / length;
        const dirZ = originalZ / length;

        // 목표 위치 설정
        targetPositions.current[i] = dirX * spreadDistance;
        targetPositions.current[i + 1] = dirY * spreadDistance;
        targetPositions.current[i + 2] = dirZ * spreadDistance;
      }
    } else {
      // 음성이 없을 때는 원래 위치로 돌아가도록 목표 위치 설정
      for (let i = 0; i < positions.length; i++) {
        targetPositions.current[i] = originalPositions.current[i];
      }
    }

    // 현재 위치에서 목표 위치로 부드럽게 이동
    for (let i = 0; i < positions.length; i++) {
      positions[i] += (targetPositions.current[i] - positions[i]) * delta * 3;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4B9CD3"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}
