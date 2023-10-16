const initialState = {
    TrainermodalOpened: false,
    TrainerconfirmDirty: false,
    Trainermode: 'Register',
    trainerId: null,
    TrainersearchText: '',
    trainerTableLoadingStatus: false,
    trainerEditFormLoadingStatus: false,
    trainerTableData: [],
    trainerdetails: {},
    subjectTableData: [],
    SubjectmodalOpened: false,
    SubjectconfirmDirty: false,
    Subjectmode: 'New Topic',
    SubjectId: null,
    SubjectsearchText: '',
    SubjectTableLoading: false,
    subjectDetails: {},
};

export default function adminReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case 'CHANGE_TRAINER_MODAL_STATE':
            return {
                ...state,
                TrainermodalOpened: payload[0],
                trainerId: payload[1],
                Trainermode: payload[2],
                trainerdetails: payload[3],
            };
        case 'CHANGE_TRAINER_FORM_CONFIRMDIRTY':
            return {
                ...state,
                TrainerconfirmDirty: payload,
            };
        case 'CHANGE_TRAINER_SEARCH_TEXT':
            return {
                ...state,
                TrainersearchText: payload,
            };
        case 'CHANGE_TRAINER_TABLE_LOADING_STATUS':
            return {
                ...state,
                trainerTableLoadingStatus: payload[0],
                trainerTableData: payload[1],
            };
        case 'CHANGE_SUBJECT_MODAL_STATE':
            return {
                ...state,
                SubjectmodalOpened: payload[0],
                SubjectId: payload[1],
                Subjectmode: payload[2],
                subjectDetails: payload[3],
            };
        case 'CHANGE_SUBJECT_FORM_CONFIRMDIRTY':
            return {
                ...state,
                SubjectconfirmDirty: payload,
            };
        case 'CHANGE_SUBJECT_SEARCH_TEXT':
            return {
                ...state,
                SubjectsearchText: payload,
            };
        case 'CHANGE_SUBJECT_TABLE_LOADING_STATUS':
            return {
                ...state,
                SubjectTableLoading: payload[0],
                subjectTableData: payload[1],
            };
        default:
            return state;
    }
}