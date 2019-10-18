/**
 * @format
 * @flow
 */

import React, { Fragment } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
} from 'react-native';

import { Button, Icon, Overlay } from 'react-native-elements'

class SeeDriver extends React.Component {
    static navigationOptions = {
        mode: "modal",
        header: null
    }
    render() {
        return (
            <Overlay
                overlayStyle={{width: 300, flexDirection:'row'}}
                isVisible={true}
                windowBackgroundColor="rgba(0, 0, 0, .4)"
                overlayBackgroundColor="red"
                height="auto"
            >
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <Icon
                        name='check-circle'
                        color='#20d447'
                        size={104}
                    />
                </View>
                <View style={{flex: 1}}>
                <View>
                    <Text style={styles.textoNormal}>Carlos Peralta</Text>
                    <Text style={{ marginTop: 30, textAlign: 'center' }}>32 Años</Text>
                    <Text style={{ textAlign: 'center' }}>3128976542</Text>
                </View>
                <Button
                    title='OK'
                    buttonStyle={{ margin: 15 }}
                    onPress={() => { this.props.navigation.navigate('Drivers') }}
                />
                </View>
                
            </Overlay>

        );
    }

}

const styles = StyleSheet.create({
    textoNormal: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 16,
        marginVertical: 5
    }
});

export { SeeDriver };