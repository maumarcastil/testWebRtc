import AsyncStorage from "@react-native-async-storage/async-storage";

// Saving data to local storage

const setItem = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        throw error;
    }
};

// Retrieving data from local storage

const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        throw error;
    }
};

export const localStorage = {
    setItem,
    getItem,
};
