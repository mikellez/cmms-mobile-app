import React from "react";
import { ModuleCardContainer } from "../ModuleLayout";
import { CMMSChecklist } from "../../types/interfaces";
import { HStack, Text, VStack } from "native-base";
import { Pressable, StyleSheet } from "react-native";
import { ChecklistType } from "../../types/enums";

const ChecklistTemplate = ({navigation, checklist}: {navigation: any, checklist: CMMSChecklist}) => {
    return (
        <Pressable onPress={() => {
                navigation.navigate("CreateChecklistFormPage",  { checklistId: checklist.checklist_id, checklistType: ChecklistType.Template })
            }
        }
        >
            <ModuleCardContainer>
                <VStack>
                    <Text style={styles.title}>{checklist.chl_name}</Text>
                    <HStack space={1}>
                        <Text style={styles.header}>Description:</Text>
                        <Text 
                            numberOfLines={1} 
                            ellipsizeMode="tail"
                            style={styles.description}
                        >{checklist.description}</Text>
                    </HStack>
                </VStack>
            </ModuleCardContainer>  
        </Pressable>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
        fontWeight: "600",
    }, 

    header: {
        fontWeight: "500",
    },

    description: {
        maxWidth: 230,
    }
})

export default ChecklistTemplate;