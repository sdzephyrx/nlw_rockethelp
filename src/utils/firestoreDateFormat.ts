import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp){
    if(timestamp){
        const date = new Date(timestamp.toDate());
        const dia = date.toLocaleDateString('pt-BR');
        const hora = date.toLocaleTimeString('pt-BR');

        return `${dia} às ${hora}`;
    }
}