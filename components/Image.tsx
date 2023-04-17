import React, { useEffect, useState } from 'react';
import { Image, Text } from 'native-base';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

const ImageComponent = ({ bufferData }) => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(()=>{
    const arrayBuffer = new Uint8Array(bufferData);
    //const arrayBuffer = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]).buffer;
    const buf = Buffer.from(arrayBuffer);
    const base64String = Buffer.from(arrayBuffer).toString('base64');

    const uri = `data:image/png;base64,${base64String}`; // URI

    setImageUri(uri);
	}, [])


  return (
    <>
    <Image
      source={{ uri: imageUri }}
      style={{ width: 200, height: 200 }}
      alt='Test'
    />
    </>
  );
};

export default ImageComponent;