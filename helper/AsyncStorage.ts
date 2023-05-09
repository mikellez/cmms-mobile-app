import AsyncStorage from "@react-native-async-storage/async-storage";

const _storeData = async (key, value) => {
  if(typeof value === 'object') value = JSON.stringify(value);

  try {
    await AsyncStorage.setItem(
      '@'+key,
      value,
    );
  } catch (err) {
    // Error saving data
    console.log(err)
    console.log('Unable to set data ' + key, value)
  } 
}

const _retrieveData = async (key) => {
  try {
    return await AsyncStorage.getItem('@'+key);

  } catch (err) {
    // Error retrieving data
    console.log(err)
    console.log('Unable to retrieve data ' + key)
  }
}

export {
  _storeData,
  _retrieveData
}