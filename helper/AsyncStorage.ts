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

const _addToDataArray = async(key, value) => {
  try {
    console.log("AsyncStorage storing");
    let arr = await AsyncStorage.getItem("@" + key);
    const parsedArr = arr == null ? [] : JSON.parse(arr);
    parsedArr.push(value);
    arr = JSON.stringify(parsedArr);
    await AsyncStorage.setItem("@" + key, arr);
  } catch (err) {
    // Error saving data
    console.log(err);
    console.log('Unable to update data array');
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

const _clear = () => {
  try {
    return AsyncStorage.clear();
  } catch (err) {
    console.log(err)
    console.log('Async storage clear err')

  }
}

export {
  _storeData,
  _addToDataArray,
  _retrieveData,
  _clear
}