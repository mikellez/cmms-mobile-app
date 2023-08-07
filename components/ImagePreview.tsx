import React, { CSSProperties } from 'react';
import { Center, Container, Icon, IconButton, Image, Pressable } from 'native-base';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ImagePreview = ({ source, alt, addImage, onPress, isDisabled }) => {
  console.log('source', source)
  return (
    <>
      {addImage ? 
        <Pressable onPress={onPress} isDisabled={isDisabled}>
          {source.uri 
          ? <Image source={source} style={styles.container} alt={alt}/>
          :
          <View style={styles.container}>
            <Icon size="2xl" as={MaterialCommunityIcons} name="camera" color="#C8102E" />
            <Text style={styles.text}>Add Image</Text>
          </View>
          }
        </Pressable>
        :
        <View style={styles.container}>
          <IconButton icon={<Icon size="2xl" as={MaterialCommunityIcons} name="image" color="#C8102E" />} />
          <Text style={styles.text}>No Image</Text>
        </View>

      }
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
    marginTop: 10,
  }
});

const iconStyles = StyleSheet.create({

});

export default ImagePreview;