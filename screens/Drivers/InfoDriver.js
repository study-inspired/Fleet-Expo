/**
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StatusBar
} from 'react-native';
import { Button, Icon, Divider, Badge } from 'react-native-elements'


export default class InfoDriver extends React.Component {

  static navigationOptions = {
    header: null
  };

  state = {
    isLoading: false,
    hascommentary: true,
    fecha: "10/10/2019",
    conductor: {
      fotoconductor: false,
      nombreconductor: "Pedro Campos",
      edadconductor: 23,
      telefonoconductor: "1234567890",
      comentarioconductor: "Padre de familia, responsable y atento",
      idiomaconductor: "Ingles y Español",
      Vive: "Colima"
    },
    viajes: {
      tasaaceptacion: "87%",
      tasacancelacion: "13%",
      calificacion: "4.99",
      dias: "17",
      viajesfinalizados: "1,245",
      viajesfinalizadosporcentaje: "94%"
    },
    reconocimientos: {
      excelenteservicio: "10",
      buenaruta: "8",
      amable: "19",
      buenaconversacion: "+99",
      heroe: "10"
    },
    logros: {
      viajesconFestrellas: "90"
    },
    comentarios: [
      {
        socio: "Perez Mesa Carlos",
        msg: "Muy buen conductor"
      },
      {
        socio: "Juan Carbajal Ramos",
        msg: "Muy buen conductor aunque le da rapido"
      },
      {
        socio: "Fernando Manzo Virgen",
        msg: "Es tranquilo"
      },
      {
        socio: "Perez Mesa Carlos",
        msg: "Muy buen conductor"
      },
      {
        socio: "Juan Carbajal Ramos",
        msg: "Muy buen conductor aunque le da rapido"
      },
      {
        socio: "Fernando Manzo Virgen",
        msg: "Es tranquilo"
      },
      {
        socio: "Perez Mesa Carlos",
        msg: "Muy buen conductor"
      },
      {
        socio: "Juan Carbajal Ramos",
        msg: "Muy buen conductor aunque le da rapido"
      },
      {
        socio: "Fernando Manzo Virgen",
        msg: "Es tranquilo"
      },
      {
        socio: "Perez Mesa Carlos",
        msg: "Muy buen conductor"
      },
      {
        socio: "Juan Carbajal Ramos",
        msg: "Muy buen conductor aunque le da rapido"
      },
      {
        socio: "Fernando Manzo Virgen",
        msg: "Es tranquilo"
      }
    ]
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <View elevation={4} style={{ flexDirection: 'column' }}>
          <View style={{ paddingTop: 10, flexDirection: "row" }}>
            <Button
              type='clear'
              icon={{
                name: "arrow-back",
                size: 24,
                color: '#000'
              }}
              containerStyle={{ flex: 1 }}
              buttonStyle={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            />
            <Image
              style={styles.imagen}
              resizeMode="cover"
              source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}
            />
            <Button
              type='clear'
              icon={{
                name: "help",
                size: 32,
                color: '#ff8834'
              }}
              containerStyle={{ flex: 1 }}
              buttonStyle={styles.helpButton}
              iconContainerStyle={{ flex: 1 }}
              titleStyle={styles.helpButtonTitle}
              title="Ayuda"
            />
            <Text style={styles.fecha}>{this.state.fecha}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
            <Text style={[styles.textoBold, { flex: 1, textAlign: 'left', fontSize: 18 }]}>{this.state.conductor.nombreconductor}</Text>
            <Text style={[styles.textoNormal, { flex: 1, textAlign: 'center' }]}>{`Edad:\n${this.state.conductor.edadconductor} Años`}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.textoNormal, { textAlign: 'center', position: 'absolute', right: 0 }]}>{`Tel:\n${this.state.conductor.telefonoconductor}`}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 10 }}>
            <Icon
              type='font-awesome'
              name="hand-paper-o"
              size={24}
              color='#000'
            />
            <Text style={styles.textoNormal}>{`"${this.state.conductor.comentarioconductor}"`}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                type='font-awesome'
                name="language"
                size={24}
                color='#000'
              />
              <Text style={[styles.textoNormal, { marginLeft: 5 }]}>{`Habla ${this.state.conductor.idiomaconductor}`}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                type='font-awesome'
                name="home"
                size={24}
                color='#000'
              />
              <Text style={[styles.textoNormal, { marginLeft: 5 }]}>{`De ${this.state.conductor.Vive}`}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.textoNormal, { marginRight: 8 }]}>{`Tasa de\naceptación`}</Text>
              <Text style={[styles.textoBold, { fontSize: 36 }]}>{this.state.viajes.tasaaceptacion}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.textoNormal, { marginRight: 8 }]}>{`Tasa de\ncancelación`}</Text>
              <Text style={[styles.textoBold, { fontSize: 36 }]}>{this.state.viajes.tasacancelacion}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginBottom: 5 }}>
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[styles.textoBold, { fontSize: 18, marginRight: 2 }]}>{this.state.viajes.calificacion}</Text>
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
              <Text style={[styles.textoBold, { fontSize: 18, textAlign: 'center' }]}>{this.state.viajes.dias}</Text>
              <Text style={[styles.textoNormal, { textAlign: 'center' }]}>Días</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <Text style={[styles.textoNormal, { fontSize: 18, textAlign: 'center' }]}>{`${this.state.viajes.viajesfinalizados}  ${this.state.viajes.viajesfinalizadosporcentaje}`}</Text>
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
                <Icon
                  type='font-awesome'
                  name='thumbs-o-up'
                  color='#000'
                  size={32}
                  style={{ marginTop: 2 }}
                />
                <Badge
                  value={this.state.reconocimientos.excelenteservicio}
                  status="success"
                  containerStyle={styles.badge}
                  textStyle={styles.textoBadge}
                />
              </View>
              <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Excelente\nservicio'}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.circuloIcono}>
                <Icon
                  type='material-community'
                  name='map-marker'
                  color='#000'
                  size={32}
                  style={{ marginTop: 2 }}
                />
                <Badge
                  value={this.state.reconocimientos.buenaruta}
                  status="success"
                  containerStyle={styles.badge}
                  textStyle={styles.textoBadge}
                />
              </View>
              <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Buena\nruta'}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.circuloIcono}>
                <Icon
                  type='font-awesome'
                  name='smile-o'
                  color='#000'
                  size={32}
                  style={{ marginTop: 2 }}
                />
                <Badge
                  value={this.state.reconocimientos.amable}
                  status="success"
                  containerStyle={styles.badge}
                  textStyle={styles.textoBadge}
                />
              </View>
              <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center", marginVertical: 7 }]}>{'Amable'}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.circuloIcono}>
                <Icon
                  type='antdesign'
                  name='message1'
                  color='#000'
                  size={32}
                  style={{ marginTop: 2 }}
                />
                <Badge
                  value={this.state.reconocimientos.buenaconversacion}
                  status="success"
                  containerStyle={styles.badge}
                  textStyle={styles.textoBadge}
                />
              </View>
              <Text style={[styles.textoNormal, { fontSize: 12, textAlign: "center" }]}>{'Buena\nconversación'}</Text>
            </View>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <View style={styles.circuloIcono}>
                <Icon
                  type='font-awesome'
                  name='shield'
                  color='#000'
                  size={32}
                  style={{ marginTop: 6 }}
                />
                <Badge
                  value={this.state.reconocimientos.heroe}
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
                <Icon
                  type='ionicon'
                  name='ios-trophy'
                  color='#000'
                  size={32}
                  style={{ marginTop: 6 }}
                />
              </View>
              <Text style={[styles.textoNormal, { fontSize: 12, marginVertical: 7 }]}>{`${this.state.logros.viajesconFestrellas} viajes de 5 estrellas`}</Text>
            </View>
            <Button
              title='Invitar'
              buttonStyle={{ marginTop: 5, paddingHorizontal: 30, backgroundColor: '#ff8834' }}
              titleStyle={{ fontFamily: 'aller-lt' }}
              onPress={() => Alert.alert('Invitar', 'Invitando')}
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
  fecha: {
    fontFamily: 'aller-lt',
    fontSize: 16,
    position: 'absolute',
    right: 10,
    bottom: -5
  },
  textoNormal: {
    fontFamily: 'aller-lt',
    fontSize: 16
  },
  textoBold: {
    fontFamily: 'aller-bd',
    fontSize: 16
  },
  circuloIcono: {
    flexDirection: "column",
    justifyContent: "center",
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