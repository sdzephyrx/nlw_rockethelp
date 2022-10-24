import { useState } from 'react'; 
import { VStack } from 'native-base';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';
import firestore from  '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';


export function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [patrimonio, setPatrimonio] = useState('');
    const [descricao, setDescricao] = useState('');
    const navigation = useNavigation();

    function handleNewOrderRegister(){
        if(!patrimonio || !descricao){
            Alert.alert('Registrar', 'Preencha os campos.');
        }

        setIsLoading(true);

        firestore()
        .collection('orders')
        .add({
            patrimonio,
            descricao,
            status: 'open',
            created_at: firestore.FieldValue.serverTimestamp()
        })
        .then(()=>{
            Alert.alert('Solicitação', 'Solicitação registrada com sucesso.')
            navigation.goBack();
        })
        .catch((error)=>{
            console.log(error);
            setIsLoading(false);
            return Alert.alert('Solicitação', 'Erro ao registrar a solicitação.')
        })
    }

  return (
    <VStack
        flex={1}
        p={6}
        bg="gray.600"
    >
        <Header 
            title="Nova Solicitação"
        />
        <Input 
            placeholder='Patrimonio'
            mt={4}
            onChangeText={setPatrimonio}
        />
        <Input 
            placeholder='Descrição do problema'
            mt={5}
            flex={1}
            multiline
            textAlignVertical='top'
            onChangeText={setDescricao}
        />
        <Button 
            title="Cadastrar"
            mt={5}
            isLoading={isLoading}
            onPress={handleNewOrderRegister}
        />
    </VStack>
  );
}