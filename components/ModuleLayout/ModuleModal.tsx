import React from "react";
import { Modal, StyleSheet, Pressable, SafeAreaView } from "react-native";
import {
  Text,
  IconButton,
  HStack,
  View,
  Modal as NBModal,
  Icon,
  VStack,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";

interface ModuleModalProps extends React.PropsWithChildren {
  title?: string;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hideCloseButton?: boolean;
}
interface ModuleSimpleModalProps extends ModuleModalProps {
  text?: string;
  icon?: string;
  onCloseCallback?: Function;
}

const ModalIcon = {
  Warning: { icon: "warning", package: AntDesign },
  Success: { icon: "checkcircleo", package: AntDesign },
  Offline: { icon: "wifi-off", package: Feather },
  Exit: { icon: "logout", package: AntDesign },
  Close: { icon: AntDesign, close: "close" },
};

const ModuleSimpleModal = (props: ModuleSimpleModalProps) => {
  const closeModal = () => {
    props.setOpen(false);
    if (props.onCloseCallback) props.onCloseCallback();
  };

  return (
    <NBModal isOpen={props.isOpen} onClose={closeModal}>
      <NBModal.Content>
        {!props.hideCloseButton && <NBModal.CloseButton />}
        <NBModal.Body padding="4">
          <VStack space={2}>
            {props.icon && (
              <Icon
                as={ModalIcon[props.icon]["package"]}
                name={ModalIcon[props.icon]["icon"]}
                size="4xl"
              />
            )}

            {props.title && (
              <Text fontSize="18" fontWeight={600}>
                {props.title}
              </Text>
            )}
            {props.text && <Text>{props.text}</Text>}
          </VStack>
          <VStack>

            {props.children}
          </VStack>
        </NBModal.Body>
      </NBModal.Content>
    </NBModal>
  );
};


const ModuleFullPageModal = (props: ModuleModalProps) => {
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
          display: props.isOpen ? "flex" : "none",
        }}
        onPress={closeModal}
      ></Pressable>
      <View
        style={{
          ...styles.modalView,
        }}
      >
        <HStack alignItems="center">
          <Text style={styles.title}>{props.title}</Text>
          {props.hideCloseButton && (
            <IconButton
              _icon={{
                as: ModalIcon["Close"]["package"],
                name: ModalIcon["Close"]["icon"],
              }}
              _pressed={{
                onPress: closeModal,
              }}
              variant="ghost"
              size="lg"
              style={styles.button}
              colorScheme="black"
            />
          )}
        </HStack>

        <View>{props.children}</View>
      </View>
    </Modal>
  );
};

const ModuleChecklistModal = (props: ModuleSimpleModalProps) => {
  const closeModal = () => {
    props.setOpen(false);
    if (props.onCloseCallback) props.onCloseCallback();
  };

  return (
    <NBModal isOpen={props.isOpen} onClose={closeModal}>
      <NBModal.Content>
        <NBModal.CloseButton />
        <NBModal.Body padding="4">
          <VStack space={2}>
            {props.icon && (
              <Icon
                as={ModalIcon[props.icon]["package"]}
                name={ModalIcon[props.icon]["icon"]}
                size="4xl"
              />
            )}

            {props.title && (
              <Text fontSize="18" fontWeight={600}>
                {props.title}
              </Text>
            )}
            {props.text && <Text>{props.text}</Text>}
          </VStack>
          <VStack>

            {props.children}
          </VStack>
        </NBModal.Body>
      </NBModal.Content>
    </NBModal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "70%",
    backgroundColor: "white",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
    padding: 35,
    shadowColor: "#000",
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
    marginLeft: "auto",
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
  },
});

export { ModuleSimpleModal, ModuleFullPageModal };
