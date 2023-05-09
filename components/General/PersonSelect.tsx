import React, { useState, useEffect } from "react";
import { Select } from "native-base";
import instance from "../../axios.config";
import { CMMSUser } from "../../types/interfaces";

interface PersonSelectProps {
    value?: string,
    onChange: (itemValue: string) => void,
    placeholder?: string,
    plantId?: number,
};

async function fetchUsers(plantId: number) {
    return await instance
      .get<CMMSUser[]>("/api/getAssignedUsers/" + plantId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err.message));
  }

const PersonSelect = (props: PersonSelectProps) => {
    const [users, setUsers] = useState<CMMSUser[]>([]);

    useEffect(() => {
        if (props.plantId) {
            fetchUsers(props.plantId).then(result => {
                if (result) setUsers(result); 
            });
        } else setUsers([]);
    }, [props.plantId]);
    
    const options = users.map(user => {
        return (
            <Select.Item 
                key={user.id} 
                label={user.name + " | " + user.email} 
                value={user.id.toString()} 
            />
        )
    })

    return (
        <Select
            placeholder={props.placeholder ? props.placeholder : "Assign To"} 
            selectedValue={props.value ? props.value : null}
            onValueChange={props.onChange}
            
        >
            {options}
        </Select>
    )
}

export { PersonSelect }