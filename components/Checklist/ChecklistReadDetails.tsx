import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native'
import { ModuleScreen, ModuleHeader, ModuleSimpleModal, ModalIcons } from "../../components/ModuleLayout";
import { Input, Icon, TextArea, VStack, Button, IconButton, HStack } from "native-base";
import AntDesign from "react-native-vector-icons/AntDesign";

interface detailProps {
    header: string;
    description: string;
}

const ChecklistReadDetails = (props: detailProps) => {
    return <View style={styles.detail}>
        <Text style={styles.detailHeader}>{props.header}</Text>
        <Text>{props.description}</Text>
    </View>
}

const styles = StyleSheet.create({
    detailHeader: {
        fontWeight: "bold",
        fontSize: 16
    },
    detail: {
        marginVertical: 10,
    }
})

export default ChecklistReadDetails;