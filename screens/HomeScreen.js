import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
  Overlay
} from 'react-native-elements'

import DateRangePicker from '../components/DateRangePicker'

import { Calendar } from 'react-native-calendars';

import { MonoText } from '../components/StyledText';

export default class StartScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    visible: false,
    markedDates: null
  }

  componentDidMount() {
    this.getWeek(new Date());
  }

  formatDate(yyyy, mm, dd) {
    let m = (mm > 9) ? `${mm}` : `0${mm}`;
    let d = (dd > 9) ? `${dd}` : `0${dd}`;
    return `${yyyy}-${m}-${d}`;
  }

  getWeek(date) {
    // console.log(date);
    
    let dates = {};
    let startDay = date;
    startDay.setDate(date.getDate() - (date.getDay() - 0)); // domingo
    // console.log(startDay);

    dates[this.formatDate(startDay.getFullYear(), startDay.getMonth()+1, startDay.getDate())] = {color: '#ff8834', textColor: 'white'};

    for (let day = 1; day < 7; day++) {
      startDay.setDate(startDay.getDate() + 1);
      dates[this.formatDate(startDay.getFullYear(), startDay.getMonth()+1, startDay.getDate())] = {color: '#ff8834', textColor: 'white'};
    }

    this.setState({ markedDates: dates });
  }

  render() {
    return ( 
      <View style={styles.container}>
        <Overlay
          isVisible={this.state.visible}
          width={300}
          height={400}
          onBackdropPress={ () => this.setState({ visible: false }) }
        >
          <View style={{ flex: 1 }}>
            <Calendar
              theme={{
                textDayFontFamily: 'aller-lt',
                textMonthFontFamily: 'aller-lt',
                textDayHeaderFontFamily: 'aller-bd',
              }}
              onDayPress={ (day) => this.getWeek(new Date(day.dateString)) }
              markedDates={ this.state.markedDates }
              markingType={'period'}
            />
            {/*<Button
              title='cerrar'
              onPress={ () => this.setState({ visible: false }) }
            />*/}
          </View>
        </Overlay>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>
  
          <View style={styles.getStartedContainer}>
            <DevelopmentModeNotice />
            <Text style={[styles.getStartedText, styles.fontNormal]}>
              Change this text and your app will automatically reload.
            </Text>
          </View>
        </ScrollView>
  
        <View style={styles.tabBarInfoContainer}>
          <Button
            title='Seleccionar semana'
            onPress={ () => this.setState( { visible: true } ) }
          />
  
          <View
            style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>
              navigation/MainTabNavigator.js
            </MonoText>
          </View>
        </View>
      </View>
    );
  }
}

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  fontNormal: {
    fontFamily: 'aller-lt'
  },
  fontBold: {
    fontFamily: 'aller-rg'
  }
});
