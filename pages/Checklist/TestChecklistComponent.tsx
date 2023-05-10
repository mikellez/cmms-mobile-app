import React, {useState} from 'react';
import {Text, StyleSheet} from 'react-native'
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons, ModuleDivider, ModuleCardContainer } from "../../components/ModuleLayout";
import { Input, Icon, TextArea, VStack, Button, IconButton, HStack, Heading } from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";
import ChecklistReadDetails from '../../components/Checklist/ChecklistReadDetails';


const TestChecklistComponent = ({navigation}) => {
    return <ModuleScreen navigation={navigation}>
            <ModuleHeader header="View Checklist">
                <HStack space={3}>
                    <Button 
                        w="30" 
                        padding={2} 
                        bg="#CCCCCC"
                        leftIcon={
                            <Icon as={AntDesign} name="arrowleft" size="sm"/>
                        } 
                        size="xs"
                        onPress={() => navigation.navigate("ChecklistTemplatesPage")}
                    ></Button>
                </HStack>
            </ModuleHeader>

            <ChecklistReadDetails header={"Checklist Name"} description={"Name1"}/>
            <ChecklistReadDetails header={"Description"} description={"Name1"}/>
            <ChecklistReadDetails header={"Plant"} description={"Name1"}/>

            <ModuleDivider></ModuleDivider>
            <Heading size="sm" color="#C8102E">Checklist Content</Heading>
            <ModuleCardContainer>
                <Text style={{marginBottom: 20}}>Section Header</Text>
                <ModuleCardContainer>
                    <Text style={{marginBottom: 20}}>Row</Text>
                    <ModuleCardContainer>
                        <Text style={{marginBottom: 20}}>Check 1</Text>
                    </ModuleCardContainer>
                    <ModuleCardContainer>
                        <Text style={{marginBottom: 20}}>Check 2</Text>
                    </ModuleCardContainer>
                </ModuleCardContainer>
            </ModuleCardContainer>

            

    </ModuleScreen>
    
}

const styles = StyleSheet.create({
    
})

export default TestChecklistComponent;