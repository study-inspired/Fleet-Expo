/**
 * @format
 * @flow
 */

import React from 'react';
// import server_address from '../../constants/Globals'
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar,
  TouchableNativeFeedback
} from 'react-native';

import { Button, Icon, Divider, Badge } from 'react-native-elements';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default class InfoDriver extends React.Component {

  static navigationOptions = {
    header: null
  };


  constructor(props) {
    super(props);
    // this.socket = io.connect('http://35.203.42.33:3001/');
    this.state = {
      isLoading: true,
      hascommentary: true,
      conductor: {},
      logros: {
        viajesconFestrellas: "90"
      },
      comentarios: [],
      id_propietario: this.props.navigation.getParam('id_propietario', 0),
      id_conductor: this.props.navigation.getParam('id_usuario', 0),
      notification: {}
    }

    this.socket = this.props.screenProps.socket;
    this.socket.off('respuesta_invitacion');
  }

  // enviarNotificacionLocal = async (title, body) => {
  //   let notificationId = await Notifications.presentLocalNotificationAsync({
  //     title: title,
  //     body: body,
  //   });
  //   console.log(notificationId); // can be saved in AsyncStorage or send to server
  // };

  async componentDidMount() {
    this.socket.on('respuesta_invitacion', (res) => {
      console.log('Respuesta invitación:', res);
      this.props.screenProps.enviarNotificacionLocal('Respuesta a invitación', `El conductor, ${this.state.conductor.nombre} ${this.state.conductor.apellido} ${res.respuesta == "0" ? 'no' : ''} ha aceptado tu invitación de colaboración.`);    
    });

    await this.comentarios();
    await this.datos_conductor();
    await this.logros();
    this.setState({
      isLoading: false
    });
  }

  async datos_conductor() {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      try {
        const result = await fetch(`http://35.203.42.33:3006/webservice/datos_conductor`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: this.state.id_conductor
          }),
        })

        const datos = await result.json();
        // console.log(datos);
        if (datos.datos.length > 0) {
          this.setState({ conductor: datos.datos[0] });
        } else {
          Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
          this.props.navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
        console.error(error);
      }
    } else {
      Alert.alert('Sin conexión', 'Verifique su conexión e intente nuevamente.');
    }
  }

  async comentarios() {
    try {
      const result = await fetch(`http://35.203.42.33:3006/webservice/comentarios_socio_a_conductor`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: this.state.id_conductor
        }),
      })

      const comentarios = await result.json();

      if (comentarios.msg) {
        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
        console.error(comentarios.msg);
        this.props.navigation.goBack();
      } else {
        // console.log(datos.datos);
        this.setState({
          comentarios: comentarios.datos.map(comentario => {
            return {
              socio: comentario.nombre_socio,
              msg: comentario.comentario
            }
          })
        });

        // console.log(this.state.comentarios);
      }
    } catch (error) {
      Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
      console.error(error);
    }
  }

  async logros() {
    try {
      const result = await fetch(`http://35.203.42.33:3006/webservice/logros_conductor`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: this.state.id_conductor
        }),
      })

      const logros = await result.json();
      if (logros.msg) {
        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
        console.error(logros.msg);
        this.props.navigation.goBack();
      } else {
        // console.log(comentarios.datos);
      }

    } catch (error) {
      Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
      console.error(error);
    }
  }

  async _invitarConductor() {
    try {
      let datos = {
        socket_id: this.props.navigation.getParam('socket_id', ''),
        id_conductor: this.state.id_conductor,
        id_propietario: this.state.id_propietario
      };

      this.socket.emit('enviarInvitacion', datos);
      // console.log('Enviar invitación');

      const result = await fetch('http://35.203.42.33:3006/webservice/interfaz55/invitar_conductor', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          in_id_propietario: this.state.id_propietario,
          in_usuario_conductor: this.state.id_conductor,
        })
      })

      const data = await result.json();
      // console.log(data);

      if (data.msg) {
        Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
        console.error(data.msg);
      } else {
        Alert.alert('Información', 'La invitación fué enviada con exito.');
      }
    } catch (error) {
      Alert.alert('Error', 'Servicio no disponible, intente de nuevo más tarde.');
      console.error(error);
    }
  }

  render() {
    return (
      this.state.isLoading ? <ActivityIndicator size="large" color="#ff8834" animating={this.state.isLoading} style={{ flex: 1 }} /> :
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
          <View elevation={4} style={{ flexDirection: 'column' }}>
            <View style={{ paddingTop: 10, flexDirection: "row", justifyContent: 'center' }}>

              {/* <Button
                type='clear'
                icon={{
                  name: "arrow-back",
                  size: 24,
                  color: '#000'
                }}
                containerStyle={{ flex: 1 }}
                buttonStyle={styles.backButton}
                onPress={() => this.props.navigation.goBack()}
              /> */}
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#cacaca', true)}
                onPress={() => this.props.navigation.goBack()}
              >
                <View style={{ position: 'absolute', top: 12, left: 15 }}>
                  <MaterialIcons
                    name={'arrow-back'}
                    size={24}
                  />
                </View>
              </TouchableNativeFeedback>
              <Image
                style={styles.imagen}
                resizeMode="cover"
                source={{ uri: this.state.conductor.fotografia }}
              />
              <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('#ff8834', true)}
                onPress={() => alert('Ayuda')}
              >
                <View style={{ flexDirection: 'column', alignItems: 'center', position: 'absolute', top: 12, right: 15 }}>
                  <Ionicons
                    name={'ios-help-circle'}
                    size={24}
                    color='#ff8834'
                  />
                  <Text style={{ fontFamily: 'aller-bd', fontSize: 12, color: '#ff8834' }}>Ayuda</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
              <Text style={[styles.textoBold, { flex: 1, textAlign: 'left', fontSize: 18 }]}>{`${this.state.conductor.nombre} ${this.state.conductor.apellido}`}</Text>
              <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`Edad:\n${this.state.conductor.edad} Años`}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.textoNormal, { textAlign: 'center', position: 'absolute', right: 0 }]}>{`Tel:\n${this.state.conductor.telefono}`}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 }}>
              <Icon
                type='font-awesome'
                name="hand-paper-o"
                size={24}
                color='#000'
              />
              <Text style={styles.textoNormal}>{`"${this.state.conductor.pequena_descripcion}"`}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type='font-awesome'
                  name="language"
                  size={24}
                  color='#000'
                />
                <Text style={[styles.textoNormal, { marginLeft: 5 }]}>{`Habla ${this.state.conductor.idiomas}`}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  type='font-awesome'
                  name="home"
                  size={24}
                  color='#000'
                />
                <Text style={[styles.textoNormal, { marginLeft: 5 }]}>{`De ${this.state.conductor.ciudad}`}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.textoNormal, { marginRight: 8 }]}>{`Tasa de\naceptación`}</Text>
                <Text style={[styles.textoBold, { fontSize: 36 }]}>{`${this.state.conductor.tasa_aceptacion}%`}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.textoNormal, { marginRight: 8 }]}>{`Tasa de\ncancelación`}</Text>
                <Text style={[styles.textoBold, { fontSize: 36 }]}>{`${this.state.conductor.tasa_cancelacion}%`}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 5 }}>
              <View style={{ flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={[styles.textoBold, { fontSize: 18, marginRight: 2 }]}>{this.state.conductor.calificacion}</Text>
                  <Icon
                    name='star'
                    color='#000'
                    size={18}
                    style={{ marginTop: 2 }}
                  />
                </View>
                <Text style={[styles.textoNormal, { textAlign: 'center' }]}>Calificación</Text>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.textoBold, { fontSize: 18, textAlign: 'center' }]}>{this.state.conductor.dias ? this.state.conductor.dias : 17}</Text>
                <Text style={[styles.textoNormal, { textAlign: 'center' }]}>Días</Text>
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text style={[styles.textoNormal, { fontSize: 18, textAlign: 'center' }]}>{`${this.state.conductor.viajes_finalizados}   ${this.state.conductor.viajes_finalizados}%`}</Text>
                <Text style={[styles.textoBold, { textAlign: 'center' }]}>Viajes finalizados</Text>
              </View>
            </View>
          </View>

          <Divider style={{ backgroundColor: '#bdbdbd' }} />

          <View style={{ marginTop: 5, marginBottom: 10, marginHorizontal: 10, flexDirection: 'column' }}>
            <Text style={styles.textoBold}>Reconocimientos</Text>
            <View style={{ marginTop: 10, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Excelente-servicio.png')}
                    style={{ width: 32, height: 32 }}
                  />
                  <Badge
                    value={this.state.conductor.reconocimiento1}
                    status="success"
                    containerStyle={styles.badge}
                    textStyle={styles.textoBadge}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Excelente\nservicio'}</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Buena-ruta.png')}
                    style={{ width: 32, height: 32 }}
                  />
                  <Badge
                    value={this.state.conductor.reconocimiento2}
                    status="success"
                    containerStyle={styles.badge}
                    textStyle={styles.textoBadge}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Buena\nruta'}</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Amable.png')}
                    style={{ width: 32, height: 32 }}
                  />
                  <Badge
                    value={this.state.conductor.reconocimiento3}
                    status="success"
                    containerStyle={styles.badge}
                    textStyle={styles.textoBadge}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center", marginVertical: 7 }]}>{'Amable'}</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Buena-charla.png')}
                    style={{ width: 32, height: 32 }}
                  />
                  <Badge
                    value={this.state.conductor.reconocimiento4}
                    status="success"
                    containerStyle={styles.badge}
                    textStyle={styles.textoBadge}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Buena\nconversación'}</Text>
              </View>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Heroe.png')}
                    style={{ width: 32, height: 32 }}
                  />
                  <Badge
                    value={this.state.conductor.reconocimiento5}
                    status="success"
                    containerStyle={styles.badge}
                    textStyle={styles.textoBadge}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center", marginVertical: 7 }]}>{'Heroe'}</Text>
              </View>
            </View>
          </View>

          <Divider style={{ backgroundColor: '#bdbdbd' }} />

          <View style={{ marginTop: 5, marginBottom: 5, marginHorizontal: 10, flexDirection: 'column' }}>
            <Text style={styles.textoBold}>Logros</Text>
            <View style={{ marginTop: 10, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.circuloIcono}>
                  <Image
                    source={require('../../assets/images/Logros.png')}
                    style={{ width: 32, height: 32 }}
                  />
                </View>
                <Text style={[styles.textoNormal, { fontSize: 12, marginVertical: 7 }]}>{`${this.state.logros.viajesconFestrellas} viajes de 5 estrellas`}</Text>
              </View>
              <Button
                title='Invitar'
                buttonStyle={{ marginTop: 5, paddingHorizontal: 30, backgroundColor: '#ff8834' }}
                titleStyle={{ fontFamily: 'aller-lt' }}
                onPress={() => this._invitarConductor()}
              />
            </View>
          </View>

          <Divider style={{ backgroundColor: '#bdbdbd' }} />

          <View style={{ flex: 1 }}>
            <Text style={[styles.textoBold, { textAlign: "center" }]}>Comentarios de socios</Text>
            <ScrollView>
              <View style={{ flex: 1, marginVertical: 5, marginHorizontal: 10 }}>
                {
                  this.state.comentarios.map((comentario, i) => {
                    return (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
                          <Icon
                            type='font-awesome'
                            name='user-circle'
                            color='#000'
                            size={16}
                            style={{ marginTop: 6 }}
                          />
                          <Text style={[styles.textoBold, { fontSize: 12, textAlign: 'center' }]}>{`${comentario.socio.split(' ')[0]} ${comentario.socio.split(' ')[1]}`}</Text>
                        </View>
                        <Text style={[styles.textoNormal, { fontSize: 12, flex: 2 }]}>{comentario.msg}</Text>
                      </View>
                    );
                  })
                }
              </View>
            </ScrollView>
          </View>

        </SafeAreaView >
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
  backButton: {
    position: 'absolute',
    left: 0
  },
  imagen: {
    width: 80,
    height: 80,
    alignSelf: 'center'
  },
  helpButton: {
    position: 'absolute',
    flexDirection: 'column',
    right: 0,
    top: -10
  },
  helpButtonTitle: {
    flex: 1,
    fontFamily: 'aller-lt',
    fontSize: 12,
    bottom: 0
  },
  textoNormal: {
    fontFamily: 'aller-lt',
    fontSize: 14
  },
  textoBold: {
    fontFamily: 'aller-bd',
    fontSize: 14
  },
  circuloIcono: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 46,
    height: 46,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 23
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -15,
    width: 30,
    height: 30
  },
  textoBadge: {
    fontFamily: 'aller-lt',
    fontSize: 10,
    position: 'absolute'
  }
});