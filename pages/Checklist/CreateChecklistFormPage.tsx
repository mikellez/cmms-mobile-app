import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { Icon, Button, IconButton, HStack } from "native-base";
import {
  ModuleScreen,
  ModuleHeader,
  ModuleSimpleModal,
} from "../../components/ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import ChecklistForm from "../../components/Checklist/ChecklistForm";
import ChecklistSection from "../../components/Checklist/classes/ChecklistSection";
import ChecklistCreator from "../../components/Checklist/ChecklistCreator";
import instance from "../../axios.config";
import { useCurrentUser } from "../../helper/hooks/SWR";
import { ChecklistCreateContextProvider } from "../../context/checklistContext";
import { ChecklistType } from "../../types/enums";

const fetchSpecificChecklist = async (
  id: number,
  type: ChecklistType
): Promise<CMMSChecklist | void> => {
  try {
    console.log(`/api/checklist/${type}/${id}`)
    const response = instance.get(`/api/checklist/${type}/${id}`);
    return (await response).data;
  } catch (err) {
    console.log(err);
  }
};

const createChecklist = async (checklist: CMMSChecklist) => {
  try {
    instance.post("/api/checklist/record/", { checklist });
  } catch (err) {
    console.log(err);
  }
};

const CreateChecklistFormPage = ({ navigation, route }) => {
  const [checklist, setChecklist] = useState({} as CMMSChecklist);
  const [incompleteModal, setIncompleteModal] = useState<boolean>(false);
  const [successModal, setSuccessModal] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [sections, setSections] = useState<ChecklistSection[]>([]);
  const [level, setLevel] = useState<number>();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  console.log(sections)

  const { checklistId, checklistType } = route.params;

  const user = useCurrentUser();

  const editChecklist = async (checklist: CMMSChecklist) => {
    try {
      instance.patch(`/api/checklist/record/${checklist.checklist_id}`, {
        checklist,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const pageTitle =
    checklistType === ChecklistType.Template
      ? "Create Checklist"
      : "Edit Checklist";
  const backPage =
    checklistType === ChecklistType.Template
      ? "ChecklistTemplatesPage"
      : "Maintenance";
  const successModalText =
    checklistType === ChecklistType.Template
      ? "New checklist successfully created"
      : "Checklist successfully edited";

  const APICall = async (checklist: CMMSChecklist) => {
    if (checklistType === ChecklistType.Template) {
      return await createChecklist(checklist);
    }
    return await editChecklist(checklist);
  };

  const handleSubmit = () => {
    setLoadingModal(true);
    setSubmitting(true);
  };

  console.log(loadingModal);

  useEffect(() => {
    if (loadingModal && isSubmitting) {
      /*setTimeout(() => {
        setLevel(3);
      }, 2000);*/
    }
  }, [loadingModal, isSubmitting]);

  const toDataJSON = (sections: ChecklistSection[]) => {
    return sections.map((section) => section.toJSON());
  };

  const validateChecklistFormData = (checklist: CMMSChecklist) => {
    return (
      !!checklist.datajson &&
      !!checklist.description &&
      checklist.description.trim() != "" &&
      !!checklist.chl_name &&
      checklist.chl_name.trim() != "" &&
      !!checklist.linkedassetids &&
      checklist.linkedassetids != ""
    );
  };

  const updateChecklistDataJSON = async () => {
    setChecklist((prevChecklist) => {
      const newChecklist = { ...prevChecklist };
      newChecklist.datajson = toDataJSON(sections);
      return newChecklist;
    });
  };

  const leavePage = () => {
    navigation.navigate("Maintenance");
  };

  useEffect(() => {
    if (checklist && !isSubmitting) {
      setLoadingModal(false);
    }

    if (isSubmitting) {
      if (!validateChecklistFormData(checklist)) {
        setLoadingModal(false);
        setIncompleteModal(true);
      } else {
        APICall(checklist).then((res) => {
          setLoadingModal(false);
          setSuccessModal(true);
        });
      }
    }

    setSubmitting(false);
  }, [checklist, isSubmitting]);

  if (level === 0) {
    updateChecklistDataJSON();
    setLevel(undefined);
  }

  useEffect(() => {
    setLoadingModal(true);

    if (checklistId) {
      fetchSpecificChecklist(checklistId, checklistType).then((data) => {
        if (data) {
          setChecklist({
            ...data,
            createdbyuser: user.data.name,
            created_by_user_id: user.data.id,
          });

          setSections(
            data.datajson.map((section) => ChecklistSection.fromJSON(section))
          );
        }
      });
    } else {
      setChecklist({
        createdbyuser: user.data.name,
        created_by_user_id: user.data.id,
      } as CMMSChecklist);
    }
  }, [checklistId, checklistType]);

  const header = (
    <ChecklistForm checklist={checklist} setChecklist={setChecklist} />
  );
  const footer = (
    <IconButton
      _icon={{
        as: Feather,
        name: "send",
      }}
      colorScheme="white"
      variant="solid"
      backgroundColor="#C8102E"
      onPress={handleSubmit}
      disabled={isSubmitting}
    />
  );

  return (
    <ModuleScreen navigation={navigation}>
      <ModuleHeader header={pageTitle}>
        <HStack space={3}>
          <Button
            w="30"
            padding={2}
            bg="#CCCCCC"
            leftIcon={<Icon as={AntDesign} name="arrowleft" size="sm" />}
            size="xs"
            onPress={() => navigation.navigate(backPage)}
          ></Button>
        </HStack>
      </ModuleHeader>

      <ChecklistCreateContextProvider
        sections={sections}
        setSections={setSections}
        level={level}
        setLevel={setLevel}
      >
        <ChecklistCreator header={header} footer={footer} />
      </ChecklistCreateContextProvider>

      {/* <IconButton  
                _icon={{
                    as: Feather,
                    name: "send"
                }}
                colorScheme="white"
                variant="solid"
                backgroundColor="#C8102E"
                onPress={handleSubmit}
                disabled={isSubmitting}
            /> */}

      <ModuleSimpleModal
        isOpen={incompleteModal}
        setOpen={setIncompleteModal}
        title="Missing Details"
        text="Ensure that all fields have been filled"
        icon={"Warning"}
      />

      <ModuleSimpleModal
        isOpen={loadingModal}
        setOpen={setLoadingModal}
        title={isSubmitting ? "Submitting Checklist" : "Loading Checklist"}
        text=""
        // hideCloseButton
      >
        <View>
          <ActivityIndicator size="large" color="#C8102E" />
        </View>
      </ModuleSimpleModal>

      <ModuleSimpleModal
        isOpen={successModal}
        setOpen={setSuccessModal}
        title="Success"
        text={successModalText}
        icon={"Warning"}
        onCloseCallback={leavePage}
      />
    </ModuleScreen>
  );
};

const styles = StyleSheet.create({});

export default CreateChecklistFormPage;
