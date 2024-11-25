import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [modelo3D, setModelo3D] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(`Código QR escaneado con tipo ${type} y datos: ${data}`);

    switch (data) {
      case 'Monolito 1':
        setModelo3D('Monolito1.glb'); // Reemplaza con la ruta a tu modelo 3D
        break;
      case 'Monolito 2':
        setModelo3D('Monolito2.glb');
        break;
      case 'Monolito 3':
        setModelo3D('Monolito3.glb');
        break;
      case 'Monolito 4':
        setModelo3D('Monolito4.glb');
        break;
      case 'Monolito 5':
        setModelo3D('Monolito5.glb');
        break;
      default:
        alert('Código QR no válido');
        break;
    }
    setShow3DViewer(true);
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  if (show3DViewer) {
    return (
      <View style={styles.container3D}>
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Modelo3D ruta={modelo3D} />
          <OrbitControls />
        </Canvas>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.containerQR}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <button title={'Escanear de nuevo'} onPress={() => setScanned(false)} />
          )}
        </View>
      </Camera>
    </View>
  );
}

const Modelo3D = ({ ruta }) => {
  const group = useRef();
  const { nodes, materials } = useGLTF(ruta);
  useFrame(() => (group.current.rotation.y += 0.01));
  return (
    <group ref={group} dispose={null}>
      <mesh geometry={nodes.Cube.geometry} material={materials.Material} />
    </group>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  containerQR: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  container3D: {
    flex: 1,
  },
});
