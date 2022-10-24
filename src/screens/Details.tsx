import { HStack, VStack, useTheme, Text, ScrollView, Box } from 'native-base';
import { Header } from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { OrderProps } from '../components/Order';
import firestore from '@react-native-firebase/firestore';
import { OrderFirestoreDTO } from '../DTOs/OrderFirestoreDTO';
import { dateFormat } from '../utils/firestoreDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string
}

type OrderDetails = OrderProps & {
  descricao: string;
  solucao: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solucao, setSolucao] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);
  const route = useRoute();
  const {colors} = useTheme();
  const{orderId} = route.params as RouteParams;
  const navigation = useNavigation();

  function handleOrderClose(){
    if(solucao === ''){
      Alert.alert('Solicitação', 'Informe a solução para encerrar a solicitoção.')
    }else{
      firestore()
        .collection<OrderFirestoreDTO>('orders')
        .doc(orderId)
        .update({
          status: 'closed',
          solucao,
          closed_at: firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          Alert.alert('Solicitação', 'Solicitação encerrada.')
          navigation.goBack();
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Solicitação', 'Não foi possivel encerrar a solicitação.');
        });
    }

  }

  useEffect(()=>{
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc)=>{
        const {
          patrimonio,
          descricao,
          status,
          created_at,
          closed_at,
          solucao
        } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimonio,
          descricao,
          status,
          solucao,
          when: dateFormat(created_at),
          closed
        });

        setIsLoading(false);
      });
  }, []);

  if(isLoading){
    return <Loading />
  }
  
  return (
    <VStack
        flex={1}
        bg="gray.700"
    >
      <Box
        px={6}
        bg="gray.600"
      >
        <Header 
            title="Solicitação"
        />
      </Box>
        <HStack
          bg="gray.500"
          justifyContent="center"
          p={4}
        >
          {
            order.status === 'closed'
            ? <CircleWavyCheck 
              size={22}
              color={colors.green[300]}
            />
            : <Hourglass 
            size={22}
            color={colors.secondary[700]}
          />
          }
          <Text
            fontSize="sm"
            color={
              order.status === 'closed' 
              ? colors.green[300]
              : colors.secondary[700]
            }
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          </Text>
        </HStack>

        <ScrollView
          mx={5}
          showsVerticalScrollIndicator={false}
        >
          <CardDetails 
            title="Equipamento"
            description={`Patrimonio ${order.patrimonio}`}
            icon={DesktopTower}
          />

          <CardDetails 
            title="Descrição do problema"
            description={order.descricao}
            icon={ClipboardText}
            footer={`Registrado em ${order.when}`}
          /> 

          <CardDetails 
            title="Solução"
            icon={CircleWavyCheck}
            description={order.solucao}
            footer={order.closed && `Encerrado em ${order.closed}`}
          >
            {
              order.status === 'open' &&
              <Input 
                placeholder='Descricao da solução'
                onChangeText={setSolucao}
                textAlignVertical="top"
                multiline
                h={24}
              />
            }
          </CardDetails>
        </ScrollView>
        {
          order.status === 'open' && 
          <Button 
            title="Encerrar solicitação"
            m={5}
            onPress={handleOrderClose}
          />
        }
    </VStack>
  );
}