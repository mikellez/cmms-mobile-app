import instance from "../axios.config";

const fetchSpecificChecklist = async (checklistId: number) => {
  try {
    const res = await instance.get(`/api/checklist/record/${checklistId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    console.log('Unable to fetch specific checklists')
  }
}

export {
  fetchSpecificChecklist
}