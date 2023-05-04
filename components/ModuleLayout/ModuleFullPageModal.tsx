import React from "react";
import { Modal, StyleSheet, Pressable, Dimensions } from "react-native";
import { Text, IconButton, HStack, View } from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign"


interface ModuleFullPageModalProps extends React.PropsWithChildren {
    title: string,
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const ModuleFullPageModal = (props: ModuleFullPageModalProps) => {

    const closeModal = () => {
        props.setOpen(false);
    };


    return (
        <Modal
            visible={props.isOpen}
            onRequestClose={closeModal}
            transparent={true}
            animationType="slide"
        >
            <Pressable
                style={{
                    ...styles.overlay,
                    display: props.isOpen ? "flex" : "none"
                }}
                onPress={closeModal}
            >
            </Pressable>
            <View 
                style={{
                    ...styles.modalView,
                }}
            >
                <HStack alignItems="center">
                    <Text style={styles.title}>{props.title}</Text>
                    <IconButton 
                        _icon={{
                            as: AntDesign,
                            name: "close"
                        }}
                        _pressed={{
                            onPress: closeModal
                        }}
                        variant="ghost"
                        size="lg"
                        style={styles.button}
                        colorScheme="black"
                    />
                </HStack>

                <View>
                    {props.children}
                </View> 
            </View>      
        </Modal>  
        
    );
};

const styles = StyleSheet.create({
    modalView: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "70%",
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderWidth: 1,
        borderColor: '#dee2e6',
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        flex: 1,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 10000,
    },

    button: {
        marginLeft: "auto"
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
    },

    overlay: {
        flex: 1,
        position: "absolute",
        height: "100%",
        width: "100%",
        // bottom: 0,
        opacity: 0.25,
        backgroundColor: "black",
        zIndex: 100,
    }
})

export { ModuleFullPageModal };
