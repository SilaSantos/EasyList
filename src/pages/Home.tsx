import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Image, TextInput, FlatList, Modal, TouchableOpacity} from "react-native";


import { TextInputMask } from 'react-native-masked-text';
import Toast from 'react-native-toast-message';

import { Button } from "../components/Button";
import { ItemCard } from "../components/ItemCard";


interface NewItems {
    id: string,
    name: string,
    price: string,
    quant: string,
}

export function Home(){
    const [greeting, setGreeting] = useState('');
    const [nameProduct, setNameProduct] = useState('');
    const [price, setPrice] = useState('');
    const [quant, setQuant] = useState('');
    const [newItem, setNewItem] = useState<NewItems[]>([]);
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<NewItems | null>(null);


    function validateInputs(nameProduct: string, price: string, quant: string){
        if(nameProduct === '') {
            Toast.show({
                type: 'error',
                text1: "Atenção",
                text2: "O nome do produto não pode estar vazio.",
              });
            return false;
        }
        const numericPrice = Number(price.replace(/[^0-9.-]+/g, ''));

        if (!Number.isInteger(Number(quant)) || Number(quant) <= 0) {
            Toast.show({
                type: 'error',
                text1: "Atenção",
                text2: "A quantidade não pode estar zerado.",
              });
            return false;
        }
        if (isNaN(numericPrice) || numericPrice <=0 ) {
            Toast.show({
                type: 'error',
                text1: "Atenção",
                text2: "O preço não pode estar zerado.",
              });
            return false;
        }

        return true;
    }

    //Função para adicionar o produto novo
    function handleAddNewItem(){

        if(!validateInputs(nameProduct, price,quant )){
            return;
        }
         // Remover qualquer formatação e garantir que o preço tenha ponto como separador decimal
        const formattedPrice = price.replace(/[^0-9,.-]+/g, '').replace(',', '.');  // Substituir vírgula por ponto
        const numberPrice = parseFloat(formattedPrice);  // Converter para número
        const numberQuant = Number(quant);  // Converter quantidade para número

        const data = {
            id: String(new Date().getTime()),
            name: nameProduct,
            price: price,
            quant: quant,
        }
        setNewItem(oldState => [...oldState, data]);

        const newTotal = total + numberPrice * numberQuant;
        setTotal(newTotal);

        setNameProduct('');
        setPrice('');
        setQuant('');

        
    }

    //Função para deletar a linha do produto
    function handleRemoveItem(id: string){
        // Encontre o item a ser removido
        const itemToRemove = newItem.find(item => item.id === id);
  
        if (itemToRemove) {
            // Calcule o valor do item removido (quantidade * preço)
            const numericPrice = parseFloat(itemToRemove.price.replace(/[^0-9,.-]+/g, '').replace(',', '.'));
            const numericQuant = Number(itemToRemove.quant);

            // Subtraia o valor do item removido do total
            const newTotal = total - numericPrice * numericQuant;

            // Atualize o estado do total e da lista de itens
            setTotal(newTotal);
        setNewItem(oldState => oldState.filter(
            item => item.id !== id
        ))
    }
}

    function handleItemPress(item: NewItems) {
        setSelectedItem(item);
        setModalVisible(true);
    }
    
    const MonthNow = String(new Date().getMonth() + 1).padStart(2, '0'); 
    const dayNow = String(new Date().getDate()).padStart(2, '0');
    const yearNow = new Date().getFullYear();
    const dateNow = `${dayNow}/${MonthNow}/${yearNow}`;

    useEffect(() => {
        const currentHour = new Date().getHours();

        if(currentHour < 12){
            setGreeting('☀️ Good morning!');
        }else if(currentHour >= 12 && currentHour < 18){
            setGreeting('🌤️ Good Afternoon!');
        }else{
            setGreeting('🌙 Good night!')
        }
    }, [newItem]);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../image/logos.png')} style={{width: 45, height: 45}}/>
                    <Text style={styles.title}>EasyList</Text>
                </View>
                    <Text style={styles.greetings}>{greeting}</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Nome do produto"
                placeholderTextColor='#555'
                onChangeText={setNameProduct}
                value={nameProduct}
            />
            <View style={styles.groupInput}>
                <TextInputMask
                    style={[styles.groupInputChild, {width:'35%'}]}
                    type={'only-numbers'}
                    placeholder="Quantidade"
                    placeholderTextColor='#555'
                    onChangeText={setQuant}
                    value={quant}
                />
                <TextInputMask
                    style={[styles.groupInputChild, {width: '50%'}]}
                    type={'money'}
                    maxLength={12}
                    placeholder="Preço"
                    placeholderTextColor='#555'
                    onChangeText={setPrice}
                    value={price}
                />
            </View>

            <Button title="Adicionar" onPress={handleAddNewItem}/>

            <View style={styles.contentTotal}>
                <Text style={styles.titleList}>Lista do dia {dateNow}</Text>
                <Text style={styles.titleTotal}>Total: {total.toFixed(2)}</Text>
            </View>

            {
                newItem.length === 0 ? 
               
                <View style={styles.contentLoading}>
                    <Image source={require('../image/list.png')} style={styles.imageLoading}/>
                    <Text style={styles.textLoading}>Sua lista está vazia</Text>
                </View>
                : 
                <FlatList
                    data={newItem}
                    keyExtractor={item => item.id}
                    style={styles.flatList}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                            <ItemCard name={item.name} price={item.price} quant={item.quant} onNamePress={() => handleItemPress(item)} onPress={() => handleRemoveItem(item.id)}/>
                    )}
                />
            }

            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
            
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Detalhes do Produto</Text>
                        {selectedItem && (
                        <>
                            <Text style={styles.modalText}>
                                Nome: {selectedItem.name}
                            </Text>
                            <Text style={styles.modalText}>
                                Quantidade: {selectedItem.quant}
                            </Text>
                            <Text style={styles.modalText}>
                                Preço: {selectedItem.price}
                            </Text>
                        </>
                        )}
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.buttonModal}>
                            <Text style={styles.buttonTextModal}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>

            <Toast /> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121015',
        paddingHorizontal: 20,
        paddingTop: 50
    },
    header: { 
        justifyContent: 'center',
        gap:5,
        alignItems: 'center',
    },
    flatList: {
        marginTop: 30,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        marginBottom: 5
    },
    img: {
        width: 45,
        height: 45,
        borderRadius: 8
    },
    input: {
        backgroundColor: '#1F1E25',
        color: '#FFFFFF',
        fontSize: 18,
        padding: 15,
        marginTop: 30,
        borderRadius: 7
    },
    groupInput: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        width: '100%'
    },
    groupInputChild: {
        backgroundColor: '#1F1E25',
        color: '#FFFFFF',
        fontSize: 18,
        padding: 12,
        borderRadius: 7,
        width: 160
    },
    greetings: {
        color: '#FFFFFF'
    },
    titleList: {
        color: '#CCC',
        fontSize: 15
    },
    contentTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleTotal: {
        color: '#CCC'
    },
    contentLoading: {
        marginTop: 130,
        alignItems: 'center'
    },
    imageLoading: {
        width: 150,
        height: 150,
    },
    textLoading: {
        color: '#FFFFFF', 
        fontStyle: 'italic'
    },
      modalContainer: {
        backgroundColor: 'transparent', // Deixe o fundo do container transparente
        justifyContent: 'flex-end', // Garante que o modal fique na parte inferior
        alignItems: 'center', // Centraliza horizontalmente
        flex: 1,
      },
      modalContent: {
        width: "100%",
        height: 'auto',
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: 'center'
      },
      modalText: {
        fontSize: 16,
        marginBottom: 5,
      },
      buttonModal: {
        backgroundColor: '#d35454',
        padding: 12,
        borderRadius: 7,
        alignItems: 'center',
        marginVertical: 30
    },
    buttonTextModal: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold'
    }
})