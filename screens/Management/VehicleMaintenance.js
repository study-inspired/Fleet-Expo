import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Button, Card, Icon, Overlay } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';

/**
 * Esta vista es de las de gestion de mantenimiento vehiculo
 */

const tabla_estados = [
  ['Funcionamiento del motor', 'Correcto', 1],
  ['Bateria', 'Bajo voltaje', 2],
  ['Tiempo inactividad del motor', 'Excesivo', 3],
  ['Temp */ presion del aceite', 'Alto', 3],
  ['Temp * del refrigerante del motor', 'Correcto', 1],
  ['Niveles de aceite', 'Nivel correcto', 1],
  ['Presion de neumaticos', 'Baja', 2]
]


export default class VehicleMaintenance extends Component {
  static navigationOptions = {
    title: 'Mantenimiento de vehículo',
    headerTitleStyle: {
      flex: 1,
      textAlign: "center",
      fontFamily: 'aller-bd',
      fontWeight: '200',
      fontSize: 18,
    },
    headerRight: <View></View>,
  }

  state = {
    registroServicio: false,
    tableHead: ['Componente', 'Estado', ' '],
    widthArr: [190, 90, 35],
    tableData: tabla_estados.map((estado) => {
      if (estado[2] == 1) {
        estado[2] = <Icon name="check-circle" color='#20d447' size={12} />
      } else if (estado[2] == 2) {
        estado[2] = <Icon name="warning" color='#ebcc1c' size={12} />
      } else {
        estado[2] = <Icon name="warning" color='#e81a1a' size={12} />
      }
      return estado
    })
  }

  render() {
    const state = this.state;
    const vehicle = this.props.navigation.getParam('vehicle', {})
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Overlay
          overlayStyle={{ width: 350 }}
          isVisible={this.state.registroServicio}
          windowBackgroundColor="rgba(0, 0, 0, .4)"
          height="auto"
        >
          <View style={{ marginBottom: 15 }}>
            <Card>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => { this.setState({ registroServicio: false }); this.props.navigation.navigate('RegisterMaintenance', { vehicle: vehicle, tipo: 'mecánico' }) }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon type='material-community' name="engine-outline" size={24} />
                </View>
                <View style={{
                  flex: 2,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Servicio mecánico</Text>
                </View>
              </TouchableOpacity>
            </Card>
            <Card>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => { this.setState({ registroServicio: false }); this.props.navigation.navigate('RegisterMaintenance', { vehicle: vehicle, tipo: 'neumático' }) }} >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon type='material-community' name="circle-slice-8" size={24} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Servicio neumático</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        </Overlay>
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View>
            <Button
              type='clear'
              icon={{
                name: "help",
                size: 32,
                color: '#ff8834'
              }}
              containerStyle={{ flex: 1 }}
              buttonStyle={{
                position: 'absolute',
                flexDirection: 'column',
                right: 0,
              }}
              iconContainerStyle={{
                flex: 1,
              }}
              titleStyle={{
                flex: 1,
                fontFamily: 'aller-lt',
                fontSize: 12,
                bottom: 0,
              }}
              title="Ayuda"
            />
            <View>
              <Image
                style={{ width: 150, height: 150, alignSelf: 'center' }}
                resizeMode="cover"
                source={{ uri: vehicle.imagen }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
              <Text style={styles.texto700}>{vehicle.nombre}</Text>
              <View style={{ width: 16, height: 16, marginTop: 4, marginLeft: 5, marginRight: 5, backgroundColor: vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
              <Text style={styles.texto600}>- {vehicle.placa}</Text>
            </View>
          </View>

          <View style={{ alignSelf: 'center' }} >

            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.head} textStyle={styles.text} />
              <Rows data={state.tableData} widthArr={state.widthArr} textStyle={styles.text} />
            </Table>

          </View>

          <View style={{ marginBottom: 12 }}>

            <Card>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => this.setState({ registroServicio: true })}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon type='material-community' name="progress-wrench" size={24} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Registrar servicio</Text>
                </View>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => this.props.navigation.navigate('ServicesConsultation', { vehicle: vehicle })}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <Icon type='font-awesome' name="search" size={20} iconStyle={{ marginVertical: 2 }} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Consultar servicios</Text>
                </View>
              </TouchableOpacity>
            </Card>

            <Card>
              <TouchableOpacity
                style={styles.touchableOpacity}
                onPress={() => { this.props.navigation.navigate('Alerts') }}>
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <Icon type='material-community' name="alert-circle" size={22} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Alertas</Text>
                </View>
              </TouchableOpacity>
            </Card>

          </View>
        </ScrollView>
      </SafeAreaView>

    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { flex: 1, padding: 20, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 35, backgroundColor: '#f1f8ff' },
  small: { height: 40, backgroundColor: '#f1f8ff', width: 20 },
  text: { margin: 6, fontSize: 10 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  textoNormal: {
    fontFamily: 'aller-lt',
    fontSize: 14,
  },
  textoBold: {
    fontFamily: 'aller-bd',
    fontSize: 14,
  },
  touchableOpacity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textoTouchable: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
