import React, { useEffect, useState, createContext, useRef } from "react";
import {
  ModuleScreen,
  ModuleHeader,
  ModuleSimpleModal,
} from "../../components/ModuleLayout";
import instance from "../../axios.config";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistTemplate from "../../components/Checklist/ChecklistTemplate";
import {
  Icon,
  VStack,
  Text,
  Center,
  TextArea,
  FormControl,
  Button,
  HStack,
  Modal,
  KeyboardAvoidingView,
} from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import ChecklistDetails from "../../components/Checklist/ChecklistDetails";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistEditableProvider from "../../context/checklistContext";
import ChecklistEditableForm from "../../components/Checklist/ChecklistFillableForm";
import ChecklistHeader from "../../components/Checklist/ChecklistHeader";
import { Action } from "../../types/enums";
import { fetchSpecificChecklist } from "../../api";

const manageChecklist = async (
  url: "approve" | "reject",
  checklistId: number,
  remarks?: string
) => {
  try {
    await instance.patch(`/api/checklist/${url}/${checklistId}`, { remarks });
  } catch (err) {
    console.log(err);
  }
};

const ManageChecklistPage = ({ navigation, route }) => {
  const [checklist, setChecklist] = useState<CMMSChecklist>(
    {} as CMMSChecklist
  );
  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [managerComments, setManagerComments] = useState<string>("");
  const [warningModal, setWarningModal] = useState<boolean>(false);
  const [approveModal, setApproveModal] = useState<boolean>(false);
  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const sectionsRef = useRef<ChecklistSection[]>([]);


  useEffect(() => {
    console.log(route.params);
    if (route.params) {
      fetchSpecificChecklist(route.params.checklist_id).then((res) => {
        setChecklist(res)
      });
    }
  }, [route.params]);

  useEffect(() => {
    // console.log(JSON.parse(checklist.datajson));
    if (checklist && checklist.datajson) {
      setSections(
        checklist.datajson.map((section) => ChecklistSection.fromJSON(section))
      );
      sectionsRef.current = checklist.datajson.map((section) => ChecklistSection.fromJSON(section));
    }
  }, [checklist]);

  const handleButtonPress = (action: Action) => {
    if (action === Action.Approve) {
      approveChecklist();
    } else if (action === Action.Reject) {
      rejectChecklist();
    }
  };

  const approveChecklist = () => {
    manageChecklist("approve", checklist.checklist_id);
    setApproveModal(true);
    leavePage();
  };

  const rejectChecklist = () => {
    if (managerComments.trim().length === 0) {
      setWarningModal(true);
      return;
    }
    setRejectModal(true);
    manageChecklist("reject", checklist.checklist_id, managerComments);
    leavePage();
  };

  const leavePage = () => {
    setTimeout(() => {
      navigation.navigate("Maintenance");
    }, 1000);
  };

  const header = (
    <Center>
      <ChecklistDetails checklist={checklist}></ChecklistDetails>
    </Center>
  );

  const footer = (
    <VStack space={2} marginBottom={100}>
      <FormControl.Label>Manager's Comments</FormControl.Label>
      <TextArea
        autoCompleteType={true}
        value={managerComments}
        onChangeText={(text) => setManagerComments(text)}
      />

      <HStack width="full">
        <Button
          width="45%"
          backgroundColor="#E64848"
          onPress={(e) => handleButtonPress(Action.Reject)}
        >
          Reject
        </Button>

        <Button
          width="45%"
          marginLeft="auto"
          backgroundColor="#36AE7C"
          onPress={(e) => handleButtonPress(Action.Approve)}
        >
          Approve
        </Button>
      </HStack>
      <HStack width="full">
        <Text></Text>
      </HStack>
      <HStack width="full">
        <Text></Text>
      </HStack>
      <HStack width="full">
        <Text></Text>
      </HStack>
    </VStack>
  );

  return (
    <ModuleScreen navigation={navigation} layout={"form"}>
      <ChecklistHeader navigation={navigation} header={"Manage Checklist"} />

      <ChecklistEditableProvider
        sections={sections}
        setSections={setSections}
        sectionsRef={sectionsRef}
        isDisabled
      >
        <ChecklistEditableForm header={header} footer={footer} />
      </ChecklistEditableProvider>

      <ModuleSimpleModal
        isOpen={warningModal}
        setOpen={setWarningModal}
        title="Missing Comments"
        text="Please provide comments for rejection."
        icon={"Warning"}
      />

      <ModuleSimpleModal
        isOpen={approveModal}
        setOpen={setApproveModal}
        title="Done"
        text="Checklist has been approved."
        icon={"Success"}
      />

      <ModuleSimpleModal
        isOpen={rejectModal}
        setOpen={setRejectModal}
        title="Done"
        text="Checklist has been rejected."
        icon={"Success"}
      />
    </ModuleScreen>
  );
};

export default ManageChecklistPage;
