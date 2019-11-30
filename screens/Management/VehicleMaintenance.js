import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, Card, Icon, Overlay } from 'react-native-elements';
import { Table, Row, Rows, } from 'react-native-table-component';

/**
 * Esta vista es de las de gestion de mantenimiento vehiculo
 */

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
    isLoading: true,
    hasInfo: false,
    registroServicio: false,
    tableHead: ['Componente', 'Estado'],
    widthArr: [190, 90, 35],
    tableData: [],
    vehicle: this.props.navigation.getParam('vehicle', {})
  }

  async componentDidMount() {
    try {
      const result = await fetch('http://35.203.42.33:3006/webservice/interfaz124/obtener_status_motor', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_id_unidad: this.state.vehicle.id
        }),
      });
      
      const data = await result.json();
      
      if (data.datos.lenght != 0) {
        const datos = await data.datos[0];
        
        let newData = Object.keys(datos).map(key => {
          let elemento = [];
          if (key == 'funcionamiento_motor') {
            elemento.push('Funcionamiento del motor');
            if (datos[key] == 0) {
              elemento.push('Correcto');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Atención');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Mal funcionamiento');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'bateria') {
            elemento.push('Bateria');
            if (datos[key] == 0) {
              elemento.push('Correcto');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Bajo voltaje');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={12} />);
            } else {
              elemento.push('Descargada');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'tiempo_inactividad_motor') {
            elemento.push('Tiempo inactividad de motor');
            if (datos[key] == 0) {
              elemento.push('Normal');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Alto');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Excesivo');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'temp_aceite') {
            elemento.push('Temperatura aceite');
            if (datos[key] == 0) {
              elemento.push('Correcta');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Alta');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Muy alta');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'pres_aceite') {
            elemento.push('Presión de aceite');
            if (datos[key] == 0) {
              elemento.push('Correcta');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Alta');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Muy alta');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'temp_refrigerante_motor') {
            elemento.push('Teperatura refrigerante del motor');
            if (datos[key] == 0) {
              elemento.push('Correcta');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Alta');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Muy alta');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'niv_aceite') {
            elemento.push('Niveles de aceite');
            if (datos[key] == 0) {
              elemento.push('Correcto');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Bajo');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Muy bajo');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          } else if (key == 'pres_neumaticos') {
            elemento.push('Presión neumática');
            if (datos[key] == 0) {
              elemento.push('Correcto');
              elemento.push(<Icon name="check-circle" color='#20d447' size={14} />);
            } else if (datos[key] == 1) {
              elemento.push('Baja');
              elemento.push(<Icon name="warning" color='#ebcc1c' size={14} />);
            } else {
              elemento.push('Muy baja');
              elemento.push(<Icon name="warning" color='#e81a1a' size={14} />);
            }
            return elemento;
          }
        })

        this.setState({
          hasInfo: true,
          isLoading: false,
          tableData: newData
        })
      } else {
        Alert.alert('Info', 'No hay datos!');
        this.setState({
          isLoading: false
        })
      }
    } catch (error) {
      Alert.alert('Error', 'Ha ocurrido un error.');
      console.error(error);
      // this.props.navigation.goBack();
      this.setState({
        isLoading: false
    });
    }
  }

  render() {
    const state = this.state;
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
                onPress={() => { this.setState({ registroServicio: false }); this.props.navigation.navigate('RegisterMaintenanceM', { vehicle: state.vehicle }) }}>
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
                onPress={() => { this.setState({ registroServicio: false }); this.props.navigation.navigate('RegisterMaintenanceN', { vehicle: state.vehicle }) }} >
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
        <ScrollView>
        <View style={{ flexDirection: 'column' }}>
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
                source={{ uri: state.vehicle.imagen }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignSelf: 'center', height: 30 }}>
              <Text style={[styles.textoBold, {marginTop: 4}]}>{state.vehicle.nombre}</Text>
              <View style={{ width: 16, height: 16, marginTop: 6, marginLeft: 5, marginRight: 5, backgroundColor: state.vehicle.color, borderRadius: 8, borderColor: '#000', borderWidth: 1 }}></View>
              <Text style={[styles.textoNormal, {marginTop: 4}]}>- {state.vehicle.placas}</Text>
            </View>
          </View>

          <View style={{ alignSelf: 'center', height: 200, marginBottom: 15 }}>

            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={state.tableHead} widthArr={[190, 125]} style={styles.head} textStyle={[{ fontFamily: 'aller-bd' }, styles.text]} />
            </Table>
            {state.isLoading && <ActivityIndicator size="large" color="#ff8834" animating={state.isLoading} />}
            {
              !state.isLoading && state.hasInfo &&
              <ScrollView >
                <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                  <Rows data={state.tableData} widthArr={state.widthArr} textStyle={[{ fontFamily: 'aller-lt' }, styles.text]} />
                </Table>
              </ScrollView>
            }
          </View>

          <View>
            <TouchableOpacity
              onPress={() => this.setState({ registroServicio: true })} >
              <Card
                wrapperStyle={styles.touchableOpacity} >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon type='material-community' name="progress-wrench" size={24} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Registrar servicio</Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('ServicesConsultation', { vehicle: state.vehicle })} >
              <Card
                wrapperStyle={styles.touchableOpacity} >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <Icon type='font-awesome' name="search" size={20} iconStyle={{ marginVertical: 2 }} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Consultar servicios</Text>
                </View>
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('Alerts', { vehicle: state.vehicle }) }} >
              <Card
                wrapperStyle={styles.touchableOpacity} >
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                  <Icon type='material-community' name="alert-circle" size={22} />
                </View>
                <View style={styles.textoTouchable}>
                  <Text style={[styles.textoBold, { marginBottom: 1 }]}>Alertas</Text>
                </View>
              </Card>
            </TouchableOpacity>
          </View>
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
  head: { height: 32, backgroundColor: '#f1f8ff' },
  text: { margin: 6, fontSize: 12 },
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
    justifyContent: 'flex-start',
  },
  textoTouchable: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
