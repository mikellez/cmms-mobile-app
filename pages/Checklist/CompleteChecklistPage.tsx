import React, { useEffect, useState, createContext, useRef } from "react";
import {
  ModuleScreen,
  ModuleHeader,
  ModuleSimpleModal,
} from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import { ScrollView, StyleSheet } from "react-native";
import { VStack, Text, Center, IconButton, HStack, Button, Alert, Box } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Table, Rows } from "react-native-table-component";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableProvider from "../../context/checklistContext";
import ChecklistHeader from "../../components/Checklist/ChecklistHeader";
import {
  checkConnection,
  subscribeToConnectionChanges,
} from "../../helper/NetInfo";
import { _addToDataArray } from "../../helper/AsyncStorage";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { fetch } from "@react-native-community/netinfo";

const completeChecklist = async (checklist: CMMSChecklist) => {
  try {
    await instance({
      url: `/api/checklist/complete/${checklist.checklist_id}`,
      data: {
        datajson: checklist.datajson,
      },
      method: "patch",
    });
  } catch (err) {
    console.log(err);
  }
};

const CompleteChecklistPage = ({ navigation, route }) => {
  const [checklist, setChecklist] = useState<CMMSChecklist>(
    {} as CMMSChecklist
  );
  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  //const [isConnected, setIsConnected] = useState<boolean>(false);
  const [offlineModal, setOfflineModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isOffline = useSelector<RootState, boolean>((state) => state.offline);
  const sectionsRef = useRef<ChecklistSection[]>([]);

  // useEffect(() => {
  //     const subscribe = subscribeToConnectionChanges(setIsConnected);
  //     return () => {
  //         subscribe();
  //     }
  // }, [isConnected]);
  const fetchSpecificChecklist = async (checklistId: number) => {
    try {
      const res = await instance.get(`/api/checklist/record/${checklistId}`);
      return res.data;
    } catch (err) {
      console.log(err);
      console.log('Unable to fetch specific checklists')
    }
  }

  useEffect(() => {

    if(route.params) {
      console.log('params', route.params)
      if(!isOffline) {
        fetchSpecificChecklist(route.params.checklist_id).then((res) => {
          setChecklist(res)
        });
      } else {
        setChecklist(route.params);
      }

    }

  }, [route.params]);

  useEffect(() => {
    if (isSubmitting) {
      console.log("Connected: " + isOffline);
      if (!isOffline) {
        setSuccessModal(true);

        completeChecklist(checklist).then((res) => {
          navigation.navigate("Maintenance");
        });
      } else {
        setOfflineModal(true);
      }
    } else if (checklist && checklist.datajson) {
      console.log("hello");
      console.log(route.params);
      setSections(
        checklist.datajson.map((section) => ChecklistSection.fromJSON(section))
      );

      sectionsRef.current = checklist.datajson.map((section) => ChecklistSection.fromJSON(section));
    }
  }, [checklist]);

  const toDataJSON = (sections: ChecklistSection[]) => {
    return sections.map((section) => section.toJSON());
  };
  const handleSubmit = () => {
    if (!checkIfChecklistIsComplete(sectionsRef.current)) {
      setIncompleteModal(true);
    } else {
      setIsSubmitting(true);
      setChecklist((prevChecklist) => {
        const newChecklist = { ...prevChecklist };
        newChecklist.datajson = toDataJSON(sectionsRef.current);
        return newChecklist;
      });
      // if (isConnected){
      //     setSuccessModal(true);

      //     completeChecklist(checklist)
      //         .then(res => {
      //             navigation.navigate("Maintenance");
      //         });

      // } else {
      //     setOfflineModal(true);
      // };
      // }
    }
  };

  const checkIfChecklistIsComplete = (sections: ChecklistSection[]) => {
    return sections.every((section) => section.isComplete());
  };

  const leavePage = () => {
    navigation.navigate("Maintenance");
  };

  const confirmOffline = () => {
    _addToDataArray("checklist", checklist).then((res) => {
      setOfflineModal(false);
      setSuccessModal(true);
    });
  };
  const leaveOffline = () => {
    setOfflineModal(false);
  };

  const header = 
    
    <Center>
      {isOffline &&<Alert w="100%" status="danger">
          <VStack space={1} flexShrink={1} w="100%" alignItems="center">
            <Alert.Icon size="md" />
            <Text fontSize="md" fontWeight="medium" _dark={{
            color: "coolGray.800"
          }}>
              You are now in offline mode
            </Text>

            <Box _text={{
            textAlign: "center"
          }} _dark={{
            _text: {
              color: "coolGray.600"
            }
          }}>
              You can still complete and submit your checklist here.
            </Box>
          </VStack>
        </Alert>}
      <ChecklistDetails checklist={checklist}></ChecklistDetails>
    </Center>
  ;
  const footer = (
    <IconButton
      _icon={{
        as: Ionicons,
        name: "checkmark-done",
      }}
      colorScheme="white"
      variant="solid"
      backgroundColor="#C8102E"
      onPress={handleSubmit}
    ></IconButton>
  );

  return (
    <ModuleScreen navigation={navigation}>
      <ChecklistHeader navigation={navigation} header={"Complete Checklist"} />
      

      <ChecklistEditableProvider
        sections={sections}
        setSections={setSections}
        sectionsRef={sectionsRef}
        isDisabled={false}
      >
        <ChecklistEditableForm header={header} footer={footer} />
      </ChecklistEditableProvider>

      <ModuleSimpleModal
        isOpen={incompleteModal}
        setOpen={setIncompleteModal}
        title="Missing Details"
        text="Please ensure that all the checks are filled."
        icon={"Warning"}
      />

      <ModuleSimpleModal
        isOpen={successModal}
        setOpen={setSuccessModal}
        title="Success"
        text="Your checklist has been submitted for approval."
        icon={"Success"}
        onCloseCallback={leavePage}
      />
      <ModuleSimpleModal
        isOpen={offlineModal}
        setOpen={setOfflineModal}
        title="You are currently offline"
        text="Do you want to proceed? Your checklist will be stored and submitted automatically when internet connection is available"
        icon={"Offline"}
      >
        <HStack flexDirection="row">
          <VStack>
            <Button
              backgroundColor="#C70F2B"
              marginTop={2}
              marginRight={2}
              onPress={confirmOffline}
            >
              Confirm
            </Button>
          </VStack>
          <VStack>
            <Button
              backgroundColor="#C70F2B"
              marginTop={2}
              onPress={leaveOffline}
            >
              Cancel
            </Button>
          </VStack>
        </HStack>
      </ModuleSimpleModal>
    </ModuleScreen>
  );
};

export default CompleteChecklistPage;
