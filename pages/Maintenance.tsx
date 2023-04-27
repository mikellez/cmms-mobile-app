import React, { useState, useEffect } from "react";
import { HStack, Heading, Text } from "native-base";
import App from './App';
import ListBox from "../components/Checklist/ListBox";
import instance from "../axios.config";

const fetchChecklist = async () => {
    try {
        const response = await instance.get("/api/checklist/pending");
        return response.data;

    } catch (err) {
        console.log(err)
    };
};

const Maintenance = ({ navigation }) => {
    const [checklists, setChecklists] = useState([]);

    useEffect(() => {
        fetchChecklist()
            .then(result => setChecklists(result))
    }, []);

    const checklistElements = checklists.map(cl => {
        return (
            <ListBox key={cl.checklist_id} item={cl} navigation={navigation} />
        )
    })

    return (
        <App navigation={navigation}>
            <HStack px="5" py="5" w="100%" justifyContent="space-between">
                <Heading size="md" color="#C8102E">Maintenance</Heading>
            </HStack>
            {checklistElements}
        </App>
    );
};

export default Maintenance;